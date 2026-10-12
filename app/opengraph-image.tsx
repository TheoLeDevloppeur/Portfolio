import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.firstName} ${profile.lastName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Aperçu de partage (Open Graph / Twitter), généré au build. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0B0E0C",
          padding: 56,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "2px solid #28352C",
            borderRadius: 20,
            background: "#111713",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px", borderBottom: "2px solid #28352C" }}>
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#FF6B5E" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#F5C451" }} />
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#A6FF8F" }} />
            <div style={{ marginLeft: 20, color: "#E8F1E8", fontSize: 22, letterSpacing: 4 }}>THEO@PORTFOLIO</div>
            <div style={{ marginLeft: "auto", color: "#A6FF8F", fontSize: 20, letterSpacing: 3 }}>● SYSTEM ONLINE</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "44px 48px", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 28, color: "#89978D" }}>
              <span style={{ color: "#A6FF8F" }}>théo@portfolio</span>:~$ whoami
            </div>
            <div style={{ fontSize: 84, color: "#E8F1E8", fontWeight: 700, letterSpacing: -1 }}>{profile.displayName}</div>
            <div style={{ fontSize: 32, color: "#A6FF8F", letterSpacing: 8 }}>{profile.role}</div>
            <div style={{ fontSize: 28, color: "#89978D" }}>{profile.tagline}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
