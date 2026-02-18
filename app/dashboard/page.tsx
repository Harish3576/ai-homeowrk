"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/history");
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {data.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <strong>Question:</strong> {item.question}
              <br />
              <strong>Answer:</strong> {item.answer}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
