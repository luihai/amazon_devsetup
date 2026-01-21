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
                        title: "Demo Book 1",
                        author: "Demo Author",
                        description: "OpenAI Key missing. Please add it to Vercel env variables.",
                        image_url: "https://placehold.co/400x600/e2e8f0/475569?text=Demo+Book",
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
                    content: "You are an expert literary curator. You recommend hidden gems, not just bestsellers."
                },
                {
                    role: "user",
                    content: `Recommend 6 specific, high-quality books for the niche topic: "${topic}".
          
          For each book, provide:
          - Title
          - Author
          - A convincing 2-sentence reason for this specific audience.
          
          Return ONLY valid JSON in this format:
          {
            "books": [
              {
                "title": "Title",
                "author": "Author",
                "description": "Reason"
              }
            ]
          }`
                }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        const books = result.books || [];

        // Enhance with real covers
        const enhancedBooks = await Promise.all(books.map(async (book: any) => {
            const image_url = await fetchBookCover(book.title, book.author);
            // Ensure https
            const secure_image_url = image_url?.replace("http://", "https://") || "https://placehold.co/400x600/e2e8f0/475569?text=No+Cover";

            return {
                ...book,
                image_url: secure_image_url,
                amazon_link: `https://amazon.com/s?k=${encodeURIComponent(book.title + " " + book.author)}&tag=${process.env.AMAZON_TAG || "busybibliophi-20"}`
            };
        }));

        return NextResponse.json({ books: enhancedBooks });

    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: "Failed to generate collection" }, { status: 500 });
    }
}
