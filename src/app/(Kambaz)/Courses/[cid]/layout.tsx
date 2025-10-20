import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../Database";

interface CoursesLayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default async function CoursesLayout({ children, params }: CoursesLayoutProps) {
  const { cid } = await params;
  const course = courses.find((course) => course._id === cid);

  return (
    <div id="wd-courses" className="mt-4">
      
      <Breadcrumb course={course} />
      <hr />

      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill ms-0 ps-0">
          {children}
        </div>
      </div>
    </div>
  );
}