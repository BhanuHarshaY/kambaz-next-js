"use client";
import { useState, useEffect, useCallback } from "react";
import { Question, SearchedQuestion } from "../../../reducer";
import {
    Modal,
    Button,
    Form,
    ListGroup,
    Badge,
    Spinner,
    Alert,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaCheck } from "react-icons/fa";
import * as client from "../../../../../client";

interface FindQuestionsModalProps {
    show: boolean;
    onHide: () => void;
    courseId: string;
    currentQuizId: string;
    onAddQuestion: (question: Omit<Question, "_id">) => void;
    onAddMultipleQuestions: (questions: Omit<Question, "_id">[]) => void;
}

export default function FindQuestionsModal({
    show,
    onHide,
    courseId,
    currentQuizId,
    onAddQuestion,
    onAddMultipleQuestions,
}: FindQuestionsModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [questions, setQuestions] = useState<SearchedQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Debounced search
    const searchQuestions = useCallback(async (term: string) => {
        setLoading(true);
        setError(null);
        try {
            const results = await client.searchQuestionsInCourse(courseId, term);
            // Filter out questions from the current quiz
            const filtered = results.filter(
                (q: SearchedQuestion) => q.sourceQuizId !== currentQuizId
            );
            setQuestions(filtered);
        } catch (err) {
            console.error("Error searching questions:", err);
            setError("Failed to search questions");
        } finally {
            setLoading(false);
        }
    }, [courseId, currentQuizId]);

    // Search when modal opens or search term changes
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                searchQuestions(searchTerm);
            }, 300); // Debounce

            return () => clearTimeout(timer);
        }
    }, [show, searchTerm, searchQuestions]);

    // Reset state when modal closes
    useEffect(() => {
        if (!show) {
            setSearchTerm("");
            setQuestions([]);
            setSelectedIds(new Set());
            setError(null);
        }
    }, [show]);

    // Toggle selection
    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Add single question
    const handleAddSingle = (question: SearchedQuestion) => {
        // Create a copy without the source info and _id (will be generated on server)
        const questionCopy: Omit<Question, "_id"> = {
            title: question.title,
            type: question.type,
            points: question.points,
            question: question.question,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            blankAnswers: question.blankAnswers,
        };
        onAddQuestion(questionCopy);
        onHide();
    };

    // Add selected questions
    const handleAddSelected = () => {
        const selectedQuestions = questions
            .filter((q) => selectedIds.has(q._id))
            .map((question) => ({
                title: question.title,
                type: question.type,
                points: question.points,
                question: question.question,
                choices: question.choices,
                correctAnswer: question.correctAnswer,
                blankAnswers: question.blankAnswers,
            }));

        onAddMultipleQuestions(selectedQuestions);
        onHide();
    };

    // Get question type badge color
    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "MULTIPLE_CHOICE":
                return "primary";
            case "TRUE_FALSE":
                return "success";
            case "FILL_IN_BLANK":
                return "warning";
            default:
                return "secondary";
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Find Questions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Search Input */}
                <div className="mb-3 position-relative">
                    <Form.Control
                        type="text"
                        placeholder="Search questions by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-5"
                    />
                    <FaSearch
                        className="position-absolute text-muted"
                        style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
                    />
                </div>

                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Results */}
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Searching...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <p>No questions found in other quizzes.</p>
                        <p className="small">Try a different search term or create new questions.</p>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">
                                Found {questions.length} question{questions.length !== 1 ? "s" : ""}
                            </small>
                            {selectedIds.size > 0 && (
                                <Button variant="primary" size="sm" onClick={handleAddSelected}>
                                    <FaPlus className="me-1" />
                                    Add {selectedIds.size} Selected
                                </Button>
                            )}
                        </div>

                        <ListGroup style={{ maxHeight: "400px", overflowY: "auto" }}>
                            {questions.map((question) => (
                                <ListGroup.Item
                                    key={question._id}
                                    className="d-flex align-items-start gap-3"
                                    action
                                    onClick={() => toggleSelection(question._id)}
                                    active={selectedIds.has(question._id)}
                                >
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedIds.has(question._id)}
                                        onChange={() => toggleSelection(question._id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{question.title}</strong>
                                                <Badge
                                                    bg={getTypeBadgeColor(question.type)}
                                                    className="ms-2"
                                                >
                                                    {question.type.replace("_", " ")}
                                                </Badge>
                                                <Badge bg="secondary" className="ms-1">
                                                    {question.points} pts
                                                </Badge>
                                            </div>
                                            <Button
                                                variant={selectedIds.has(question._id) ? "light" : "outline-primary"}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddSingle(question);
                                                }}
                                            >
                                                {selectedIds.has(question._id) ? (
                                                    <FaCheck />
                                                ) : (
                                                    <>
                                                        <FaPlus className="me-1" /> Add
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <p className="mb-1 text-truncate" style={{ maxWidth: "500px" }}>
                                            {question.question || <em className="text-muted">No question text</em>}
                                        </p>
                                        <small className="text-muted">
                                            From: {question.sourceQuizTitle}
                                            {question.sourceGroupName && ` > ${question.sourceGroupName}`}
                                        </small>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                {selectedIds.size > 0 && (
                    <Button variant="primary" onClick={handleAddSelected}>
                        <FaPlus className="me-1" />
                        Add {selectedIds.size} Question{selectedIds.size !== 1 ? "s" : ""}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}
