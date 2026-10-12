import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} — ${profile.firstName} ${profile.lastName}`,
    short_name: siteName,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0E0C",
    theme_color: "#0B0E0C",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
