
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";

interface UserProfile {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  useEffect(() => {
    if (!currentUser) {
      router.push("/Account/Signin");
    } else {
      setProfile(currentUser);
    }
  }, [currentUser, router]);
  
  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };
  
  if (!profile) {
    return null; // or a loading spinner
  }
  
  return (
    <div className="d-flex justify-content-center w-100">
      <div id="wd-profile-screen" className="p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h1>Profile</h1>
        <FormControl
          id="wd-username"
          value={profile.username}
          placeholder="username"
          className="mb-2"
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
        <FormControl
          id="wd-password"
          placeholder="password"
          type="password"
          className="mb-2"
          value={profile.password}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />
        <FormControl
          id="wd-firstname"
          value={profile.firstName}
          placeholder="First Name"
          className="mb-2"
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />
        <FormControl
          id="wd-lastname"
          value={profile.lastName}
          placeholder="Last Name"
          className="mb-2"
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />
        <FormControl
          id="wd-dob"
          value={profile.dob}
          type="date"
          className="mb-2"
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
        />
        <FormControl
          id="wd-email"
          value={profile.email}
          type="email"
          placeholder="Email"
          className="mb-2"
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <FormControl
          as="select"
          value={profile.role}
          className="mb-3"
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
          <option value="TA">Teaching Assistant</option>
        </FormControl>
        <Button
          id="wd-signout-btn"
          onClick={signout}
          variant="danger"
          className="w-100"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}