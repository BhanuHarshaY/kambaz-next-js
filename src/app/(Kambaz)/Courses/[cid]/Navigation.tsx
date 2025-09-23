import Link from "next/link";
export default function CourseNavigation() {
  return (
    <div id="wd-courses-navigation">
      <Link href="/Courses/1234/Home" id="wd-course-home-link">Home</Link><br/>
      <Link href="/Courses/1234/Modules" id="wd-course-modules-link">Modules
        </Link><br/>
      <Link href="/Courses/1234/Piazza" id="wd-course-Piazza-link">Piazza</Link><br/>
      <Link href="/Courses/1234/Zoom" id="wd-course-Zoom-link">Zoom</Link><br/>
      <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link">
          Assignments</Link><br/>
      <Link href="/Courses/1234/Quizzes" id="wd-course-Quizzes-link">Quizzes
        </Link><br/>
      <Link href="/Courses/1234/Grades" id="wd-course-Grades-link">Grades</Link><br/>
      <Link href="/Courses/1234/People" id="wd-course-People-link">People</Link><br/>
    </div>
  );}

