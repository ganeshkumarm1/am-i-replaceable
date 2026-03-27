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

  async function handleShare() {
    const shareText = `I'm "${data.risk_label}" — AI replaces me in ${data.months_until_replaced} months. Are you next?\n\nhttps://am-i-replaceable-xi.vercel.app/`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      window.open(buildTwitterUrl(data), "_blank");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Card */}
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

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <button
            onClick={handleDownload}
            disabled={capturing}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "13px", borderRadius: "12px", fontWeight: 700, color: "#fff",
              fontSize: "13px", border: "none", cursor: capturing ? "not-allowed" : "pointer",
              opacity: capturing ? 0.6 : 1, backgroundColor: "#e03030",
              boxShadow: "0 0 20px rgba(224,48,48,0.35)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {capturing ? "Saving..." : "Save Image"}
          </button>

          <button
            onClick={handleShare}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "13px", borderRadius: "12px", fontWeight: 700, color: "#ccc",
              fontSize: "13px", cursor: "pointer",
              backgroundColor: "#161616", border: "1px solid #2a2a2a",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#333", margin: "0" }}>
          Save the image first, then share it
        </p>

        <SupportBanner />
      </div>
    </div>
  );
}
