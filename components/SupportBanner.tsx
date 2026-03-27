import React from "react";

const baseStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
  padding: "11px 16px", borderRadius: "10px",
  textDecoration: "none",
  transition: "transform 0.15s",
  flex: 1,
};

const supportStyle: React.CSSProperties = {
  ...baseStyle,
  backgroundColor: "#1f1500",
  border: "1px solid #7a4a00",
  boxShadow: "0 0 0 1px rgba(200,120,0,0.15)",
};

const githubStyle: React.CSSProperties = {
  ...baseStyle,
  backgroundColor: "#111",
  border: "1px solid #2a2a2a",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
};

export default function SupportBanner() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <a
        href="https://chai4.me/ganeshkumarm1"
        target="_blank"
        rel="noopener noreferrer"
        title="Support ganeshkumarm1 on Chai4Me"
        style={supportStyle}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ color: "#c87800", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>
          Support me
        </span>
        <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "2px 6px", display: "flex", alignItems: "center" }}>
          <img
            src="https://chai4.me/icons/wordmark.png"
            alt="Chai4Me"
            style={{ height: "18px", objectFit: "contain" }}
          />
        </div>
      </a>

      <a
        href="https://github.com/ganeshkumarm1/am-i-replaceable"
        target="_blank"
        rel="noopener noreferrer"
        title="View source on GitHub"
        style={githubStyle}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg height="16" width="16" viewBox="0 0 16 16" fill="#aaa">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span style={{ color: "#aaa", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>
          View on GitHub
        </span>
      </a>
    </div>
  );
}
