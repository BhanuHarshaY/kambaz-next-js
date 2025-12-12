"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setCurrentQuiz, updateQuiz } from "../reducer";
import * as client from "../../../client";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { FaCheckCircle, FaBan } from "react-icons/fa";

interface AttemptStatus {
  attemptCount: number;
  maxAttempts: number;
  canRetake: boolean;
  latestAttempt: {
    _id: string;
    score: number;
    totalPoints: number;
    percentage: number;
    submittedAt: string;
  } | null;
}

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus | null>(null);

  const isFaculty = currentUser?.role === "FACULTY"|| currentUser?.role === "TA";
  const isStudent = currentUser?.role === "STUDENT";

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await client.findQuizById(qid as string);
        dispatch(setCurrentQuiz(quiz));
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

  // Fetch attempt status for students
  useEffect(() => {
    const fetchAttemptStatus = async () => {
      if (isStudent && qid) {
        try {
          const status = await client.getAttemptStatus(qid as string);
          setAttemptStatus(status);
        } catch (error) {
          console.error("Error fetching attempt status:", error);
        }
      }
    };
    fetchAttemptStatus();
  }, [qid, isStudent]);

  // Handle publish toggle
  const handlePublishToggle = async () => {
    if (!currentQuiz) return;
    try {
      await client.publishQuiz(currentQuiz._id, !currentQuiz.published);
      dispatch(updateQuiz({ ...currentQuiz, published: !currentQuiz.published }));
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  if (loading) {
    return <Container><p>Loading quiz...</p></Container>;
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
      {/* Action buttons */}
      <div className="d-flex justify-content-center mb-4">
        {isFaculty && (
          <>
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
            >
              Preview
            </Button>
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
            >
               Edit
            </Button>
          </>
        )}
        {isStudent && currentQuiz.published && (
          <>
            {attemptStatus?.canRetake ? (
              <Button
                variant="danger"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
              >
                {attemptStatus.attemptCount > 0 ? "Retake Quiz" : "Start Quiz"}
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                No Attempts Remaining
              </Button>
            )}
          </>
        )}
      </div>

      <hr />

      {/* Quiz title */}
      <h2 className="mb-4">
        {currentQuiz.title}
        {isFaculty && (
          <span
            className="ms-3"
            style={{ cursor: "pointer" }}
            onClick={handlePublishToggle}
            title={currentQuiz.published ? "Click to unpublish" : "Click to publish"}
          >
            {currentQuiz.published ? (
              <FaCheckCircle className="text-success" />
            ) : (
              <FaBan className="text-secondary" />
            )}
          </span>
        )}
      </h2>

      {/* Student's last attempt score */}
      {isStudent && attemptStatus?.latestAttempt && (
        <Alert variant="info">
          <strong>Last Attempt Score:</strong> {attemptStatus.latestAttempt.score} / {attemptStatus.latestAttempt.totalPoints} ({attemptStatus.latestAttempt.percentage}%)
          <br />
          <small>Submitted: {new Date(attemptStatus.latestAttempt.submittedAt).toLocaleString()}</small>
          <br />
          <small>Attempts: {attemptStatus.attemptCount} / {attemptStatus.maxAttempts}</small>
        </Alert>
      )}

      {/* Quiz details table */}
      <div className="quiz-details">
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Quiz Type</Col>
          <Col sm={8}>{currentQuiz.quizType}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Points</Col>
          <Col sm={8}>{currentQuiz.points}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Assignment Group</Col>
          <Col sm={8}>{currentQuiz.assignmentGroup}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Shuffle Answers</Col>
          <Col sm={8}>{currentQuiz.shuffleAnswers ? "Yes" : "No"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Time Limit</Col>
          <Col sm={8}>{currentQuiz.hasTimeLimit ? `${currentQuiz.timeLimit} Minutes` : "No Limit"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Multiple Attempts</Col>
          <Col sm={8}>{currentQuiz.multipleAttempts ? `Yes (${currentQuiz.howManyAttempts} attempts)` : "No"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Show Correct Answers</Col>
          <Col sm={8}>{currentQuiz.showCorrectAnswers}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Access Code</Col>
          <Col sm={8}>{currentQuiz.accessCode || "None"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">One Question at a Time</Col>
          <Col sm={8}>{currentQuiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Webcam Required</Col>
          <Col sm={8}>{currentQuiz.webcamRequired ? "Yes" : "No"}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="text-end fw-bold">Lock Questions After Answering</Col>
          <Col sm={8}>{currentQuiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
        </Row>

        <hr />

        {/* Dates table */}
        <Row className="fw-bold mb-2">
          <Col sm={3}>Due</Col>
          <Col sm={3}>For</Col>
          <Col sm={3}>Available from</Col>
          <Col sm={3}>Until</Col>
        </Row>
        <Row>
          <Col sm={3}>{currentQuiz.dueDate ? new Date(currentQuiz.dueDate).toLocaleString() : "N/A"}</Col>
          <Col sm={3}>Everyone</Col>
          <Col sm={3}>{currentQuiz.availableDate ? new Date(currentQuiz.availableDate).toLocaleString() : "N/A"}</Col>
          <Col sm={3}>{currentQuiz.untilDate ? new Date(currentQuiz.untilDate).toLocaleString() : "N/A"}</Col>
        </Row>
      </div>

      <hr />

      {/* Back button */}
      <Button
        variant="secondary"
        onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
      >
        Back to Quizzes
      </Button>
    </Container>
  );
}