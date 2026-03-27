"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import type { AnalyzeResponse } from "@/lib/types";
import SupportBanner from "@/components/SupportBanner";

interface ResultCardProps {
  data: AnalyzeResponse;
  situation: string;
}

const RISK_COLORS: Record<string, { accent: string; bg: string }> = {
  "Already Replaced":        { accent: "#e03030", bg: "#180808" },
  "Living on Borrowed Time": { accent: "#d4600a", bg: "#180c04" },
  "Partially Automatable":   { accent: "#c8a000", bg: "#161200" },
  "Human Still Needed":      { accent: "#1a9e50", bg: "#041408" },
  "AI-Proof for Now":        { accent: "#2060e0", bg: "#040c1a" },
  "Uniquely Human":          { accent: "#8020d0", bg: "#0e0418" },
};

function buildTwitterUrl(data: AnalyzeResponse): string {
  const text = `I'm "${data.risk_label}" — AI replaces me in ${data.months_until_replaced} months, saving $${data.annual_savings.toLocaleString()}/yr. Are you next? `;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export default function ResultCard({ data, situation }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const c = RISK_COLORS[data.risk_label] ?? RISK_COLORS["Partially Automatable"];

  async function handleDownload() {
    if (!cardRef.current) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: c.bg,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "how-replaceable-am-i.png";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Card — captured as-is, no width manipulation */}
      <div
        ref={cardRef}
        style={{
          backgroundColor: c.bg,
          border: `1.5px solid ${c.accent}44`,
          borderRadius: "16px",
          padding: "36px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <p style={{ color: c.accent, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
          AI Replaceability Report
        </p>

        {/* Score stacked vertically — no overlap */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "80px", fontWeight: 900, lineHeight: 1, color: c.accent }}>
            {data.months_until_replaced}
          </div>
          <div style={{ fontSize: "16px", color: "#666", fontWeight: 500, marginTop: "4px" }}>
            months left
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: "999px",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
            color: c.accent, backgroundColor: `${c.accent}20`, border: `1px solid ${c.accent}55`,
          }}>
            {data.risk_label}
          </span>
        </div>

        <div style={{ backgroundColor: "#ffffff08", border: "1px solid #ffffff10", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
          <p style={{ color: "#555", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
            Based on
          </p>
          <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.5, margin: 0, overflow: "hidden", maxHeight: "3em" }}>
            {situation}
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
            Estimated AI replacement cost savings
          </p>
          <p style={{ color: "#f0f0f0", fontSize: "24px", fontWeight: 700, margin: 0 }}>
            ${data.annual_savings.toLocaleString()}
            <span style={{ fontSize: "14px", color: "#555", fontWeight: 400 }}>/yr</span>
          </p>
        </div>

        <div style={{ height: "1px", backgroundColor: "#ffffff0f", marginBottom: "20px" }} />

        <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>
          {data.explanation}
        </p>

        <div style={{ backgroundColor: `${c.accent}12`, border: `1px solid ${c.accent}33`, borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
          <span style={{ color: c.accent, fontWeight: 600, fontSize: "13px" }}>Replaced by: </span>
          <span style={{ color: "#aaa", fontSize: "13px" }}>{data.what_ai_would_do}</span>
        </div>

        <p style={{ color: "#444", fontSize: "12px", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
          {data.share_message}
        </p>
      </div>

      {/* Share section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={handleDownload}
          disabled={capturing}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", padding: "14px", borderRadius: "12px", fontWeight: 700, color: "#fff",
            fontSize: "14px", border: "none", cursor: capturing ? "not-allowed" : "pointer",
            opacity: capturing ? 0.6 : 1, backgroundColor: "#e03030",
            boxShadow: "0 0 20px rgba(224,48,48,0.35)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {capturing ? "Saving..." : "Save Image to Share"}
        </button>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#444", margin: "0" }}>
          Save the image, then post it on your platform of choice
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <a href={buildTwitterUrl(data)} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "10px 8px", borderRadius: "10px", textDecoration: "none", backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#888", fontSize: "11px", fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#888"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post on X
          </a>
          <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "10px 8px", borderRadius: "10px", textDecoration: "none", backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#888", fontSize: "11px", fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#888"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Post on LinkedIn
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "10px 8px", borderRadius: "10px", textDecoration: "none", backgroundColor: "#161616", border: "1px solid #2a2a2a", color: "#888", fontSize: "11px", fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#888"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Post on Instagram
          </a>
        </div>

        <SupportBanner />
      </div>
    </div>
  );
}
