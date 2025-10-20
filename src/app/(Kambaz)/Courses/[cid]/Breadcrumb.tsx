"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
  const pathname = usePathname();
  
 
  const pathSegments = pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1];
  
 
  const displaySection = pathname.includes("/People") ? "People" : currentSection;
  
  return (
    <h2 className="text-danger">
      <span>≡ {course?.name} &gt; {displaySection}</span>
    </h2>
  );
}