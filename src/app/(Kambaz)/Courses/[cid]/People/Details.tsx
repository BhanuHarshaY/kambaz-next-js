/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../Account/client";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FormControl } from "react-bootstrap";

export default function PeopleDetails({ 
  uid, 
  onClose 
}: { 
  uid: string | null; 
  onClose: () => void; 
}) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  
  const fetchUser = async () => {
    if (!uid) return;
    try {
      const fetchedUser = await client.findUserById(uid);
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
      setName(`${fetchedUser.firstName} ${fetchedUser.lastName}`);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const deleteUser = async (uid: string) => {
    try {
      console.log("Attempting to delete user with ID:", uid);
      const result = await client.deleteUser(uid);
      console.log("Delete result:", result);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };
  
  useEffect(() => {
    if (uid) {
      fetchUser();
    }
  }, [uid]);
  
  if (!uid || !user) return null;
  
  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      {/* Close button - top right */}
      <button 
        onClick={onClose} 
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>
      
      {/* User icon */}
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      
      {/* Editable name section */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        {!editing && (
          <div 
            className="text-danger fs-4 wd-name flex-grow-1"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        
        {editing && (
          <FormControl 
            className="wd-edit-name flex-grow-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { 
                saveUser(); 
              }
            }}
          />
        )}
        
        {/* Edit/Save icon */}
        {!editing && (
          <FaPencil 
            onClick={() => setEditing(true)}
            className="fs-5 ms-2 wd-edit text-primary" 
            style={{ cursor: "pointer" }}
          />
        )}
        {editing && (
          <FaCheck 
            onClick={saveUser}
            className="fs-5 ms-2 wd-save text-success" 
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      
      {/* User details */}
      <b>Roles:</b>{" "}
      <span className="wd-roles">{user.role}</span>
      <br />
      
      <b>Login ID:</b>{" "}
      <span className="wd-login-id">{user.loginId}</span>
      <br />
      
      <b>Section:</b>{" "}
      <span className="wd-section">{user.section}</span>
      <br />
      
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>

      <hr />
      
      {/* Action buttons */}
      <button 
        onClick={() => deleteUser(uid)} 
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button 
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}