import { MetadataRoute } from "next";
import content from "@/app/data/content.json";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://bibliophile-ai.vercel.app"; // Keeping original Vercel URL for now as safely requested, but could be devsetup.ai

    // Static routes
    const routes = [
        "",
        "/all",
        "/create",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
    }));

    // Dynamic niche routes
    const nicheRoutes = content.niches.map((niche) => ({
        url: `${baseUrl}/niche/${niche.slug}`,
        lastModified: new Date(content.last_updated),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...routes, ...nicheRoutes];
}
