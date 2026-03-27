"use client";

import { useEffect, useState } from "react";

export const LOADING_MESSAGES = [
  "Scanning your job description...",
  "Consulting the AI overlords...",
  "Calculating your expiry date...",
  "Checking automation feasibility...",
  "Running cost-benefit analysis...",
  "Preparing your pink slip...",
] as const;

export default function LoadingSection() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", gap: "24px" }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "50%",
        border: "3px solid #2a2a2a", borderTopColor: "#e03030",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#666", textAlign: "center", transition: "opacity 0.3s", opacity: visible ? 1 : 0 }}>
        {LOADING_MESSAGES[index]}
      </p>
    </div>
  );
}
