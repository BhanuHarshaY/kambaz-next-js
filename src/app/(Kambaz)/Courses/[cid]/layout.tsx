"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  
  const course = courses.find((c: any) => c._id === cid);
  const [showNavigation, setShowNavigation] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const userId = currentUser._id;

    const isEnrolled = enrollments.some(
      (enrollment: any) =>
        enrollment.user === userId &&
        enrollment.course === cid
    );
    
    if (!isEnrolled) {
      alert("You must be enrolled in this course to access it.");
      router.push("/Dashboard");
    }
  }, [currentUser, enrollments, cid, router]);

  const toggleNavigation = () => {
    setShowNavigation(!showNavigation);
  };

  return (
    <div id="wd-courses" className="mt-4">
      <h2 className="text-danger">
        <FaAlignJustify 
          className="me-4 fs-4 mb-1" 
          style={{ cursor: "pointer" }}
          onClick={toggleNavigation}
        />
        {course?.name || "Course Not Found"}
      </h2>
      
      <hr />

      <div className="d-flex">
        {showNavigation && (
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
        )}

        <div className="flex-fill ms-0 ps-0">
          {children}
        </div>
      </div>
    </div>
  );
}