"use client";

import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

export default function Modules() {
  return (
    <div>
      <ModulesControls />
      <br /><br /><br /><br />
      
      <ListGroup className="rounded-0" id="wd-modules">
        {/* Week 1, Lecture 1 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
            </div>
            <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              LEARNING OBJECTIVES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Introduction to the course
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Learn what is Web Development
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              READING
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 1 - Introduction
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 2 - Creating User
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              SLIDES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <BiLink className="me-2 text-danger" />
              <span className="text-danger">Introduction to Web Development</span>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <BiLink className="me-2 text-danger" />
              <span className="text-danger">Creating an HTTP server with Node.js</span>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <BiLink className="me-2 text-danger" />
              <span className="text-danger">Creating a React Application</span>
              <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 1, Lecture 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 1, Lecture 2 - Formatting User Interfaces with HTML
            </div>
            <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              LEARNING OBJECTIVES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Learn how to create user interfaces using HTML
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Deploying React.js to a remote server
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              READING
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 3 - Introduction to HTML
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 4 - Formating web content with headings
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              SLIDES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Introduction to HTML and DOM
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Formating web content with headings and paragraphs
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Formating content with lists and tables and more
              <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 2 - Styling Web Pages with CSS
            </div>
            <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              LEARNING OBJECTIVES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Intro to CSS
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Styling Webpages with the React Bootstrap CSS Library
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              READING
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 5 - Introduction to CSS
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Full Stack Developer - Chapter 6 - Decorating Documents with React Icons
              <LessonControlButtons />
            </ListGroupItem>
            
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              SLIDES
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Introduction to Web Development using CSS
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Styling User Interfaces with CSS
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-5 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Styling color, position, layout, grids
              <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}