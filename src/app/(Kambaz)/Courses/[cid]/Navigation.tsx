"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  
  
  const pathSegments = pathname.split('/');
  const cid = pathSegments[2]; 
  
  // Data-driven navigation links
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath = link === "People" ? `/Courses/${cid}/People/Table` : `/Courses/${cid}/${link}`;
        const isActive = pathname.includes(`/${link}`);
        
        return (
          <Link 
            key={link}
            href={linkPath}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ${isActive ? "active" : "text-danger"}`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}