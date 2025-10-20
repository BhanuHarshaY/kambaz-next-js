import Link from "next/link";
import * as db from "../Database";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";

export default function Dashboard() {
  const courses = db.courses;
  
  // Mapping of course  to their specific images
  const courseImages: { [key: string]: string } = {
    "RS101": "/images/rocketpropulsion.jpg",     // Rocket Propulsion
    "RS102": "/images/aerodynamics.jpg",         // Aerodynamics
    "RS103": "/images/spacecraft design.jpg",     // Spacecraft Design
    "RS104": "/images/organic chemistry.jpg",     // Organic Chemistry
    "RS105": "/images/inorganic chemistry.jpg",   // Inorganic Chemistry
    "RS106": "/images/Physical Chemistry.jpg",    // Physical Chemistry
    "RS107": "/images/ancient language.jpg",      // Ancient Languages and Scripts of Middle-earth
    "RS108": "/images/wizard.jpg"                 // Wizards, Elves, and Men: Inter-species Diplomacy
  };
  

  
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg 
                    src={courseImages[course._id] } 
                    variant="top" 
                    width="100%" 
                    height={160}
                    alt={course.name}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name} 
                    </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description} 
                    </CardText>
                    <Button variant="primary"> Go </Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}