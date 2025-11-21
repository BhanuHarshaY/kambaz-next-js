/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useState } from "react";
import { Container, FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { redirect } from "next/navigation";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    redirect("/Account/Profile");
  };

  return (
    <Container id="wd-signup-screen" style={{ width: "300px" }}>
      <h3>Signup</h3>
      <FormControl
        id="wd-username"
        placeholder="username"
        className="mb-2"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Link
        href="Profile"
        className="btn btn-primary w-100 mb-2"
        onClick={signup}
        id="wd-signup-btn"
      >
        Signup
      </Link>
      <Link href="Signin">Signin</Link>
    </Container>
  );
}