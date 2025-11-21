
"use client";
import React, { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setCourses } from "../../Courses/reducer";
import * as courseClient from "../../Courses/client";

export default function Breadcrumb() {
  const pathname = usePathname();
  const { cid } = useParams();
  const dispatch = useDispatch();
  
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const course = courses.find((c) => c._id === cid);


  useEffect(() => {
    const fetchCourses = async () => {
      if (courses.length === 0 && currentUser) {
        try {
          
          const fetchedCourses = currentUser 
            ? await courseClient.findMyCourses()
            : await courseClient.fetchAllCourses();
          dispatch(setCourses(fetchedCourses));
        } catch (error) {
          console.error("Error fetching courses:", error);
          
          try {
            const allCourses = await courseClient.fetchAllCourses();
            dispatch(setCourses(allCourses));
          } catch (err) {
            console.error("Error fetching all courses:", err);
          }
        }
      }
    };
    fetchCourses();
  }, [courses.length, currentUser, dispatch]);
  
  
  const pathSegments = pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1];
  
  
  let displaySection = currentSection;
  if (pathname.includes("/People")) {
    displaySection = "People";
  } else if (currentSection === "Home") {
    displaySection = "Home";
  } else if (currentSection === "Modules") {
    displaySection = "Modules";
  } else if (currentSection === "Assignments") {
    displaySection = "Assignments";
  } else if (pathname.includes("/Assignments/") && currentSection !== "Assignments") {
    displaySection = "Assignment Editor";
  }
  
  
  const courseName = course?.name || (courses.length === 0 ? "Loading..." : "Course Not Found");
  
  return (
    <h2 className="text-danger">
      <span>≡ {courseName} &gt; {displaySection}</span>
    </h2>
  );
}