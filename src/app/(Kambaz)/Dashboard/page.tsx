"use client";

import Link from "next/link";
import { Row, Col, Card, Button } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard" className="mt-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/reactjs.jpg"
                  className="card-img-top"
                  alt="ReactJS"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS1234 React JS
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/PDP.jpg"
                  className="card-img-top"
                  alt="PDP"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS5010 Program Design Paradigm
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Program Design patterns
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/DBMS.jpg"
                  className="card-img-top"
                  alt="DBMS"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS5200 DBMS
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Database Management System
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/algo.jpg"
                  className="card-img-top"
                  alt="Algorithms"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS5800 Algorithms
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Algorithm design and analysis
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/ML.jpg"
                  className="card-img-top"
                  alt="Machine Learning"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS6140 Machine Learning
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    ML models and applications
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/NLP.jpg"
                  className="card-img-top"
                  alt="NLP"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS6120 NLP
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Natural Language Processing
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link
                href="/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/webdev.jpg"
                  className="card-img-top"
                  alt="Web Development"
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="card-title text-nowrap overflow-hidden">
                    CS5610 Web Development
                  </h5>
                  <p
                    className="card-text overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    Full Stack development
                  </p>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}