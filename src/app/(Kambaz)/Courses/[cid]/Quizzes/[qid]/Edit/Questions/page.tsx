"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../store";
import { setCurrentQuiz, setQuizzes } from "../../../reducer";
import { Quiz, Question, Choice, BlankAnswer, QuestionGroup } from "../../../reducer";
import * as client from "../../../../../client";
import {
  Container,
  Button,
  Form,
  Card,
  Nav,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import QuestionGroupEditor from "./QuestionGroupEditor";
import FindQuestionsModal from "./FindQuestionsModal";

// Question Editor Component
function QuestionEditor({
  question,
  onSave,
  onCancel,
  onDelete,
}: {
  question: Question;
  onSave: (q: Question) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [editedQuestion, setEditedQuestion] = useState<Question>({ ...question });

  // Add a choice
  const addChoice = () => {
    const newChoice: Choice = { _id: uuidv4(), text: "", isCorrect: false };
    setEditedQuestion({
      ...editedQuestion,
      choices: [...editedQuestion.choices, newChoice],
    });
  };

  // Remove a choice
  const removeChoice = (choiceId: string) => {
    setEditedQuestion({
      ...editedQuestion,
      choices: editedQuestion.choices.filter((c) => c._id !== choiceId),
    });
  };

  // Update choice text
  const updateChoiceText = (choiceId: string, text: string) => {
    setEditedQuestion({
      ...editedQuestion,
      choices: editedQuestion.choices.map((c) =>
        c._id === choiceId ? { ...c, text } : c
      ),
    });
  };

  // Toggle correct choice (multiple selection allowed)
  const toggleCorrectChoice = (choiceId: string) => {
    setEditedQuestion({
      ...editedQuestion,
      choices: editedQuestion.choices.map((c) => ({
        ...c,
        isCorrect: c._id === choiceId ? !c.isCorrect : c.isCorrect,
      })),
    });
  };

  // Add blank answer
  const addBlankAnswer = () => {
    const newAnswer: BlankAnswer = { _id: uuidv4(), text: "" };
    setEditedQuestion({
      ...editedQuestion,
      blankAnswers: [...editedQuestion.blankAnswers, newAnswer],
    });
  };

  // Remove blank answer
  const removeBlankAnswer = (answerId: string) => {
    setEditedQuestion({
      ...editedQuestion,
      blankAnswers: editedQuestion.blankAnswers.filter((a) => a._id !== answerId),
    });
  };

  // Update blank answer
  const updateBlankAnswer = (answerId: string, text: string) => {
    setEditedQuestion({
      ...editedQuestion,
      blankAnswers: editedQuestion.blankAnswers.map((a) =>
        a._id === answerId ? { ...a, text } : a
      ),
    });
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <Form.Control
            type="text"
            value={editedQuestion.title}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, title: e.target.value })}
            style={{ width: "200px" }}
            placeholder="Question Title"
          />
          <Form.Select
            value={editedQuestion.type}
            onChange={(e) => setEditedQuestion({
              ...editedQuestion,
              type: e.target.value as Question["type"],
            })}
            style={{ width: "180px" }}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_IN_BLANK">Fill in the Blank</option>
          </Form.Select>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span>pts:</span>
          <Form.Control
            type="number"
            value={editedQuestion.points}
            onChange={(e) => setEditedQuestion({
              ...editedQuestion,
              points: parseInt(e.target.value) || 0,
            })}
            style={{ width: "70px" }}
            min={0}
          />
        </div>
      </Card.Header>
      <Card.Body>
        {/* Instructions based on question type */}
        <p className="text-muted small">
          {editedQuestion.type === "MULTIPLE_CHOICE" &&
            "Enter your question and multiple answers, then check all correct answers."}
          {editedQuestion.type === "TRUE_FALSE" &&
            "Enter your question text, then select if True or False is the correct answer."}
          {editedQuestion.type === "FILL_IN_BLANK" &&
            "Enter your question text, then define all possible correct answers for the blank."}
        </p>

        {/* Question text */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Question:</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
            placeholder="Enter your question here..."
          />
        </Form.Group>

        {/* Multiple Choice Options */}
        {editedQuestion.type === "MULTIPLE_CHOICE" && (
          <div>
            <Form.Label><strong>Answers:</strong></Form.Label>
            {editedQuestion.choices.map((choice, index) => (
              <Row key={choice._id} className="mb-2 align-items-center">
                <Col sm="auto">
                  <Form.Check
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={() => toggleCorrectChoice(choice._id)}
                    label={choice.isCorrect ? "Correct Answer" : "Possible Answer"}
                    className={choice.isCorrect ? "text-success" : ""}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={choice.text}
                    onChange={(e) => updateChoiceText(choice._id, e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                  />
                </Col>
                <Col sm="auto">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeChoice(choice._id)}
                    disabled={editedQuestion.choices.length <= 2}
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="link" className="text-danger p-0" onClick={addChoice}>
              <FaPlus /> Add Another Answer
            </Button>
          </div>
        )}

        {/* True/False Options */}
        {editedQuestion.type === "TRUE_FALSE" && (
          <div>
            <Form.Label><strong>Answers:</strong></Form.Label>
            <Form.Check
              type="radio"
              name={`tf-${editedQuestion._id}`}
              label="True"
              checked={editedQuestion.correctAnswer === true}
              onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: true })}
              className={editedQuestion.correctAnswer === true ? "text-success" : ""}
            />
            <Form.Check
              type="radio"
              name={`tf-${editedQuestion._id}`}
              label="False"
              checked={editedQuestion.correctAnswer === false}
              onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: false })}
              className={editedQuestion.correctAnswer === false ? "text-success" : ""}
            />
          </div>
        )}

        {/* Fill in the Blank Options */}
        {editedQuestion.type === "FILL_IN_BLANK" && (
          <div>
            <Form.Label><strong>Possible Answers:</strong></Form.Label>
            <p className="text-muted small">Add all acceptable answers. Answers are case-insensitive.</p>
            {editedQuestion.blankAnswers.map((answer, index) => (
              <Row key={answer._id} className="mb-2 align-items-center">
                <Col sm="auto">
                  <span>Possible Answer:</span>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={answer.text}
                    onChange={(e) => updateBlankAnswer(answer._id, e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                  />
                </Col>
                <Col sm="auto">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeBlankAnswer(answer._id)}
                    disabled={editedQuestion.blankAnswers.length <= 1}
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="link" className="text-danger p-0" onClick={addBlankAnswer}>
              <FaPlus /> Add Another Answer
            </Button>
          </div>
        )}

        {/* Action buttons */}
        <hr />
        <div className="d-flex justify-content-between">
          <Button variant="outline-danger" onClick={onDelete}>
            Delete Question
          </Button>
          <div>
            <Button variant="secondary" className="me-2" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => onSave(editedQuestion)}>
              Update Question
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// Question Preview Component
function QuestionPreview({
  question,
  index,
  onEdit,
}: {
  question: Question;
  index: number;
  onEdit: () => void;
}) {
  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>
          <strong>Question {index + 1}:</strong> {question.title}
        </span>
        <div>
          <span className="me-3">{question.points} pts</span>
          <Button variant="outline-secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <p>{question.question}</p>
        <small className="text-muted">
          Type: {question.type.replace("_", " ")}
        </small>
      </Card.Body>
    </Card>
  );
}

// Question Group Preview Component
function QuestionGroupPreview({
  group,
  onEdit,
}: {
  group: QuestionGroup;
  onEdit: () => void;
}) {
  const totalPoints = (group.pickCount || group.questions.length) * group.pointsPerQuestion;

  return (
    <Card className="mb-3 border-primary">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <span>
          <strong>{group.name}</strong>
          <span className="ms-2 text-muted">
            ({group.questions.length} question{group.questions.length !== 1 ? "s" : ""})
          </span>
        </span>
        <div>
          <span className="me-3">{totalPoints} pts</span>
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            Edit Group
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="py-2">
        <small className="text-muted">
          {group.pickCount
            ? `Pick ${group.pickCount} random question${group.pickCount !== 1 ? "s" : ""} at ${group.pointsPerQuestion} pts each`
            : `All ${group.questions.length} question${group.questions.length !== 1 ? "s" : ""} at ${group.pointsPerQuestion} pts each`
          }
        </small>
      </Card.Body>
    </Card>
  );
}

// Main Questions Editor Page
export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentQuiz, quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [showFindQuestions, setShowFindQuestions] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "TA";

  // Fetch quiz on load
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await client.findQuizById(qid as string);
        dispatch(setCurrentQuiz(quiz));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz");
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

  // Add new question
  const handleAddQuestion = async () => {
    if (!currentQuiz) return;

    const newQuestion: Omit<Question, "_id"> = {
      title: "New Question",
      type: "MULTIPLE_CHOICE",
      points: 1,
      question: "",
      choices: [
        { _id: uuidv4(), text: "", isCorrect: true },
        { _id: uuidv4(), text: "", isCorrect: false },
      ],
      correctAnswer: true,
      blankAnswers: [{ _id: uuidv4(), text: "" }],
    };

    try {
      const updatedQuiz = await client.addQuestion(currentQuiz._id, newQuestion);
      dispatch(setCurrentQuiz(updatedQuiz));

      // Set the new question to edit mode
      const newQ = updatedQuiz.questions[updatedQuiz.questions.length - 1];
      setEditingQuestionId(newQ._id);

      // Update quizzes list
      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question");
    }
  };

  // Add question from Find Questions modal
  const handleAddFoundQuestion = async (question: Omit<Question, "_id">) => {
    if (!currentQuiz) return;

    try {
      const updatedQuiz = await client.addQuestion(currentQuiz._id, question);
      dispatch(setCurrentQuiz(updatedQuiz));

      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question");
    }
  };

  // Add multiple questions from Find Questions modal
  const handleAddMultipleFoundQuestions = async (questions: Omit<Question, "_id">[]) => {
    if (!currentQuiz) return;

    try {
      let updatedQuiz = currentQuiz;
      for (const question of questions) {
        updatedQuiz = await client.addQuestion(updatedQuiz._id, question);
      }
      dispatch(setCurrentQuiz(updatedQuiz));

      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));
    } catch (err) {
      console.error("Error adding questions:", err);
      setError("Failed to add questions");
    }
  };

  // Save question
  const handleSaveQuestion = async (question: Question) => {
    if (!currentQuiz) return;
    setSaving(true);

    try {
      const updatedQuiz = await client.updateQuestion(currentQuiz._id, question._id, question);
      dispatch(setCurrentQuiz(updatedQuiz));

      // Update quizzes list
      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));

      setEditingQuestionId(null);
    } catch (err) {
      console.error("Error saving question:", err);
      setError("Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuiz) return;
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const updatedQuiz = await client.deleteQuestion(currentQuiz._id, questionId);
      dispatch(setCurrentQuiz(updatedQuiz));

      // Update quizzes list
      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));

      setEditingQuestionId(null);
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question");
    }
  };

  // ========== QUESTION GROUP HANDLERS ==========

  // Add new question group
  const handleAddQuestionGroup = async () => {
    if (!currentQuiz) return;

    const newGroup: Omit<QuestionGroup, "_id"> = {
      name: "New Question Group",
      pickCount: null,
      pointsPerQuestion: 1,
      questions: [],
    };

    try {
      const updatedQuiz = await client.addQuestionGroup(currentQuiz._id, newGroup);
      dispatch(setCurrentQuiz(updatedQuiz));

      // Set the new group to edit mode
      const newG = updatedQuiz.questionGroups[updatedQuiz.questionGroups.length - 1];
      setEditingGroupId(newG._id);

      // Update quizzes list
      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));
    } catch (err) {
      console.error("Error adding question group:", err);
      setError("Failed to add question group");
    }
  };

  // Save question group
  const handleSaveQuestionGroup = async (group: QuestionGroup) => {
    if (!currentQuiz) return;
    setSaving(true);

    try {
      const updatedQuiz = await client.updateQuestionGroup(currentQuiz._id, group._id, group);
      dispatch(setCurrentQuiz(updatedQuiz));

      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));

      setEditingGroupId(null);
    } catch (err) {
      console.error("Error saving question group:", err);
      setError("Failed to save question group");
    } finally {
      setSaving(false);
    }
  };

  // Delete question group
  const handleDeleteQuestionGroup = async (groupId: string) => {
    if (!currentQuiz) return;
    if (!window.confirm("Are you sure you want to delete this question group and all its questions?")) return;

    try {
      const updatedQuiz = await client.deleteQuestionGroup(currentQuiz._id, groupId);
      dispatch(setCurrentQuiz(updatedQuiz));

      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));

      setEditingGroupId(null);
    } catch (err) {
      console.error("Error deleting question group:", err);
      setError("Failed to delete question group");
    }
  };

  // Handle save all and navigate
  const handleSave = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  // Handle cancel
  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <Container><p>Loading questions editor...</p></Container>;
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

  const hasQuestions = currentQuiz.questions.length > 0;
  const hasGroups = (currentQuiz.questionGroups || []).length > 0;

  return (
    <Container>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* Points display */}
      <div className="text-end mb-3">
        <strong>Points:</strong> {currentQuiz.points}
        {!currentQuiz.published && (
          <span className="ms-3 text-muted">⊘ Not Published</span>
        )}
      </div>

      {/* Tabs */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}>
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active>Questions</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Empty State */}
      {!hasQuestions && !hasGroups && (
        <Alert variant="info">
          No questions yet. Click &quot;+ New Question&quot; to add one, or &quot;+ New Question Group&quot; to create a group.
        </Alert>
      )}

      {/* Regular Questions List */}
      {hasQuestions && (
        <>
          <h6 className="text-muted mb-3">Individual Questions</h6>
          {currentQuiz.questions.map((question, index) =>
            editingQuestionId === question._id ? (
              <QuestionEditor
                key={question._id}
                question={question}
                onSave={handleSaveQuestion}
                onCancel={() => setEditingQuestionId(null)}
                onDelete={() => handleDeleteQuestion(question._id)}
              />
            ) : (
              <QuestionPreview
                key={question._id}
                question={question}
                index={index}
                onEdit={() => setEditingQuestionId(question._id)}
              />
            )
          )}
        </>
      )}

      {/* Question Groups */}
      {hasGroups && (
        <>
          <h6 className="text-muted mb-3 mt-4">Question Groups</h6>
          {(currentQuiz.questionGroups || []).map((group) =>
            editingGroupId === group._id ? (
              <QuestionGroupEditor
                key={group._id}
                group={group}
                onSave={handleSaveQuestionGroup}
                onCancel={() => setEditingGroupId(null)}
                onDelete={() => handleDeleteQuestionGroup(group._id)}
              />
            ) : (
              <QuestionGroupPreview
                key={group._id}
                group={group}
                onEdit={() => setEditingGroupId(group._id)}
              />
            )
          )}
        </>
      )}

      {/* Add Question Buttons */}
      <div className="text-center mb-4 d-flex justify-content-center gap-2 flex-wrap">
        <Button variant="outline-secondary" onClick={handleAddQuestion}>
          <FaPlus className="me-1" /> New Question
        </Button>
        <Button variant="outline-secondary" onClick={handleAddQuestionGroup}>
          <FaPlus className="me-1" /> New Question Group
        </Button>
        <Button variant="outline-secondary" onClick={() => setShowFindQuestions(true)}>
          <FaSearch className="me-1" /> Find Questions
        </Button>
      </div>

      <hr />

      {/* Action Buttons */}
      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave} disabled={saving}>
          Save
        </Button>
      </div>

      {/* Find Questions Modal */}
      <FindQuestionsModal
        show={showFindQuestions}
        onHide={() => setShowFindQuestions(false)}
        courseId={cid as string}
        currentQuizId={qid as string}
        onAddQuestion={handleAddFoundQuestion}
        onAddMultipleQuestions={handleAddMultipleFoundQuestions}
      />
    </Container>
  );
}