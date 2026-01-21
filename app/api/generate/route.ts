import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export const maxDuration = 30; // Allow 30 seconds for generation

const getOpenClient = () => {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
    });
};

async function fetchBookCover(title: string, author: string) {
    try {
        const query = encodeURIComponent(`intitle:${title}+inauthor:${author}`);
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY || ""}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const info = data.items[0].volumeInfo;
            if (info.imageLinks) {
                let imageUrl =
                    info.imageLinks.extraLarge ||
                    info.imageLinks.large ||
                    info.imageLinks.medium ||
                    info.imageLinks.thumbnail ||
                    info.imageLinks.smallThumbnail;

                if (imageUrl) {
                    // Try to force higher resolution
                    imageUrl = imageUrl.replace('&zoom=1', '&zoom=2').replace('&edge=curl', '');
                    return imageUrl;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching cover:", error);
    }
    return "https://placehold.co/400x600/e2e8f0/475569?text=No+Cover";
}

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            // Fallback for demo if no key
            return NextResponse.json({
                books: [
                    {
                        title: "ErgoChair Pro",
                        author: "Autonomous", // Mapping Brand to Author for compatibility
                        description: "Demo mode: API Key missing. Please add OPENAI_API_KEY env var.",
                        image_url: "https://placehold.co/600x400/171717/FFF?text=Demo+Chair",
                        amazon_link: "#"
                    }
                ]
            });
        }

        const openai = getOpenClient();
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert workspace curator. You recommend high-quality developer tools, furniture, and electronics."
                },
                {
                    role: "user",
                    content: `Recommend 5 specific, high-quality tech products for the desk setup niche: "${topic}".
          
          For each product, provide:
          - Title (Impactful product name)
          - Brand (Manufacturer)
          - Description (2 sentences on why it fits this specific niche)
          
          Return ONLY valid JSON in this format:
          {
            "products": [
              {
                "title": "Product Name",
                "brand": "Brand Name",
                "description": "Reasoning..."
              }
            ]
          }`
                }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        const products = result.products || [];

        // Enhance with placeholders and affiliate links
        const enhancedProducts = products.map((item: any) => {
            const safeTitle = encodeURIComponent(item.title);
            return {
                title: item.title,
                author: item.brand, // Mapping 'brand' to 'author' for frontend compatibility
                brand: item.brand,
                description: item.description,
                image_url: `https://placehold.co/600x400/171717/FFF?text=${safeTitle}`,
                amazon_link: `https://amazon.com/s?k=${encodeURIComponent(item.brand + " " + item.title)}&tag=${process.env.AMAZON_TAG || "busybibliophi-20"}`
            };
        });

        // Return 'books' key because frontend expects it currently
        return NextResponse.json({ books: enhancedProducts });

    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: "Failed to generate collection" }, { status: 500 });
    }
}
