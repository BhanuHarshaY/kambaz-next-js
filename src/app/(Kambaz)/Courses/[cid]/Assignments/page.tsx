"use client";

import Link from "next/link";
import { Button } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearchSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { LuFilePen } from "react-icons/lu";

export default function Assignments() {
  return (
    <div id="wd-assignments" className="me-4">
      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "300px" }}>
          <IoSearchSharp className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search for Assignment"
          />
        </div>
        <div>
          <Button variant="secondary" className="me-2">
            <BsPlus className="fs-4" /> Group
          </Button>
          <Button variant="danger">
            <BsPlus className="fs-4" /> Assignment
          </Button>
        </div>
      </div>

      {/* Assignments Header */}
      <div className="d-flex justify-content-between align-items-center border border-secondary p-3 mb-0" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="d-flex align-items-center">
          <BsGripVertical className="fs-3 me-2" />
          <strong>ASSIGNMENTS</strong>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-3">40% of Total</span>
          <BsPlus className="fs-4 me-2" />
          <IoEllipsisVertical className="fs-4" />
        </div>
      </div>

      {/* Assignments List */}
      <ul className="list-group rounded-0">
        {/* Assignment A1 */}
        <li className="list-group-item d-flex align-items-center" style={{ borderLeft: "5px solid #28a745" }}>
          <BsGripVertical className="fs-3 me-2" />
          <LuFilePen className="fs-4 text-success me-3" />
          <div className="flex-grow-1">
            <Link href="/Courses/1234/Assignments/A1" className="text-dark text-decoration-none">
              <strong className="d-block">A1</strong>
            </Link>
            <small className="text-muted">
              <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am | 
            </small>
            <br />
            <small className="text-muted">
              <strong>Due</strong> May 13 at 11:59pm | 100 pts
            </small>
          </div>
          <div className="d-flex align-items-center">
            <FaCheckCircle className="text-success me-2" />
            <IoEllipsisVertical className="fs-4" />
          </div>
        </li>

        {/* Assignment A2 */}
        <li className="list-group-item d-flex align-items-center" style={{ borderLeft: "5px solid #28a745" }}>
          <BsGripVertical className="fs-3 me-2" />
          <LuFilePen className="fs-4 text-success me-3" />
          <div className="flex-grow-1">
            <Link href="/Courses/1234/Assignments/A2" className="text-dark text-decoration-none">
              <strong className="d-block">A2</strong>
            </Link>
            <small className="text-muted">
              <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 13 at 12:00am | 
            </small>
            <br />
            <small className="text-muted">
              <strong>Due</strong> May 20 at 11:59pm | 100 pts
            </small>
          </div>
          <div className="d-flex align-items-center">
            <FaCheckCircle className="text-success me-2" />
            <IoEllipsisVertical className="fs-4" />
          </div>
        </li>

        {/* Assignment A3 */}
        <li className="list-group-item d-flex align-items-center" style={{ borderLeft: "5px solid #28a745" }}>
          <BsGripVertical className="fs-3 me-2" />
          <LuFilePen className="fs-4 text-success me-3" />
          <div className="flex-grow-1">
            <Link href="/Courses/1234/Assignments/A3" className="text-dark text-decoration-none">
              <strong className="d-block">A3</strong>
            </Link>
            <small className="text-muted">
              <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 20 at 12:00am | 
            </small>
            <br />
            <small className="text-muted">
              <strong>Due</strong> May 27 at 11:59pm | 100 pts
            </small>
          </div>
          <div className="d-flex align-items-center">
            <FaCheckCircle className="text-success me-2" />
            <IoEllipsisVertical className="fs-4" />
          </div>
        </li>
      </ul>
    </div>
  );
}