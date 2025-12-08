"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setQuizzes, deleteQuiz as deleteQuizAction, togglePublish } from "./reducer";
import * as client from "../../client";
import {
  Container,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCheckCircle, FaBan, FaRocket } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [searchTerm, setSearchTerm] = useState("");

  const isFaculty = currentUser?.role === "FACULTY";

  // Fetch quizzes on load
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(data));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    if (cid) {
      fetchQuizzes();
    }
  }, [cid, dispatch]);

  // Get availability status
  const getAvailabilityStatus = (quiz: typeof quizzes[0]) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
      return { status: "Not available until", date: availableDate.toLocaleDateString() };
    }
    if (untilDate && now > untilDate) {
      return { status: "Closed", date: null };
    }
    return { status: "Available", date: null };
  };

  // Handle add quiz
  const handleAddQuiz = async () => {
    try {
      const newQuiz = await client.createQuiz(cid as string, {
        title: "Unnamed Quiz",
        course: cid,
      });
      dispatch(setQuizzes([...quizzes, newQuiz]));
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/Edit`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  // Handle delete quiz
  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await client.deleteQuiz(quizId);
        dispatch(deleteQuizAction(quizId));
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  // Handle publish toggle
  const handlePublishToggle = async (quizId: string, currentlyPublished: boolean) => {
    try {
      await client.publishQuiz(quizId, !currentlyPublished);
      dispatch(togglePublish(quizId));
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  // Filter quizzes by search term
  const filteredQuizzes = quizzes
    .filter((q) => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = a.availableDate ? new Date(a.availableDate).getTime() : 0;
      const dateB = b.availableDate ? new Date(b.availableDate).getTime() : 0;
      return dateA - dateB;
    });

  return (
    <Container id="wd-quizzes">
      {/* Header with search and add button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div style={{ width: "300px" }}>
          <InputGroup className="border rounded">
            <span className="input-group-text bg-white border-0">
              <IoSearch />
            </span>
            <FormControl
              placeholder="Search for Quiz"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0"
            />
          </InputGroup>
        </div>
        {isFaculty && (
          <Button variant="danger" onClick={handleAddQuiz}>
            <BsPlus className="fs-4" /> Quiz
          </Button>
        )}
      </div>

      {/* Quiz List */}
      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <IoMdArrowDropdown className="me-2 fs-4" />
              <strong>Assignment Quizzes</strong>
            </div>
          </div>

          {filteredQuizzes.length === 0 ? (
            <ListGroupItem className="p-4 text-center text-muted">
              <p>No quizzes yet.</p>
              {isFaculty && (
                <p>Click the <strong>+ Quiz</strong> button to create one.</p>
              )}
            </ListGroupItem>
          ) : (
            <ListGroup className="rounded-0">
              {filteredQuizzes.map((quiz) => {
                const availability = getAvailabilityStatus(quiz);
                return (
                  <ListGroupItem key={quiz._id} className="wd-lesson p-3 ps-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start">
                        <BsGripVertical className="me-2 fs-3" />
                        <FaRocket className="me-3 fs-4 text-success" />
                        <div>
                          <a
                            href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                            className="wd-quiz-link text-dark fw-bold text-decoration-none"
                            style={{ cursor: "pointer" }}
                          >
                            {quiz.title}
                          </a>
                          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                            <span className={availability.status === "Available" ? "text-success" : "text-danger"}>
                              {availability.status}
                              {availability.date && ` ${availability.date}`}
                            </span>
                            {" | "}
                            <strong>Due</strong> {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "N/A"}
                            {" | "}
                            {quiz.points} pts
                            {" | "}
                            {quiz.questions?.length || 0} Questions
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        {/* Publish indicator */}
                        {quiz.published ? (
                          <FaCheckCircle
                            className="text-success me-2 fs-5"
                            style={{ cursor: isFaculty ? "pointer" : "default" }}
                            onClick={() => isFaculty && handlePublishToggle(quiz._id, quiz.published)}
                            title="Published - Click to unpublish"
                          />
                        ) : (
                          <FaBan
                            className="text-secondary me-2 fs-5"
                            style={{ cursor: isFaculty ? "pointer" : "default" }}
                            onClick={() => isFaculty && handlePublishToggle(quiz._id, quiz.published)}
                            title="Unpublished - Click to publish"
                          />
                        )}

                        {/* Context menu for faculty */}
                        {isFaculty && (
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="p-0 text-dark">
                              <IoEllipsisVertical className="fs-4" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`)}
                              >
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteQuiz(quiz._id)}>
                                Delete
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handlePublishToggle(quiz._id, quiz.published)}
                              >
                                {quiz.published ? "Unpublish" : "Publish"}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    </div>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          )}
        </ListGroupItem>
      </ListGroup>
    </Container>
  );
}