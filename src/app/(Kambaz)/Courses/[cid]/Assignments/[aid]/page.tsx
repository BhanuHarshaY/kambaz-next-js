export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br /><br />

      <label htmlFor="wd-description">Description</label>
      <textarea
        id="wd-description"
        defaultValue={
          "The assignment is available online Submit a Grades link to the landing page of your Web application running on Vercel. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kambas application Links to all relevant source code repositories The Kambas application should include a link to navigate back to the landing page."
        }
        rows={8}
        style={{ width: "50%", minHeight: 75 }}
      />
      <br /><br />

      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>PROJECT</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option>Points</option>
                <option>Percentage</option>
                <option>Complete/Incomplete</option>
              </select>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type">
                <option>Online</option>
                <option>Paper\Hard copy</option>
                <option>No Submission</option>
              </select>
              <br />

              Online Entry Options
              <br />

              <label>
                <input type="checkbox" id="wd-text-entry" /> Text Entry
              </label>
              <br />
              <label>
                <input type="checkbox" id="wd-website-url" /> Website URL
              </label>
              <br />
              <label>
                <input type="checkbox" id="wd-media-recordings" /> Media Recordings
              </label>
              <br />
              <label>
                <input type="checkbox" id="wd-student-annotation" /> Student Annotation
              </label>
              <br />
              <label>
                <input type="checkbox" id="wd-file-upload" /> File Uploads
              </label>
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-assign-to">Assign To</label>
            </td>
            <td>
              <input id="wd-assign-to" defaultValue="Everyone" />
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input type="date" id="wd-due-date" defaultValue="2025-01-22" />
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input type="date" id="wd-available-from" defaultValue="2025-01-15" />
            </td>
          </tr>

          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-until">Until</label>
            </td>
            <td>
              <input type="date" id="wd-available-until" defaultValue="2025-02-15" />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <button type="button" style={{ marginRight: "8px" }}>Cancel</button>
      <button type="button">Save</button>
    </div>
  );
}