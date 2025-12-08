"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setCurrentQuiz, updateQuiz as updateQuizAction, setQuizzes } from "../../reducer";
import * as client from "../../../../client";
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Nav,
  Alert,
} from "react-bootstrap";

export default function QuizEditorDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentQuiz, quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local form state with proper types
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
    assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
    shuffleAnswers: boolean;
    hasTimeLimit: boolean;
    timeLimit: number;
    multipleAttempts: boolean;
    howManyAttempts: number;
    showCorrectAnswers: "Immediately" | "After Due Date" | "Never";
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    dueDate: string;
    availableDate: string;
    untilDate: string;
  }>({
    title: "",
    description: "",
    quizType: "Graded Quiz",
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    hasTimeLimit: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "After Due Date",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableDate: "",
    untilDate: "",
  });

  const isFaculty = currentUser?.role === "FACULTY";

  // Fetch quiz on load
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await client.findQuizById(qid as string);
        dispatch(setCurrentQuiz(quiz));
        setFormData({
          title: quiz.title || "",
          description: quiz.description || "",
          quizType: quiz.quizType || "Graded Quiz",
          assignmentGroup: quiz.assignmentGroup || "Quizzes",
          shuffleAnswers: quiz.shuffleAnswers ?? true,
          hasTimeLimit: quiz.hasTimeLimit ?? true,
          timeLimit: quiz.timeLimit || 20,
          multipleAttempts: quiz.multipleAttempts ?? false,
          howManyAttempts: quiz.howManyAttempts || 1,
          showCorrectAnswers: quiz.showCorrectAnswers || "After Due Date",
          accessCode: quiz.accessCode || "",
          oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
          webcamRequired: quiz.webcamRequired ?? false,
          lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
          dueDate: quiz.dueDate || "",
          availableDate: quiz.availableDate || "",
          untilDate: quiz.untilDate || "",
        });
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

  // Handle save
  const handleSave = async (publish: boolean = false) => {
    if (!currentQuiz) return;
    setSaving(true);
    setError(null);

    try {
      const updatedQuiz = {
        ...currentQuiz,
        ...formData,
        published: publish ? true : currentQuiz.published,
      };

      await client.updateQuiz(currentQuiz._id, updatedQuiz);
      dispatch(updateQuizAction(updatedQuiz));

      // Update quizzes list
      const updatedQuizzes = quizzes.map((q) =>
        q._id === currentQuiz._id ? updatedQuiz : q
      );
      dispatch(setQuizzes(updatedQuizzes));

      if (publish) {
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (err) {
      console.error("Error saving quiz:", err);
      setError("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <Container><p>Loading quiz editor...</p></Container>;
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

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}

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
          <Nav.Link active>Details</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit/Questions`)}
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Form */}
      <Form>
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Quiz Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter quiz instructions..."
          />
        </Form.Group>

        {/* Quiz Type */}
        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Quiz Type</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Select
              value={formData.quizType}
              onChange={(e) => setFormData({ 
                ...formData, 
                quizType: e.target.value as "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey"
              })}
            >
              <option>Graded Quiz</option>
              <option>Practice Quiz</option>
              <option>Graded Survey</option>
              <option>Ungraded Survey</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Assignment Group */}
        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Assignment Group</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Select
              value={formData.assignmentGroup}
              onChange={(e) => setFormData({ 
                ...formData, 
                assignmentGroup: e.target.value as "Quizzes" | "Exams" | "Assignments" | "Project"
              })}
            >
              <option>Quizzes</option>
              <option>Exams</option>
              <option>Assignments</option>
              <option>Project</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Options section */}
        <h5 className="mt-4 mb-3">Options</h5>

        {/* Shuffle Answers */}
        <Form.Check
          type="checkbox"
          label="Shuffle Answers"
          checked={formData.shuffleAnswers}
          onChange={(e) => setFormData({ ...formData, shuffleAnswers: e.target.checked })}
          className="mb-2"
        />

        {/* Time Limit */}
        <Row className="mb-3 align-items-center">
          <Col sm="auto">
            <Form.Check
              type="checkbox"
              label="Time Limit"
              checked={formData.hasTimeLimit}
              onChange={(e) => setFormData({ ...formData, hasTimeLimit: e.target.checked })}
            />
          </Col>
          {formData.hasTimeLimit && (
            <Col sm={2}>
              <Form.Control
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                min={1}
              />
            </Col>
          )}
          {formData.hasTimeLimit && <Col sm="auto">Minutes</Col>}
        </Row>

        {/* Multiple Attempts */}
        <Form.Check
          type="checkbox"
          label="Allow Multiple Attempts"
          checked={formData.multipleAttempts}
          onChange={(e) => setFormData({ ...formData, multipleAttempts: e.target.checked })}
          className="mb-2"
        />
        {formData.multipleAttempts && (
          <Row className="mb-3 ms-4">
            <Col sm={3}>
              <Form.Label>How Many Attempts</Form.Label>
            </Col>
            <Col sm={2}>
              <Form.Control
                type="number"
                value={formData.howManyAttempts}
                onChange={(e) => setFormData({ ...formData, howManyAttempts: parseInt(e.target.value) || 1 })}
                min={1}
              />
            </Col>
          </Row>
        )}

        {/* Show Correct Answers */}
        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Show Correct Answers</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Select
              value={formData.showCorrectAnswers}
              onChange={(e) => setFormData({ 
                ...formData, 
                showCorrectAnswers: e.target.value as "Immediately" | "After Due Date" | "Never"
              })}
            >
              <option>Immediately</option>
              <option>After Due Date</option>
              <option>Never</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Access Code */}
        <Row className="mb-3">
          <Col sm={3}>
            <Form.Label>Access Code</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Control
              type="text"
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
              placeholder="Leave blank for no access code"
            />
          </Col>
        </Row>

        {/* One Question at a Time */}
        <Form.Check
          type="checkbox"
          label="One Question at a Time"
          checked={formData.oneQuestionAtATime}
          onChange={(e) => setFormData({ ...formData, oneQuestionAtATime: e.target.checked })}
          className="mb-2"
        />

        {/* Webcam Required */}
        <Form.Check
          type="checkbox"
          label="Webcam Required"
          checked={formData.webcamRequired}
          onChange={(e) => setFormData({ ...formData, webcamRequired: e.target.checked })}
          className="mb-2"
        />

        {/* Lock Questions After Answering */}
        <Form.Check
          type="checkbox"
          label="Lock Questions After Answering"
          checked={formData.lockQuestionsAfterAnswering}
          onChange={(e) => setFormData({ ...formData, lockQuestionsAfterAnswering: e.target.checked })}
          className="mb-4"
        />

        {/* Dates section */}
        <h5 className="mt-4 mb-3">Assign</h5>

        <Row className="mb-3">
          <Col sm={4}>
            <Form.Label><strong>Due</strong></Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </Col>
          <Col sm={4}>
            <Form.Label><strong>Available from</strong></Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.availableDate}
              onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
            />
          </Col>
          <Col sm={4}>
            <Form.Label><strong>Until</strong></Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.untilDate}
              onChange={(e) => setFormData({ ...formData, untilDate: e.target.value })}
            />
          </Col>
        </Row>

        <hr />

        {/* Action Buttons */}
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & Publish"}
          </Button>
          <Button variant="danger" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}