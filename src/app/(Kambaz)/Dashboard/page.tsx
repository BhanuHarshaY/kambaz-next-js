"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  FormControl,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { setEnrollments } from "./enrollmentsReducer";
import { redirect } from "next/navigation";
import * as courseClient from "../Courses/client";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  if (!currentUser) {
    redirect("/Account/Signin");
  }

  const isFaculty = currentUser.role === "FACULTY";
  const isAdmin = currentUser.role === "ADMIN";
  const isStudent = currentUser.role === "STUDENT";
  const isTA = currentUser.role === "TA";
  const [showEnrollments, setShowEnrollments] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let coursesData;
        if (showEnrollments) {
          coursesData = await courseClient.fetchAllCourses();
        } else {
          coursesData = await courseClient.findMyCourses();
        }
        console.log("API returned courses:", JSON.stringify(coursesData, null, 2));
        console.log("Course IDs:", coursesData.map((c: any) => c._id));
        dispatch(setCourses(coursesData));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchEnrollments = async () => {
      try {
        const userEnrollments = await courseClient.findEnrollmentsForUser(
          currentUser._id
        );
        dispatch(setEnrollments(userEnrollments));
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    if (currentUser) {
      fetchCourses();
      fetchEnrollments();
    }
  }, [currentUser._id, dispatch, showEnrollments]);

  const onAddCourse = async () => {
    try {
      await courseClient.createCourse({
        ...course,
        image: "/images/reactjs.jpg",
      });
      const updatedCourses = await courseClient.findMyCourses();
      dispatch(setCourses(updatedCourses));
      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const onUpdateCourse = async () => {
    try {
      await courseClient.updateCourse(course);
      dispatch(
        setCourses(
          courses.map((c: any) => (c._id === course._id ? course : c))
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      dispatch(setCourses(courses.filter((c: any) => c._id !== courseId)));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const onEnroll = async (courseId: string) => {
    try {
      await courseClient.enrollInCourse(currentUser._id, courseId);
      const updatedEnrollments = await courseClient.findEnrollmentsForUser(
        currentUser._id
      );
      dispatch(setEnrollments(updatedEnrollments));
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const onUnenroll = async (courseId: string) => {
  try {
    await courseClient.unenrollFromTheCourse(currentUser._id, courseId);
    const updatedEnrollments = await courseClient.findEnrollmentsForUser(
      currentUser._id
    );
    dispatch(setEnrollments(updatedEnrollments));
  } catch (error) {
    console.error("Error unenrolling:", error);
  }
};

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  const courseImages: { [key: string]: string } = {
    RS101: "/images/rocketpropulsion.jpg",
    RS102: "/images/aerodynamics.jpg",
    RS103: "/images/spacecraft design.jpg",
    RS104: "/images/organic chemistry.jpg",
    RS105: "/images/inorganic chemistry.jpg",
    RS106: "/images/Physical Chemistry.jpg",
    RS107: "/images/ancient language.jpg",
    RS108: "/images/wizard.jpg",
  };

  const getCourseImage = (courseId: string, courseImage?: string) => {
    if (courseImage) return courseImage;
    return courseImages[courseId] || "/images/reactjs.jpg";
  };
  

  return (
    <Container id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      
      {/* FACULTY and ADMIN can add/update courses - NOT TA */}
      {(isFaculty || isAdmin) && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      
      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
        {/* Both Students AND TAs get Enrollments button */}
        {(isStudent || isTA) && (
          <Button
            variant="primary"
            className="float-end"
            style={{ marginTop: "-4px" }}
            onClick={() => setShowEnrollments(!showEnrollments)}
          >
            Enrollments
          </Button>
        )}
      </h2>
      <hr />
      
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: any) => (
            <Col
              className="wd-dashboard-course"
              key={course._id}
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => {
                    const canAccess = isEnrolled(course._id) || isFaculty || isAdmin;
                    
                    if (!canAccess) {
                      e.preventDefault();
                      alert("You must be enrolled in this course to access it.");
                    }
                  }}
                >
                  <CardImg
                    src={getCourseImage(course._id, course.image)}
                    variant="top"
                    width="100%"
                    height={160}
                    alt={course.name}
                    style={{ objectFit: "cover" }}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>

                    {/* Student/TA View */}
                    {(isStudent || isTA) && (
                      <>
                        {/* Show Go button if enrolled and not in enrollment view */}
                        {isEnrolled(course._id) && !showEnrollments && (
                          <Button variant="primary">Go</Button>
                        )}

                        {/* Show Enroll/Unenroll when in enrollment view */}
                        {showEnrollments && (
                          <>
                            {isEnrolled(course._id) ? (
                              <Button
                                variant="danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onUnenroll(course._id);
                                    
                                  
                                }}
                              >
                                Unenroll
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onEnroll(course._id);
                                }}
                              >
                                Enroll
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Faculty and ADMIN View - NOT TA */}
                    {(isFaculty || isAdmin) && (
                      <>
                        <Button variant="primary">Go</Button>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}