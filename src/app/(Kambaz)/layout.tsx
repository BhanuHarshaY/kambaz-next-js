
"use client";

import { ReactNode, useState } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function KambazLayout({ children }: { children: ReactNode }) {
  const [showKambazNav] = useState(true);
  const pathname = usePathname();
  
  // Check if it's an Account route (Signin, Signup, Profile)
  const isAccountRoute = pathname?.startsWith("/Account");
  
  // Only Signin and Signup are unprotected
  const isUnprotectedRoute = pathname?.startsWith("/Account/Signin") || 
                            pathname?.startsWith("/Account/Signup");

  return (
    <Provider store={store}>
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
    </Provider>
  );
}