"use client";

import { useState } from "react";

export default function CourseHome() {
   return (
    <div style={{ display: "flex", gap: "20px" }}>
      
      <div style={{ flex: 3 }}>
        {/* Top control buttons */}
        <div style={{ marginBottom: "10px" }}>
          <button>Collapse All</button>
          <button>
            View Progress
          </button>
            <select defaultValue="">
      <option value="" disabled>
        Publish All
      </option>
      <option value="module1">Module 1</option>
      <option value="module2">Module 2</option>
      <option value="module2">Module 3</option>
    </select>
          <button>+ Module</button>
        </div>

       

        <ul id="wd-modules">
          {/* Week 1 */}
          <li className="wd-module">
            <div className="wd-title">
              Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
            </div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">LEARNING OBJECTIVES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Introduction to the course
                  </li>
                  <li className="wd-content-item">
                    Learn what is Web Development
                  </li>
                </ul>
              </li>

              <li className="wd-lesson">
                <span className="wd-title">READING</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 1 - Introduction
                  </li>
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 2 - Creating User 
                  </li>
                </ul>
              </li>

              <li className="wd-lesson">
                <span className="wd-title">SLIDES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Introduction to Web Development
                  </li>
                  <li className="wd-content-item">
                    Creating an HTTP Server with Node.js
                  </li>
                  <li className="wd-content-item">
                    Creating a React Application
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* Week 1, Lecture 2 */}
          <li className="wd-module">
            <div className="wd-title">
              Week 1, Lecture 2 - Formatting User Interfaces with HTML
            </div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">LEARNING OBJECTIVES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Learn how to create user interfaces using HTML
                  </li>
                  <li className="wd-content-item">
                    Deploying React.js to a remote server


                  </li>
                </ul>
              </li>

              <li className="wd-lesson">
                <span className="wd-title">READING</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 3 - Introduction to HTML
                  </li>
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 4 - Formating web content with headings
                  </li>
                </ul>
              </li>

              <li className="wd-lesson">
                <span className="wd-title">SLIDES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Introduction to HTML and DOM
                  </li>
                  <li className="wd-content-item">
                    Formating web content with headings and paragraphs
                  </li>
                  <li className="wd-content-item">
                    Formating content with lists and tables and more
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* Week 2 */}
          <li className="wd-module">
            <div className="wd-title">Week 2, Lecture 3 - Styling Web Pages with CSS</div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">LEARNING OBJECTIVES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Intro to CSS</li>
                  <li className="wd-content-item">Styling Webpages with the React Bootstrap CSS Library</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">READING</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 5 - Introduction to CSS
                  </li>
                  <li className="wd-content-item">
                    Full Stack Developer - Chapter 6 -  Decorating Documents with React Icons
                  </li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">SLIDES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">
                    Introduction to Web Development using CSS
                  </li>
                  <li className="wd-content-item">
                    Styling User Interfaces with CSS


                  </li>
                  <li className="wd-content-item">
                    Styling color, position, layout, grids


                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      
    </div>
  );
}