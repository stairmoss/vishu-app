"use client";

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: "#0e0703",
        borderTop: "1px solid rgba(200,169,110,0.15)",
        padding: "1.4rem 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "rgba(200,169,110,0.55)",
          fontFamily: "Georgia, serif",
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        <span>Made by Adarsh A</span>
        <span style={{ color: "rgba(200,169,110,0.2)" }}>|</span>
        <a
          href="https://www.instagram.com/_.adarsheyy_"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Instagram
        </a>
        <span style={{ color: "rgba(200,169,110,0.2)" }}>|</span>
        <a
          href="https://www.github.com/stairmoss/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </p>

      <style>{`
        .footer-link {
          color: #c8a96e;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #FFD700;
        }
      `}</style>
    </footer>
  );
}
