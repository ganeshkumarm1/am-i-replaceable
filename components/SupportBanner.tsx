export default function SupportBanner() {
  return (
    <a
      href="https://chai4.me/ganeshkumarm1"
      target="_blank"
      rel="noopener noreferrer"
      title="Support ganeshkumarm1 on Chai4Me"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        padding: "11px 16px", borderRadius: "10px",
        backgroundColor: "#1a1a1a", border: "1px solid #333",
        textDecoration: "none",
        boxShadow: "0 0 0 1px rgba(224,48,48,0.2)",
        transition: "transform 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      <span style={{ color: "#777", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>
        Support me through
      </span>
      <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "2px 6px", display: "flex", alignItems: "center" }}>
        <img
          src="https://chai4.me/icons/wordmark.png"
          alt="Chai4Me"
          style={{ height: "18px", objectFit: "contain" }}
        />
      </div>
    </a>
  );
}
