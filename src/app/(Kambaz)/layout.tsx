"use client";

import { ReactNode, useState } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";

export default function KambazLayout({ children }: { children: ReactNode }) {
  const [showKambazNav] = useState(true);

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
        {children}
      </div>
    </div>
  );
}