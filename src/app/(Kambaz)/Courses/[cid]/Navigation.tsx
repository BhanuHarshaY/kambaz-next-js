"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link 
        href="/Courses/1234/Home" 
        id="wd-course-home-link"
        className={`list-group-item border-0 ${pathname.includes("/Home") ? "active" : "text-danger"}`}
      >
        Home
      </Link>
      <Link 
        href="/Courses/1234/Modules" 
        id="wd-course-modules-link"
        className={`list-group-item border-0 ${pathname.includes("/Modules") ? "active" : "text-danger"}`}
      >
        Modules
      </Link>
      <Link 
        href="/Courses/1234/Piazza" 
        id="wd-course-piazza-link"
        className={`list-group-item border-0 ${pathname.includes("/Piazza") ? "active" : "text-danger"}`}
      >
        Piazza
      </Link>
      <Link 
        href="/Courses/1234/Zoom" 
        id="wd-course-zoom-link"
        className={`list-group-item border-0 ${pathname.includes("/Zoom") ? "active" : "text-danger"}`}
      >
        Zoom
      </Link>
      <Link 
        href="/Courses/1234/Assignments" 
        id="wd-course-assignments-link"
        className={`list-group-item border-0 ${pathname.includes("/Assignments") ? "active" : "text-danger"}`}
      >
        Assignments
      </Link>
      <Link 
        href="/Courses/1234/Quizzes" 
        id="wd-course-quizzes-link"
        className={`list-group-item border-0 ${pathname.includes("/Quizzes") ? "active" : "text-danger"}`}
      >
        Quizzes
      </Link>
      <Link 
        href="/Courses/1234/People/Table" 
        id="wd-course-people-link"
        className={`list-group-item border-0 ${pathname.includes("/People") ? "active" : "text-danger"}`}
      >
        People
      </Link>
    </div>
  );
}