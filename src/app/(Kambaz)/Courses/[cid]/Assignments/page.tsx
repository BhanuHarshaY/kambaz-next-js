
"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import {
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  ListGroupItem,
  Badge,
  Container,
} from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { RxFileText } from "react-icons/rx";

type CurrentUser = {
  _id: string;
  role: string;
} | null;

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  const handleAddAssignment = () => {
    router.push(`/Courses/${cid}/Assignments/new`);
  };

  // Check if user can edit (Faculty or TA)
  const canEdit = (currentUser as CurrentUser)?.role === "FACULTY" || 
                  (currentUser as CurrentUser)?.role === "TA";

  return (
    <Container id="wd-assignments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="float-start" style={{ width: "300px" }}>
          <InputGroup className="border rounded">
            <span className="input-group-text bg-white border-0">
              <IoSearch />
            </span>
            <FormControl
              placeholder="Search..."
              id="wd-search-assignment"
              className="border-0"
            />
          </InputGroup>
        </div>
        {canEdit && (
          <div>
            <Button
              variant="secondary"
              className="me-2"
              id="wd-add-assignment-group"
            >
              <BsPlus className="fs-4" /> Group
            </Button>
            <Button 
              variant="danger" 
              id="wd-add-assignment"
              onClick={handleAddAssignment}
            >
              <BsPlus className="fs-4" /> Assignment
            </Button>
          </div>
        )}
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <IoMdArrowDropdown className="me-2 fs-4" />
              <strong>ASSIGNMENTS</strong>
            </div>
            <div className="d-flex align-items-center">
              <Badge
                bg="light"
                text="dark"
                className="me-2 rounded-pill px-3 py-2"
              >
                40% of Total
              </Badge>
              <BsPlus className="fs-4" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>

          <ListGroup className="rounded-0">
            {assignments
              .filter((assignment) => assignment.course === cid)
              .map((assignment) => (
                <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-start">
                      <BsGripVertical className="me-2 fs-3" />
                      <RxFileText className="me-3 fs-4 text-success" />
                      <div>
                        <Link
                          href={`/Courses/${cid}/Assignments/${assignment._id}`}
                          className="wd-assignment-link text-dark fw-bold text-decoration-none"
                        >
                          {assignment.title}
                        </Link>
                        <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                          <span className="text-danger">Multiple Modules</span> |{" "}
                          <strong>Not available until</strong> {new Date(assignment.availableDate).toLocaleDateString()} |{" "}
                          <strong>Due</strong> {new Date(assignment.dueDate).toLocaleDateString()} | {assignment.points} pts
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaCheckCircle className="text-success me-2" />
                      {canEdit && (
                        <FaTrash 
                          className="text-danger me-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteAssignment(assignment._id)}
                        />
                      )}
                      <IoEllipsisVertical className="fs-4" />
                    </div>
                  </div>
                </ListGroupItem>
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </Container>
  );
}
