"use client";
import { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    setStartDate(new Date());
  }, []); // Runs once on the client after hydration

  const dateObjectToHtmlDateString = (date: Date) => {
    // Helper to format date as "YYYY-MM-DD"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 1. Get the string value OR an empty string if null
  // This ensures `value` is always a defined string.
  const currentDateString = startDate ? dateObjectToHtmlDateString(startDate) : "";

  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>

      {/* Conditionally render content based on startDate */}
      <h3>{startDate ? JSON.stringify(startDate) : "Loading..."}</h3>
      <h3>{startDate ? currentDateString : "Loading..."}</h3>

      {/* 2. Make the component fully controlled.
           - `value` is always set to `currentDateString` (either a date or "").
           - `disabled` is true while loading.
      */}
      <FormControl
        type="date"
        value={currentDateString}
        disabled={!startDate}
        onChange={(e) => {
          // Parse the date as local time to avoid timezone bugs
          const [year, month, day] = e.target.value.split("-").map(Number);
          const localDate = new Date(year, month - 1, day);
          setStartDate(localDate);
        }}
      />
      <hr />
    </div>
  );
}