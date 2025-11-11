// File: src/app/(Kambaz)/Courses/[cid]/layout.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

type CurrentUser = {
  _id: string;
  role: string;
} | null;

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();

  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  
  const course = courses.find((c) => c._id === cid);
  const [showNavigation, setShowNavigation] = useState(true);

  // Check if user is enrolled
  useEffect(() => {
    if (!currentUser) return;
    
    const userId = currentUser!._id;

    const isEnrolled = enrollments.some(
      (enrollment: Enrollment) =>
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