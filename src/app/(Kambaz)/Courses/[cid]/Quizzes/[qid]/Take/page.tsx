"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setCurrentQuiz } from "../../reducer";
import { Question } from "../../reducer";
import * as client from "../../../../client";
import {
  Container,
  Button,
  Card,
  Alert,
  Form,
  ProgressBar,
  Modal,
} from "react-bootstrap";

interface Answer {
  questionId: string;
  questionType: string;
  selectedChoiceId?: string;
  selectedChoiceIds?: string[]; // For multiple correct answers
  selectedAnswer?: boolean;
  textAnswers?: string[];
}

interface Attempt {
  _id: string;
  quiz: string;
  user: string;
  startedAt: string;
  submittedAt?: string;
  answers: Answer[];
  score: number;
  totalPoints: number;
  percentage: number;
  status: string;
}

export default function QuizTake() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Access code modal
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");

  const isStudent = currentUser?.role === "STUDENT";

  // Submit quiz function (memoized)
  const submitQuiz = useCallback(async (timedOut: boolean = false) => {
    if (!attempt) return;

    try {
      const result = await client.submitAttempt(attempt._id, timedOut);
      setAttempt(result);
      setSubmitted(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  }, [attempt]);

  // Fetch quiz and start/resume attempt
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const quiz = await client.findQuizById(qid as string);
        dispatch(setCurrentQuiz(quiz));

        // Check if access code is required
        if (quiz.accessCode && isStudent) {
          setShowAccessCodeModal(true);
          setLoading(false);
          return;
        }

        await startOrResumeAttempt(quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    if (qid && currentUser) {
      initQuiz();
    }
  }, [qid, dispatch, currentUser, isStudent]);

  const startOrResumeAttempt = async (quiz: typeof currentQuiz, code?: string) => {
    try {
      // Try to start attempt
      const attemptData = await client.startAttempt(quiz!._id, code);
      setAttempt(attemptData);
      setAnswers(attemptData.answers || []);

      // Shuffle questions if enabled
      let questions = [...quiz!.questions];
      if (quiz!.shuffleAnswers) {
        questions = questions.sort(() => Math.random() - 0.5);
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

      // Set up timer if time limit exists
      if (quiz!.hasTimeLimit && quiz!.timeLimit > 0) {
        const startTime = new Date(attemptData.startedAt).getTime();
        const endTime = startTime + quiz!.timeLimit * 60 * 1000;
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeRemaining(remaining);
      }

      setLoading(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error("Error starting attempt:", error);
      if (err.response?.data?.error === "Invalid access code") {
        setAccessCodeError("Invalid access code. Please try again.");
      } else if (err.response?.data?.error === "Maximum attempts reached") {
        alert("You have reached the maximum number of attempts for this quiz.");
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;

        // Show warning at 5 minutes
        if (prev === 300) {
          setShowWarning(true);
        }

        // Auto-submit when time runs out
        if (prev <= 1) {
          submitQuiz(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, submitted, submitQuiz]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Save answer to server
  const saveAnswerToServer = async (answer: Answer) => {
    if (!attempt) return;
    try {
      await client.saveAnswer(attempt._id, answer);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  // Get answer for a question
  const getAnswer = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId);
  };

  // Set answer for multiple choice (single selection)
  const setMultipleChoiceAnswer = (questionId: string, choiceId: string) => {
    const answer: Answer = {
      questionId,
      questionType: "MULTIPLE_CHOICE",
      selectedChoiceId: choiceId,
      selectedChoiceIds: [choiceId],
    };
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([...existing, answer]);
    saveAnswerToServer(answer);
  };

  // Toggle answer for multiple choice (multiple selection)
  const toggleMultipleChoiceAnswer = (questionId: string, choiceId: string, question: Question) => {
    const existingAnswer = getAnswer(questionId);
    const currentIds = existingAnswer?.selectedChoiceIds || [];

    let newIds: string[];
    if (currentIds.includes(choiceId)) {
      // Remove this choice
      newIds = currentIds.filter(id => id !== choiceId);
    } else {
      // Add this choice
      newIds = [...currentIds, choiceId];
    }

    const answer: Answer = {
      questionId,
      questionType: "MULTIPLE_CHOICE",
      selectedChoiceId: newIds[0] || undefined, // Keep for backward compatibility
      selectedChoiceIds: newIds,
    };
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([...existing, answer]);
    saveAnswerToServer(answer);
  };

  // Set answer for true/false
  const setTrueFalseAnswer = (questionId: string, answerValue: boolean) => {
    const answer: Answer = {
      questionId,
      questionType: "TRUE_FALSE",
      selectedAnswer: answerValue,
    };
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([...existing, answer]);
    saveAnswerToServer(answer);
  };

  // Set answer for fill in blank
  const setFillInBlankAnswer = (questionId: string, text: string) => {
    const answer: Answer = {
      questionId,
      questionType: "FILL_IN_BLANK",
      textAnswers: [text],
    };
    const existing = answers.filter((a) => a.questionId !== questionId);
    setAnswers([...existing, answer]);
    saveAnswerToServer(answer);
  };

  // Handle access code submission
  const handleAccessCodeSubmit = async () => {
    if (!currentQuiz) return;
    setAccessCodeError("");
    await startOrResumeAttempt(currentQuiz, accessCode);
    if (!accessCodeError) {
      setShowAccessCodeModal(false);
    }
  };

  // Check if answer is correct (for showing results)
  const isAnswerCorrect = (question: Question): boolean => {
    const answer = getAnswer(question._id);
    if (!answer) return false;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        const correctChoices = question.choices.filter((c) => c.isCorrect);
        const selectedIds = answer.selectedChoiceIds || (answer.selectedChoiceId ? [answer.selectedChoiceId] : []);

        if (correctChoices.length === 1) {
          // Single correct answer
          return correctChoices[0]._id === selectedIds[0] && selectedIds.length === 1;
        } else {
          // Multiple correct - all correct selected and no wrong ones
          const allCorrectSelected = correctChoices.every(c => selectedIds.includes(c._id));
          const noWrongSelected = selectedIds.every(id => correctChoices.some(c => c._id === id));
          return allCorrectSelected && noWrongSelected;
        }
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

  // Should show correct answers?
  const shouldShowCorrectAnswers = () => {
    if (!currentQuiz || !submitted) return false;

    switch (currentQuiz.showCorrectAnswers) {
      case "Immediately":
        return true;
      case "After Due Date":
        if (!currentQuiz.dueDate) return false;
        return new Date() > new Date(currentQuiz.dueDate);
      case "Never":
        return false;
      default:
        return false;
    }
  };

  // Redirect non-students or if quiz not published
  useEffect(() => {
    if (!loading && currentQuiz && !currentQuiz.published && isStudent) {
      router.push(`/Courses/${cid}/Quizzes`);
    }
  }, [loading, currentQuiz, isStudent, cid, router]);

  if (loading) {
    return <Container><p>Loading quiz...</p></Container>;
  }

  // Access Code Modal
  if (showAccessCodeModal) {
    return (
      <Container>
        <Modal show={true} onHide={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          <Modal.Header closeButton>
            <Modal.Title>Access Code Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please enter the access code to start this quiz.</p>
            <Form.Control
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              isInvalid={!!accessCodeError}
            />
            {accessCodeError && (
              <Form.Control.Feedback type="invalid">
                {accessCodeError}
              </Form.Control.Feedback>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAccessCodeSubmit}>
              Start Quiz
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  if (!currentQuiz || !attempt) {
    return (
      <Container>
        <Alert variant="danger">Quiz not found or unable to start attempt</Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const showAnswers = shouldShowCorrectAnswers();

  return (
    <Container>
      <h2>{currentQuiz.title}</h2>

      {/* Timer Warning Modal */}
      <Modal show={showWarning} onHide={() => setShowWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Time Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have 5 minutes remaining! Make sure to submit your quiz before time runs out.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWarning(false)}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Timer */}
      {timeRemaining !== null && !submitted && (
        <Alert variant={timeRemaining <= 300 ? "danger" : "info"}>
          <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
        </Alert>
      )}

      <p className="text-muted">
        Started: {new Date(attempt.startedAt).toLocaleString()}
      </p>

      <h4>Quiz Instructions</h4>
      <p>{currentQuiz.description || "No instructions provided."}</p>

      <hr />

      {/* Results if submitted */}
      {submitted && (
        <Alert variant={attempt.percentage >= 50 ? "success" : "danger"}>
          <strong>Score:</strong> {attempt.score} / {attempt.totalPoints} ({attempt.percentage}%)
          <br />
          <small>Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "N/A"}</small>
          {attempt.status === "TIMED_OUT" && (
            <span className="ms-2 text-warning">(Timed Out)</span>
          )}
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
        <Card className={`mb-4 ${submitted && showAnswers ? (isAnswerCorrect(currentQuestion) ? "border-success" : "border-danger") : ""}`}>
          <Card.Header className="d-flex justify-content-between">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{currentQuestion.points} pts</span>
          </Card.Header>
          <Card.Body>
            <p className="mb-4">{currentQuestion.question}</p>

            {/* Multiple Choice */}
            {currentQuestion.type === "MULTIPLE_CHOICE" && (() => {
              const correctChoices = currentQuestion.choices.filter(c => c.isCorrect);
              const hasMultipleCorrect = correctChoices.length > 1;
              const answer = getAnswer(currentQuestion._id);
              const selectedIds = answer?.selectedChoiceIds || (answer?.selectedChoiceId ? [answer.selectedChoiceId] : []);

              return (
                <div>
                  {hasMultipleCorrect && (
                    <p className="text-muted small mb-2">Select all correct answers (partial credit applies)</p>
                  )}
                  {currentQuestion.choices.map((choice) => {
                    const isSelected = selectedIds.includes(choice._id);
                    const showCorrect = submitted && showAnswers && choice.isCorrect;
                    const showWrong = submitted && showAnswers && isSelected && !choice.isCorrect;

                    return (
                      <Form.Check
                        key={choice._id}
                        type={hasMultipleCorrect ? "checkbox" : "radio"}
                        name={`q-${currentQuestion._id}`}
                        label={choice.text}
                        checked={isSelected}
                        onChange={() => {
                          if (!submitted) {
                            if (hasMultipleCorrect) {
                              toggleMultipleChoiceAnswer(currentQuestion._id, choice._id, currentQuestion);
                            } else {
                              setMultipleChoiceAnswer(currentQuestion._id, choice._id);
                            }
                          }
                        }}
                        disabled={submitted}
                        className={`mb-2 ${showCorrect ? "text-success fw-bold" : ""} ${showWrong ? "text-danger" : ""}`}
                      />
                    );
                  })}
                </div>
              );
            })()}

            {/* True/False */}
            {currentQuestion.type === "TRUE_FALSE" && (
              <div>
                {[true, false].map((value) => {
                  const answer = getAnswer(currentQuestion._id);
                  const isSelected = answer?.selectedAnswer === value;
                  const showCorrect = submitted && showAnswers && currentQuestion.correctAnswer === value;
                  const showWrong = submitted && showAnswers && isSelected && currentQuestion.correctAnswer !== value;

                  return (
                    <Form.Check
                      key={value.toString()}
                      type="radio"
                      name={`q-${currentQuestion._id}`}
                      label={value ? "True" : "False"}
                      checked={isSelected}
                      onChange={() => !submitted && setTrueFalseAnswer(currentQuestion._id, value)}
                      disabled={submitted}
                      className={`mb-2 ${showCorrect ? "text-success fw-bold" : ""} ${showWrong ? "text-danger" : ""}`}
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
                  className={submitted && showAnswers ? (isAnswerCorrect(currentQuestion) ? "border-success" : "border-danger") : ""}
                />
                {submitted && showAnswers && !isAnswerCorrect(currentQuestion) && (
                  <small className="text-success">
                    Correct answers: {currentQuestion.blankAnswers.map((a) => a.text).join(", ")}
                  </small>
                )}
              </div>
            )}

            {/* Show result icon */}
            {submitted && showAnswers && (
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
          <Button variant="danger" onClick={() => submitQuiz(false)}>
            Submit Quiz
          </Button>
        ) : null}
      </div>

      {/* Auto-save indicator */}
      {!submitted && (
        <p className="text-muted text-center small">
          Quiz saved at {new Date().toLocaleTimeString()}
        </p>
      )}

      {/* Question navigation */}
      <Card className="mb-4">
        <Card.Header>Questions</Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            {shuffledQuestions.map((q, index) => {
              const hasAnswer = getAnswer(q._id);
              const isCorrect = submitted && showAnswers && isAnswerCorrect(q);
              const isWrong = submitted && showAnswers && !isAnswerCorrect(q);

              return (
                <Button
                  key={q._id}
                  variant={
                    submitted && showAnswers
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

      {/* Back button */}
      <Button
        variant="secondary"
        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
      >
        Back to Quiz Details
      </Button>
    </Container>
  );
}