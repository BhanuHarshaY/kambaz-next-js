"use client";

import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        {/* Assignment Name */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control id="wd-name" defaultValue="A1" />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-description">Description</Form.Label>
          <div id="wd-description" className="border p-3" style={{ minHeight: "200px" }}>
            <p>The assignment is <span className="text-danger">available online</span></p>
            <p>Submit a link to the landing page of your Web application running on Netlify.</p>
            <p>The landing page should include the following:</p>
            <ul>
              <li>Your full name and section</li>
              <li>Links to each of the lab assignments</li>
              <li>Link to the Kambaz application</li>
              <li>Links to all relevant source code repositories</li>
            </ul>
            <p>The Kambaz application should include a link to navigate back to the landing page.</p>
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-points">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control id="wd-points" type="number" defaultValue={100} />
          </Col>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-group">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Display Grade as */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-display-grade-as">
            Display Grade as
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-display-grade-as" defaultValue="Percentage">
              <option value="Percentage">Percentage</option>
              <option value="Points">Points</option>
              <option value="Complete/Incomplete">Complete/Incomplete</option>
              <option value="Letter Grade">Letter Grade</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Submission Type */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-submission-type">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <div className="border p-3">
              <Form.Select id="wd-submission-type" defaultValue="Online" className="mb-3">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External Tool">External Tool</option>
                <option value="No Submission">No Submission</option>
              </Form.Select>

              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" />
              <Form.Check type="checkbox" id="wd-website-url" label="Website URL" defaultChecked />
              <Form.Check type="checkbox" id="wd-media-recordings" label="Media Recordings" />
              <Form.Check type="checkbox" id="wd-student-annotation" label="Student Annotation" />
              <Form.Check type="checkbox" id="wd-file-upload" label="File Uploads" />
            </div>
          </Col>
        </Form.Group>

        {/* Assign */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Assign
          </Form.Label>
          <Col sm={9}>
            <div className="border p-3">
              <Form.Label htmlFor="wd-assign-to" className="fw-bold">
                Assign to
              </Form.Label>
              <Form.Control id="wd-assign-to" defaultValue="Everyone" className="mb-3" />

              <Form.Label htmlFor="wd-due-date" className="fw-bold">
                Due
              </Form.Label>
              <Form.Control
                id="wd-due-date"
                type="datetime-local"
                defaultValue="2024-05-13T23:59"
                className="mb-3"
              />

              <Row>
                <Col>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <Form.Control
                    id="wd-available-from"
                    type="datetime-local"
                    defaultValue="2024-05-06T00:00"
                  />
                </Col>
                <Col>
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">
                    Until
                  </Form.Label>
                  <Form.Control
                    id="wd-available-until"
                    type="datetime-local"
                    defaultValue="2024-05-20T23:59"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Form.Group>

        {/* Action Buttons */}
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button variant="danger">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}