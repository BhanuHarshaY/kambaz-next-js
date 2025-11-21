"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setAssignments } from "../reducer";
import * as client from "../../../client";
import {
  Button,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  FormCheck,
  Row,
  Container,
} from "react-bootstrap";

type CurrentUser = {
  _id: string;
  role: string;
} | null;

interface AssignmentForm {
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  untilDate: string;
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isNew = aid === "new";
  const existingAssignment = assignments.find((a) => a._id === aid);
  
 
  const canEdit = (currentUser as CurrentUser)?.role === "FACULTY" || 
                  (currentUser as CurrentUser)?.role === "TA";
  
  const [assignmentForm, setAssignmentForm] = useState<AssignmentForm>({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    untilDate: "",
  });

 
  useEffect(() => {
    const fetchAssignments = async () => {
      if (assignments.length === 0 && cid) {
        try {
          const fetchedAssignments = await client.findAssignmentsForCourse(cid as string);
          dispatch(setAssignments(fetchedAssignments));
        } catch (error) {
          console.error("Error fetching assignments:", error);
        }
      }
    };
    fetchAssignments();
  }, [assignments.length, cid, dispatch]);

  
  useEffect(() => {
    if (existingAssignment && !isNew) {
      setAssignmentForm({
        title: existingAssignment.title,
        description: existingAssignment.description,
        points: existingAssignment.points,
        dueDate: existingAssignment.dueDate,
        availableDate: existingAssignment.availableDate,
        untilDate: existingAssignment.untilDate,
      });
    }
  }, [existingAssignment, isNew]);

  useEffect(() => {
    if (isNew && !canEdit) {
      router.push(`/Courses/${cid}/Assignments`);
    }
  }, [isNew, canEdit, cid, router]);

  const handleSave = async () => {
    try {
      if (isNew) {
        const newAssignment = await client.createAssignmentForCourse(cid as string, {
          ...assignmentForm,
          course: cid as string,
        });
        const updatedAssignments = [...assignments, newAssignment];
        dispatch(setAssignments(updatedAssignments));
      } else {
        const updatedAssignment = await client.updateAssignment({
          _id: aid as string,
          course: cid as string,
          ...assignmentForm,
        });
        const updatedAssignments = assignments.map((a) =>
          a._id === aid ? updatedAssignment : a
        );
        dispatch(setAssignments(updatedAssignments));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  
  if (!isNew && assignments.length === 0) {
    return <Container><p>Loading assignment...</p></Container>;
  }

 
  if (!isNew && assignments.length > 0 && !existingAssignment) {
    return (
      <Container>
        <p>Assignment not found</p>
        <Button onClick={() => router.push(`/Courses/${cid}/Assignments`)}>
          Back to Assignments
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h2>{canEdit ? (isNew ? "Create Assignment" : "Edit Assignment") : "View Assignment"}</h2>
      
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl
        id="wd-name"
        value={assignmentForm.title}
        onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, title: e.target.value })}
        className="mb-3"
        disabled={!canEdit}
      />

      <FormControl
        as="textarea"
        id="wd-description"
        rows={10}
        className="mb-3"
        value={assignmentForm.description}
        onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, description: e.target.value })}
        disabled={!canEdit}
      />

      <Row className="mb-3">
        <FormLabel column sm={2} className="wd-assignment-details-label text-end">
          Points
        </FormLabel>
        <Col sm={10}>
          <FormControl 
            id="wd-points" 
            value={assignmentForm.points} 
            type="number"
            onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, points: parseInt(e.target.value) })}
            disabled={!canEdit}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2} className="wd-assignment-details-label text-end">
          Assignment Group
        </FormLabel>
        <Col sm={10}>
          <FormSelect id="wd-group" disabled={!canEdit}>
            <option>ASSIGNMENTS</option>
            <option>QUIZZES</option>
            <option>EXAMS</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2} className="wd-assignment-details-label text-end">
          Display Grade as
        </FormLabel>
        <Col sm={10}>
          <FormSelect id="wd-display-grade-as" disabled={!canEdit}>
            <option>Percentage</option>
            <option>Points</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2} className="wd-assignment-details-label text-end">
          Submission Type
        </FormLabel>
        <Col sm={10}>
          <div className="border p-3 rounded">
            <FormSelect id="wd-submission-type" className="mb-3" disabled={!canEdit}>
              <option>Online</option>
              <option>In-Person</option>
            </FormSelect>

            <div>
              <strong>Online Entry Options</strong>
              <div className="mt-2">
                <FormCheck
                  type="checkbox"
                  id="wd-text-entry"
                  label="Text Entry"
                  className="m-2"
                  disabled={!canEdit}
                />
                <FormCheck
                  type="checkbox"
                  id="wd-website-url"
                  label="Website URL"
                  className="m-2"
                  defaultChecked
                  disabled={!canEdit}
                />
                <FormCheck
                  type="checkbox"
                  id="wd-media-recordings"
                  label="Media Recordings"
                  className="m-2"
                  disabled={!canEdit}
                />
                <FormCheck
                  type="checkbox"
                  id="wd-student-annotation"
                  label="Student Annotation"
                  className="m-2"
                  disabled={!canEdit}
                />
                <FormCheck
                  type="checkbox"
                  id="wd-file-upload"
                  label="File Upload"
                  className="m-2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2} className="wd-assignment-details-label text-end">
          Assign
        </FormLabel>
        <Col sm={10}>
          <div className="border p-3 rounded">
            <FormLabel htmlFor="wd-assign-to">
              <strong>Assign to</strong>
            </FormLabel>
            <FormSelect multiple id="wd-assign-to" className="mb-3" disabled={!canEdit}>
              <option>Everyone</option>
              <option>Group 1</option>
              <option>Group 2</option>
              <option>Group 3</option>
            </FormSelect>

            <FormLabel htmlFor="wd-due-date">
              <strong>Due</strong>
            </FormLabel>
            <FormControl
              type="datetime-local"
              id="wd-due-date"
              value={assignmentForm.dueDate}
              onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
              className="mb-3"
              disabled={!canEdit}
            />

            <Row>
              <Col sm={6}>
                <FormLabel htmlFor="wd-available-from">
                  <strong>Available from</strong>
                </FormLabel>
                <FormControl
                  type="datetime-local"
                  id="wd-available-from"
                  value={assignmentForm.availableDate}
                  onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, availableDate: e.target.value })}
                  disabled={!canEdit}
                />
              </Col>
              <Col sm={6}>
                <FormLabel htmlFor="wd-available-until">
                  <strong>Until</strong>
                </FormLabel>
                <FormControl
                  type="datetime-local"
                  id="wd-available-until"
                  value={assignmentForm.untilDate}
                  onChange={(e) => canEdit && setAssignmentForm({ ...assignmentForm, untilDate: e.target.value })}
                  disabled={!canEdit}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />

      {canEdit && (
        <div className="text-end">
          <Button 
            variant="secondary" 
            className="me-2" 
            id="wd-cancel-assignment"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            id="wd-save-assignment"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </Container>
  );
}