
"use client";

import { useState } from "react";
import { Container, ListGroup, FormControl } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteModule, editModule, updateModule } from "./reducer";
import GreenCheckmark from "./GreenCheckmark";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";

// Define proper types
interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module: string;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  description?: string;
  lessons?: Lesson[];
  editing?: boolean;
}

// Add type for currentUser
type CurrentUser = {
  _id: string;
  role: string;
} | null;

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  
  // Get modules and currentUser from Redux store
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  // State for controlling the module name input during editing
  const [editingModuleName, setEditingModuleName] = useState("");

  // Handle module deletion
  const handleDeleteModule = (moduleId: string) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      dispatch(deleteModule(moduleId));
    }
  };

  // Handle module edit mode
  const handleEditModule = (moduleId: string) => {
    const moduleItem = modules.find((m: Module) => m._id === moduleId);
    if (moduleItem) {
      setEditingModuleName(moduleItem.name);
      dispatch(editModule(moduleId));
    }
  };

  // Handle module update
  const handleUpdateModule = (moduleItem: Module) => {
    dispatch(updateModule({ ...moduleItem, editing: false }));
  };

  return (
    <Container>
      <ModulesControls />
      <br />
      <br />
      <br />
      <br />
      
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((moduleItem: Module) => moduleItem.course === cid)
          .map((moduleItem: Module) => (
            <ListGroup.Item
              key={moduleItem._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  {!moduleItem.editing && moduleItem.name}
                  {moduleItem.editing && (currentUser as CurrentUser)?.role === "FACULTY" && (
                    <FormControl
                      className="w-auto d-inline-block"
                      value={editingModuleName}
                      onChange={(e) => setEditingModuleName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateModule({ ...moduleItem, name: editingModuleName });
                          setEditingModuleName("");
                        }
                        if (e.key === "Escape") {
                          dispatch(updateModule({ ...moduleItem, editing: false }));
                          setEditingModuleName("");
                        }
                      }}
                      onBlur={() => {
                        handleUpdateModule({ ...moduleItem, name: editingModuleName });
                        setEditingModuleName("");
                      }}
                      autoFocus
                    />
                  )}
                </div>
                
                {/* Conditional rendering based on user role */}
                {(currentUser as CurrentUser)?.role === "FACULTY" ? (
                  <ModuleControlButtons
                    moduleId={moduleItem._id}
                    deleteModule={handleDeleteModule}
                    editModule={handleEditModule}
                  />
                ) : (
                  <div className="float-end">
                    <GreenCheckmark />
                    <FaPlus className="ms-2" />
                    <IoEllipsisVertical className="fs-4 ms-2" />
                  </div>
                )}
              </div>
              
              {moduleItem.lessons && moduleItem.lessons.length > 0 && (
                <ListGroup className="wd-lessons rounded-0">
                  {moduleItem.lessons.map((lesson: Lesson) => (
                    <ListGroup.Item
                      key={lesson._id}
                      className="wd-lesson p-3 ps-1"
                    >
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      <LessonControlButtons />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </Container>
  );
}