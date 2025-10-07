import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Profile() {
  return (
    <div className="d-flex justify-content-center w-100">
      <div id="wd-profile-screen" className="p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h1>Profile</h1>
        <FormControl
          id="wd-username"
          defaultValue="alice"
          placeholder="username"
          className="mb-2"
        />
        <FormControl
          id="wd-password"
          placeholder="password"
          type="password"
          className="mb-2"
        />
        <FormControl
          id="wd-firstname"
          defaultValue="Alice"
          placeholder="First Name"
          className="mb-2"
        />
        <FormControl
          id="wd-lastname"
          defaultValue="Wonderland"
          placeholder="Last Name"
          className="mb-2"
        />
        <FormControl
          id="wd-dob"
          defaultValue="2000-01-03"
          type="date"
          className="mb-2"
        />
        <FormControl
          id="wd-email"
          defaultValue="alice@wonderland.com"
          type="email"
          placeholder="Email"
          className="mb-2"
        />
        <FormControl defaultValue="user" className="mb-3" />
        <Link
          id="wd-signout-btn"
          href="/Account/Signin"
          className="btn btn-danger w-100"
        >
          Signout
        </Link>
      </div>
    </div>
  );
}