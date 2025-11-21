"use client";
import * as client from "../client";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import Link from "next/link";

interface Credentials {
  username: string;
  password: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: ""
  });
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    router.push("/Dashboard"); 
  };

  return (
    <div
      id="wd-signin-screen"
      className="d-flex justify-content-center align-items-start vh-100"
    >
      <div className="w-100" style={{ maxWidth: "350px", marginTop: "100px" }}>
        <h1 className="text-center mb-4">Sign in</h1>
        <FormControl
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && signin()}
          id="wd-username"
          placeholder="username"
          className="mb-2"
        />
        <FormControl
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && signin()}
          id="wd-password"
          placeholder="password"
          type="password"
          className="mb-3"
        />
        <Button 
          onClick={signin} 
          id="wd-signin-btn" 
          className="btn btn-primary w-100 mb-2"
        >
          Sign in
        </Button>
        <div className="text-center">
          <Link id="wd-signup-link" href="/Account/Signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
