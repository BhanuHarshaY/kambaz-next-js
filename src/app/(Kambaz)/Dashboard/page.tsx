
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row, FormControl } from "react-bootstrap";
import { RootState } from "../store";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollInCourse, unenrollFromCourse } from "./enrollmentsReducer";
import { useRouter } from "next/navigation";

// Define the Course interface
interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  description: string;
  department?: string;
  credits?: number;
}

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

type CurrentUser = {
  _id: string;
  role: string;
} | null;

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  
  // State for showing all courses vs enrolled only
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // State for the form that handles both add and edit
  const [courseForm, setCourseForm] = useState({
    name: "New Course",
    description: "New Description",
    number: "NEW101",
    startDate: "2024-01-10",
    endDate: "2024-05-15",
    department: "D123",
    credits: 3,
  });
  
  // State to track which course is being edited
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string): boolean => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment: Enrollment) =>
        enrollment.user === (currentUser as CurrentUser)?._id &&
        enrollment.course === courseId
    );
  };
  
  // Get courses to display based on enrollment filter
  const getDisplayedCourses = (): Course[] => {
    if (showAllCourses) {
      return courses;
    }
    // Show only enrolled courses
    return courses.filter((course: Course) => isEnrolled(course._id));
  };
  
  // Handle enrollment/unenrollment
  const handleEnrollment = (courseId: string) => {
    if (!currentUser) return;
    
    const userId = (currentUser as CurrentUser)!._id;

    if (isEnrolled(courseId)) {
      dispatch(unenrollFromCourse({
        userId: userId,
        courseId: courseId
      }));
    } else {
      dispatch(enrollInCourse({
        userId: userId,
        courseId: courseId
      }));
    }
  };
  
  // Handle navigation to course
  const handleCourseNavigation = (courseId: string) => {
    if (isEnrolled(courseId)) {
      router.push(`/Courses/${courseId}/Home`);
    } else {
      alert("You must be enrolled in this course to access it.");
    }
  };
  
  // Mapping of course to their specific images
  const courseImages: { [key: string]: string } = {
    "RS101": "/images/rocketpropulsion.jpg",
    "RS102": "/images/aerodynamics.jpg",
    "RS103": "/images/spacecraft design.jpg",
    "RS104": "/images/organic chemistry.jpg",
    "RS105": "/images/inorganic chemistry.jpg",
    "RS106": "/images/Physical Chemistry.jpg",
    "RS107": "/images/ancient language.jpg",
    "RS108": "/images/wizard.jpg"
  };
  
  const getDefaultImage = () => "/images/rocketpropulsion.jpg";
  
  const handleAddCourse = () => {
    const newCourse: Course = {
      _id: `RS${Math.floor(Math.random() * 1000)}`,
      ...courseForm,
      credits: Number(courseForm.credits),
    };
    dispatch(addNewCourse(newCourse));
    resetForm();
  };
  
  const handleUpdateCourse = () => {
    if (editingCourseId) {
      const updatedCourse: Course = {
        _id: editingCourseId,
        ...courseForm,
        credits: Number(courseForm.credits),
      };
      dispatch(updateCourse(updatedCourse));
      resetForm();
      setEditingCourseId(null);
    }
  };
  
  const resetForm = () => {
    setCourseForm({
      name: "New Course",
      description: "New Description",
      number: "NEW101",
      startDate: "2024-01-10",
      endDate: "2024-05-15",
      department: "D123",
      credits: 3,
    });
  };
  
  const handleEditClick = (course: Course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      name: course.name,
      description: course.description,
      number: course.number,
      startDate: course.startDate,
      endDate: course.endDate,
      department: course.department || "D123",
      credits: course.credits || 3,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourse(courseId));
    }
  };
  
  const displayedCourses = getDisplayedCourses();
  
  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="mb-3"
        >
          Enrollments
        </Button>
      </div>
      <hr />
      
      {(currentUser as CurrentUser)?.role === "FACULTY" && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>New Course</h2>
            <div className="d-flex gap-2">
              <Button
                variant="warning"
                onClick={handleUpdateCourse}
                style={{ backgroundColor: "#ffc107", border: "none", color: "black" }}
                disabled={!editingCourseId}
              >
                Update
              </Button>
              <Button
                variant="primary"
                onClick={handleAddCourse}
              >
                Add
              </Button>
            </div>
          </div>
          
          <FormControl
            placeholder="Course Name"
            value={courseForm.name}
            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
            className="mb-2"
            style={{ fontSize: "1.1rem" }}
          />
          <FormControl
            as="textarea"
            rows={4}
            placeholder="Course Description"
            value={courseForm.description}
            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            style={{ fontSize: "1rem", minHeight: "120px" }}
          />
        </div>
      )}
      
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} ({displayedCourses.length})
      </h2>
      <hr />
      
      <div id="wd-dashboard-courses">
        <Row xs={1} md={3} lg={3} className="g-4">
          {displayedCourses.map((course: Course) => (
            <Col key={course._id} className="wd-dashboard-course">
              <Card className="h-100">
                <CardImg 
                  src={courseImages[course._id] || getDefaultImage()} 
                  variant="top" 
                  height={160}
                  alt={course.name}
                  style={{ objectFit: "cover" }}
                />
                <CardBody className="d-flex flex-column">
                  <CardTitle className="wd-dashboard-course-title fw-bold">
                    {course.name}
                  </CardTitle>
                  <CardText 
                    className="wd-dashboard-course-description flex-grow-1 text-muted" 
                    style={{ 
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.5",
                      minHeight: "4.5em",
                      fontSize: "0.95rem"
                    }}
                  >
                    {course.description}
                  </CardText>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleCourseNavigation(course._id)}
                      >
                        Go
                      </Button>
                      <Button
                        variant={isEnrolled(course._id) ? "danger" : "success"}
                        size="sm"
                        onClick={() => handleEnrollment(course._id)}
                      >
                        {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                      </Button>
                    </div>
                    {(currentUser as CurrentUser)?.role === "FACULTY" && (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => handleEditClick(course)}
                          style={{ backgroundColor: "#ffc107", border: "none", color: "black" }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}