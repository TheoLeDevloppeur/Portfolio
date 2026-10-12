import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(profile.lastUpdated) }];
}
