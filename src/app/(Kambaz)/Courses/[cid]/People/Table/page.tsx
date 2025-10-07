import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
 return (
  <div id="wd-people-table">
   <Table striped>
    <thead>
     <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
    </thead>
    <tbody>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Tony</span>{" "}
          <span className="wd-last-name">Stark</span></td>
      <td className="wd-login-id">001234561S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2025-09-01</td>
      <td className="wd-total-activity">10:21:32</td></tr>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Bhanu Harsha</span>{" "}
          <span className="wd-last-name">Y</span></td>
      <td className="wd-login-id">001123451S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2025-09-02</td>
      <td className="wd-total-activity">10:01:32</td></tr>
      <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">BR</span>{" "}
          <span className="wd-last-name">Harshitha</span></td>
      <td className="wd-login-id">001134581S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2025-10-02</td>
      <td className="wd-total-activity">11:08:25</td></tr>
      <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Rocky</span>{" "}
          <span className="wd-last-name">Y</span></td>
      <td className="wd-login-id">001134591S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2025-09-01</td>
      <td className="wd-total-activity">10:21:33</td></tr>
    </tbody>
   </Table>
  </div> );}

