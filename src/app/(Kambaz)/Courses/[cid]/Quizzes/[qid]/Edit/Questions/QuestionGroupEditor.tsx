"use client";
import { useState } from "react";
import { Question, QuestionGroup, Choice, BlankAnswer } from "../../../reducer";
import {
    Card,
    Button,
    Form,
    Row,
    Col,
    Collapse,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

// Question Editor within Group - matches main QuestionEditor style
function GroupQuestionEditor({
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

    const addChoice = () => {
        const newChoice: Choice = { _id: uuidv4(), text: "", isCorrect: false };
        setEditedQuestion({
            ...editedQuestion,
            choices: [...editedQuestion.choices, newChoice],
        });
    };

    const removeChoice = (choiceId: string) => {
        setEditedQuestion({
            ...editedQuestion,
            choices: editedQuestion.choices.filter((c) => c._id !== choiceId),
        });
    };

    const updateChoiceText = (choiceId: string, text: string) => {
        setEditedQuestion({
            ...editedQuestion,
            choices: editedQuestion.choices.map((c) =>
                c._id === choiceId ? { ...c, text } : c
            ),
        });
    };

    const toggleCorrectChoice = (choiceId: string) => {
        setEditedQuestion({
            ...editedQuestion,
            choices: editedQuestion.choices.map((c) => ({
                ...c,
                isCorrect: c._id === choiceId ? !c.isCorrect : c.isCorrect,
            })),
        });
    };

    const addBlankAnswer = () => {
        const newAnswer: BlankAnswer = { _id: uuidv4(), text: "" };
        setEditedQuestion({
            ...editedQuestion,
            blankAnswers: [...editedQuestion.blankAnswers, newAnswer],
        });
    };

    const removeBlankAnswer = (answerId: string) => {
        setEditedQuestion({
            ...editedQuestion,
            blankAnswers: editedQuestion.blankAnswers.filter((a) => a._id !== answerId),
        });
    };

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
                            name={`tf-group-${editedQuestion._id}`}
                            label="True"
                            checked={editedQuestion.correctAnswer === true}
                            onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: true })}
                            className={editedQuestion.correctAnswer === true ? "text-success" : ""}
                        />
                        <Form.Check
                            type="radio"
                            name={`tf-group-${editedQuestion._id}`}
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

// Question Preview within Group
function GroupQuestionPreview({
    question,
    index,
    onEdit,
}: {
    question: Question;
    index: number;
    onEdit: () => void;
}) {
    return (
        <Card className="mb-2 border-start border-3 border-secondary">
            <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                <div>
                    <strong>Q{index + 1}:</strong> {question.title}
                    <small className="text-muted ms-2">({question.type.replace("_", " ")})</small>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={onEdit}>
                    Edit
                </Button>
            </Card.Body>
        </Card>
    );
}

// Main Question Group Editor Component
interface QuestionGroupEditorProps {
    group: QuestionGroup;
    onSave: (group: QuestionGroup) => void;
    onDelete: () => void;
    onCancel: () => void;
}

export default function QuestionGroupEditor({
    group,
    onSave,
    onDelete,
    onCancel,
}: QuestionGroupEditorProps) {
    const [editedGroup, setEditedGroup] = useState<QuestionGroup>({ ...group });
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    // Add a new question to the group
    const handleAddQuestion = () => {
        const newQuestion: Question = {
            _id: uuidv4(),
            title: "New Question",
            type: "MULTIPLE_CHOICE",
            points: editedGroup.pointsPerQuestion,
            question: "",
            choices: [
                { _id: uuidv4(), text: "", isCorrect: true },
                { _id: uuidv4(), text: "", isCorrect: false },
            ],
            correctAnswer: true,
            blankAnswers: [{ _id: uuidv4(), text: "" }],
        };

        setEditedGroup({
            ...editedGroup,
            questions: [...editedGroup.questions, newQuestion],
        });
        setEditingQuestionId(newQuestion._id);
    };

    // Save a question
    const handleSaveQuestion = (question: Question) => {
        setEditedGroup({
            ...editedGroup,
            questions: editedGroup.questions.map((q) =>
                q._id === question._id ? question : q
            ),
        });
        setEditingQuestionId(null);
    };

    // Delete a question
    const handleDeleteQuestion = (questionId: string) => {
        setEditedGroup({
            ...editedGroup,
            questions: editedGroup.questions.filter((q) => q._id !== questionId),
        });
        setEditingQuestionId(null);
    };

    // Calculate total points for this group
    const totalPoints = (editedGroup.pickCount || editedGroup.questions.length) * editedGroup.pointsPerQuestion;

    return (
        <Card className="mb-3 border-primary">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="link"
                        className="p-0 text-dark"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                    </Button>
                    <Form.Control
                        type="text"
                        value={editedGroup.name}
                        onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                        style={{ width: "200px" }}
                        placeholder="Group Name"
                    />
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-muted">
                        {editedGroup.questions.length} Question{editedGroup.questions.length !== 1 ? "s" : ""} | {totalPoints} pts
                    </span>
                </div>
            </Card.Header>

            <Collapse in={isExpanded}>
                <div>
                    <Card.Body>
                        {/* Group Settings */}
                        <Row className="mb-3 align-items-center">
                            <Col sm="auto">
                                <Form.Label className="mb-0">Pick</Form.Label>
                            </Col>
                            <Col sm={2}>
                                <Form.Control
                                    type="number"
                                    value={editedGroup.pickCount || editedGroup.questions.length}
                                    onChange={(e) => setEditedGroup({
                                        ...editedGroup,
                                        pickCount: parseInt(e.target.value) || null,
                                    })}
                                    min={1}
                                    max={editedGroup.questions.length || 1}
                                />
                            </Col>
                            <Col sm="auto">
                                <span>questions at</span>
                            </Col>
                            <Col sm={2}>
                                <Form.Control
                                    type="number"
                                    value={editedGroup.pointsPerQuestion}
                                    onChange={(e) => setEditedGroup({
                                        ...editedGroup,
                                        pointsPerQuestion: parseInt(e.target.value) || 0,
                                    })}
                                    min={0}
                                />
                            </Col>
                            <Col sm="auto">
                                <span>pts each</span>
                            </Col>
                        </Row>

                        <p className="text-muted small mb-3">
                            This group will randomly select {editedGroup.pickCount || editedGroup.questions.length} question(s)
                            from the pool of {editedGroup.questions.length} question(s) below.
                        </p>

                        {/* Questions in Group */}
                        {editedGroup.questions.length === 0 ? (
                            <p className="text-muted">No questions in this group yet. Add one below.</p>
                        ) : (
                            editedGroup.questions.map((question, index) =>
                                editingQuestionId === question._id ? (
                                    <GroupQuestionEditor
                                        key={question._id}
                                        question={question}
                                        onSave={handleSaveQuestion}
                                        onCancel={() => setEditingQuestionId(null)}
                                        onDelete={() => handleDeleteQuestion(question._id)}
                                    />
                                ) : (
                                    <GroupQuestionPreview
                                        key={question._id}
                                        question={question}
                                        index={index}
                                        onEdit={() => setEditingQuestionId(question._id)}
                                    />
                                )
                            )
                        )}

                        {/* Add Question to Group Button */}
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleAddQuestion}
                            className="mb-3"
                        >
                            <FaPlus /> Add Question to Group
                        </Button>

                        <hr />

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-between">
                            <Button variant="outline-danger" onClick={onDelete}>
                                Delete Group
                            </Button>
                            <div>
                                <Button variant="secondary" className="me-2" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={() => onSave(editedGroup)}>
                                    Save Group
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );
}
