
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!currentUser) {
        router.push("/Account/Signin");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  // Show loading state briefly while checking auth
  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}