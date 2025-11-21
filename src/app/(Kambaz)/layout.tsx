"use client";

import { ReactNode, useState, useEffect } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePathname } from "next/navigation";
import Session from "./Account/Session";
import { setCourses } from "./Courses/reducer";
import * as courseClient from "./Courses/client";

function KambazContent({ children }: { children: ReactNode }) {
  const [showKambazNav] = useState(true);
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  
  // Load courses once at app level when user is authenticated
  useEffect(() => {
    const fetchCourses = async () => {
      if (courses.length === 0 && currentUser) {
        try {
          const fetchedCourses = await courseClient.fetchAllCourses();
          dispatch(setCourses(fetchedCourses));
        } catch (error) {
          console.error("Error fetching courses at app level:", error);
        }
      }
    };
    fetchCourses();
  }, [currentUser, courses.length, dispatch]);
  
  // Check if it's an Account route (Signin, Signup, Profile)
  const isAccountRoute = pathname?.startsWith("/Account");
  
  // Only Signin and Signup are unprotected
  const isUnprotectedRoute = pathname?.startsWith("/Account/Signin") || 
                            pathname?.startsWith("/Account/Signup");

  return (
    <div id="wd-kambaz" className="position-relative">
      {showKambazNav && (
        <div className="d-none d-md-block">
          <KambazNavigation />
        </div>
      )}

      <div 
        className="wd-main-content-offset flex-fill"
        style={{ 
          marginLeft: showKambazNav ? "110px" : "0",
          transition: "margin-left 0.3s ease"
        }}
      >
        {isUnprotectedRoute ? (
          // Signin and Signup pages don't need protection
          children
        ) : (
          // All other routes need authentication
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        )}
      </div>
    </div>
  );
}

export default function KambazLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Session>
        <KambazContent>{children}</KambazContent>
      </Session>
    </Provider>
  );
}