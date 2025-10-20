import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signin() {
  return (
    <div
      id="wd-signin-screen"
      className="d-flex justify-content-center align-items-start vh-100"
    >
      <div className="w-100" style={{ maxWidth: "350px", marginTop: "100px" }}>
        <h1 className="text-center mb-4">Sign in</h1>
        <FormControl
          id="wd-username"
          placeholder="username"
          className="mb-2"
          
        />
        <FormControl
          id="wd-password"
          placeholder="password"
          type="password"
          className="mb-3"
          
        />
        <Link
          id="wd-signin-btn"
          href="/Dashboard"
          className="btn btn-primary w-100 mb-2"
        >
          Sign in
        </Link>
        <div className="text-center">
          <Link id="wd-signup-link" href="/Account/Signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}