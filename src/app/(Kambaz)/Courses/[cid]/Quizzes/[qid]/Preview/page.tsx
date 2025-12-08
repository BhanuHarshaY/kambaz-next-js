"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setCurrentQuiz } from "../../reducer";
import { Question, Choice } from "../../reducer";
import * as client from "../../../../client";
import {
  Container,
  Button,
  Card,
  Alert,
  Form,
  ProgressBar,
} from "react-bootstrap";

interface Answer {
  questionId: string;
  questionType: string;
  selectedChoiceId?: string;
  selectedAnswer?: boolean;
  textAnswers?: string[];
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const isFaculty = currentUser?.role === "FACULTY";

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await client.findQuizById(qid as string);
        dispatch(setCurrentQuiz(quiz));
        
        // Shuffle questions if enabled
        let questions = [...quiz.questions];
        if (quiz.shuffleAnswers) {
          questions = questions.sort(() => Math.random() - 0.5);
          // Also shuffle choices for multiple choice
          questions = questions.map((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
              return {
                ...q,
                choices: [...q.choices].sort(() => Math.random() - 0.5),
              };
            }
            return q;
          });
        }
        setShuffledQuestions(questions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };
    if (qid) {
      fetchQuiz();
    }
  }, [qid, dispatch]);

  // Redirect non-faculty
  useEffect(() => {
    if (!loading && !isFaculty) {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [loading, isFaculty, cid, qid, router]);

  // Get answer for a question
  const getAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId);
  };

  // Set answer for multiple choice
  const setMultipleChoiceAnswer = (questionId: string, choiceId: string) => {
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([
      ...existing,
      { questionId, questionType: "MULTIPLE_CHOICE", selectedChoiceId: choiceId },
    ]);
  };

  // Set answer for true/false
  const setTrueFalseAnswer = (questionId: string, answer: boolean) => {
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([
      ...existing,
      { questionId, questionType: "TRUE_FALSE", selectedAnswer: answer },
    ]);
  };

  // Set answer for fill in blank
  const setFillInBlankAnswer = (questionId: string, text: string) => {
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([
      ...existing,
      { questionId, questionType: "FILL_IN_BLANK", textAnswers: [text] },
    ]);
  };

  // Grade the quiz
  const gradeQuiz = () => {
    let totalScore = 0;

    shuffledQuestions.forEach((question) => {
      const answer = getAnswer(question._id);
      if (!answer) return;

      let isCorrect = false;

      switch (question.type) {
        case "MULTIPLE_CHOICE":
          const correctChoice = question.choices.find((c) => c.isCorrect);
          isCorrect = correctChoice?._id === answer.selectedChoiceId;
          break;
        case "TRUE_FALSE":
          isCorrect = question.correctAnswer === answer.selectedAnswer;
          break;
        case "FILL_IN_BLANK":
          if (answer.textAnswers && answer.textAnswers[0]) {
            const userAnswer = answer.textAnswers[0].toLowerCase().trim();
            isCorrect = question.blankAnswers.some(
              (ba) => ba.text.toLowerCase().trim() === userAnswer
            );
          }
          break;
      }

      if (isCorrect) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  // Check if answer is correct (for showing results)
  const isAnswerCorrect = (question: Question): boolean => {
    const answer = getAnswer(question._id);
    if (!answer) return false;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        const correctChoice = question.choices.find((c) => c.isCorrect);
        return correctChoice?._id === answer.selectedChoiceId;
      case "TRUE_FALSE":
        return question.correctAnswer === answer.selectedAnswer;
      case "FILL_IN_BLANK":
        if (answer.textAnswers && answer.textAnswers[0]) {
          const userAnswer = answer.textAnswers[0].toLowerCase().trim();
          return question.blankAnswers.some(
            (ba) => ba.text.toLowerCase().trim() === userAnswer
          );
        }
        return false;
      default:
        return false;
    }
  };

  if (loading) {
    return <Container><p>Loading preview...</p></Container>;
  }

  if (!currentQuiz) {
    return (
      <Container>
        <Alert variant="danger">Quiz not found</Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;

  return (
    <Container>
      <h2>{currentQuiz.title}</h2>
      <Alert variant="warning">
        ⓘ This is a preview of the published version of the quiz
      </Alert>
      <p className="text-muted">
        Started: {new Date().toLocaleString()}
      </p>

      <h4>Quiz Instructions</h4>
      <p>{currentQuiz.description || "No instructions provided."}</p>

      <hr />

      {/* Results if submitted */}
      {submitted && (
        <Alert variant={score >= currentQuiz.points / 2 ? "success" : "danger"}>
          <strong>Score:</strong> {score} / {currentQuiz.points} ({Math.round((score / currentQuiz.points) * 100)}%)
        </Alert>
      )}

      {/* Progress */}
      <ProgressBar 
        now={(currentQuestionIndex + 1) / totalQuestions * 100} 
        label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
        className="mb-4"
      />

      {/* Current Question */}
      {currentQuestion && (
        <Card className={`mb-4 ${submitted ? (isAnswerCorrect(currentQuestion) ? "border-success" : "border-danger") : ""}`}>
          <Card.Header className="d-flex justify-content-between">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{currentQuestion.points} pts</span>
          </Card.Header>
          <Card.Body>
            <p className="mb-4">{currentQuestion.question}</p>

            {/* Multiple Choice */}
            {currentQuestion.type === "MULTIPLE_CHOICE" && (
              <div>
                {currentQuestion.choices.map((choice) => {
                  const answer = getAnswer(currentQuestion._id);
                  const isSelected = answer?.selectedChoiceId === choice._id;
                  const showCorrect = submitted && choice.isCorrect;
                  const showWrong = submitted && isSelected && !choice.isCorrect;

                  return (
                    <Form.Check
                      key={choice._id}
                      type="radio"
                      name={`q-${currentQuestion._id}`}
                      label={choice.text}
                      checked={isSelected}
                      onChange={() => !submitted && setMultipleChoiceAnswer(currentQuestion._id, choice._id)}
                      disabled={submitted}
                      className={`mb-2 ${showCorrect ? "text-success" : ""} ${showWrong ? "text-danger" : ""}`}
                    />
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {currentQuestion.type === "TRUE_FALSE" && (
              <div>
                {[true, false].map((value) => {
                  const answer = getAnswer(currentQuestion._id);
                  const isSelected = answer?.selectedAnswer === value;
                  const showCorrect = submitted && currentQuestion.correctAnswer === value;
                  const showWrong = submitted && isSelected && currentQuestion.correctAnswer !== value;

                  return (
                    <Form.Check
                      key={value.toString()}
                      type="radio"
                      name={`q-${currentQuestion._id}`}
                      label={value ? "True" : "False"}
                      checked={isSelected}
                      onChange={() => !submitted && setTrueFalseAnswer(currentQuestion._id, value)}
                      disabled={submitted}
                      className={`mb-2 ${showCorrect ? "text-success" : ""} ${showWrong ? "text-danger" : ""}`}
                    />
                  );
                })}
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQuestion.type === "FILL_IN_BLANK" && (
              <div>
                <Form.Control
                  type="text"
                  placeholder="Your answer..."
                  value={getAnswer(currentQuestion._id)?.textAnswers?.[0] || ""}
                  onChange={(e) => !submitted && setFillInBlankAnswer(currentQuestion._id, e.target.value)}
                  disabled={submitted}
                  className={submitted ? (isAnswerCorrect(currentQuestion) ? "border-success" : "border-danger") : ""}
                />
                {submitted && !isAnswerCorrect(currentQuestion) && (
                  <small className="text-success">
                    Correct answers: {currentQuestion.blankAnswers.map((a) => a.text).join(", ")}
                  </small>
                )}
              </div>
            )}

            {/* Show result icon */}
            {submitted && (
              <div className="mt-3">
                {isAnswerCorrect(currentQuestion) ? (
                  <span className="text-success">✓ Correct</span>
                ) : (
                  <span className="text-danger">✗ Incorrect</span>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between mb-4">
        <Button
          variant="outline-secondary"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          ← Previous
        </Button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next →
          </Button>
        ) : !submitted ? (
          <Button variant="danger" onClick={gradeQuiz}>
            Submit Quiz
          </Button>
        ) : null}
      </div>

      {/* Question navigation */}
      <Card className="mb-4">
        <Card.Header>Questions</Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            {shuffledQuestions.map((q, index) => {
              const hasAnswer = getAnswer(q._id);
              const isCorrect = submitted && isAnswerCorrect(q);
              
              return (
                <Button
                  key={q._id}
                  variant={
                    submitted
                      ? isCorrect
                        ? "success"
                        : "danger"
                      : hasAnswer
                      ? "primary"
                      : "outline-secondary"
                  }
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={currentQuestionIndex === index ? "border-dark border-2" : ""}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Actions */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit/Questions`)}
        >
          ✏️ Keep Editing This Quiz
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
        >
          Back to Quiz Details
        </Button>
      </div>
    </Container>
  );
}