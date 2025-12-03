/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container, Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../Details";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { findUsersForCourse } from "../../../client";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers?: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>(users);
  const { cid } = useParams();

  useEffect(() => {
    const loadUsers = async () => {
      if (users.length === 0 && cid) {
        const courseUsers = await findUsersForCourse(cid as string);
        setEnrolledUsers(courseUsers?.filter((user: any) => user != null) || []);
      } else {
        setEnrolledUsers(users);
      }
    };
    loadUsers();
  }, [cid, users]);

  return (
    <Container id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            if (fetchUsers) {
              fetchUsers();
            }
          }}
        />
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}