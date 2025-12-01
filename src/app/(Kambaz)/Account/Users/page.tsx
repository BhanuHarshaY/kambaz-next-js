/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import PeopleTable from "../../Courses/[cid]/People/Table/page";
import * as client from "../client";
import { FaPlus } from "react-icons/fa6";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  
  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const filteredUsers = await client.findUsersByRole(role);
      setUsers(filteredUsers);
    } else {
      fetchUsers();
    }
  };
  
  const fetchUsers = async () => {
    console.log("=== fetchUsers called - refreshing user list");
    const allUsers = await client.findAllUsers();
    console.log("Fetched users count:", allUsers.length);
    setUsers(allUsers);
  };
  
  const createUser = async () => {
    console.log("=== CREATE USER BUTTON CLICKED ===");
    try {
      const newUserData = {
        firstName: "New",
        lastName: `User${users.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `newuser${Date.now()}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      };
      
      console.log("Creating new user with data:", newUserData);
      const newUser = await client.createUser(newUserData);
      console.log("Server returned new user:", newUser);
      
      setUsers([newUser, ...users]);
      console.log("Updated users state, new count:", users.length + 1);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Users</h3>
        <button 
          onClick={createUser} 
          className="btn btn-danger wd-add-people"
        >
          <FaPlus className="me-2" />
          Users
        </button>
      </div>
      
      <div className="mb-3">
        <FormControl 
          value={name}
          onChange={(e) => filterUsersByName(e.target.value)} 
          placeholder="Search people"
          className="float-start w-25 me-2 wd-filter-by-name" 
        />
        <select 
          value={role} 
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      <div className="clearfix mb-3"></div>

      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}