import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShoppingBag, Calendar } from "lucide-react";
import content from "@/app/data/content.json";

// Define the type for our data
type Book = {
    title: string;
    author: string;
    description: string;
    image_url: string;
    amazon_link: string;
};

type Niche = {
    slug: string;
    title: string;
    description: string;
    books: Book[];
};

// This function is required for static site generation (SSG) with dynamic routes
export async function generateStaticParams() {
    return content.niches.map((niche) => ({
        slug: niche.slug,
    }));
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Find the niche matching the slug
    const niche = content.niches.find((n) => n.slug === slug);

    if (!niche) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100">
            {/* Navbar */}
            <nav className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-stone-600 hover:text-stone-900 transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-stone-400" />
                        <span className="font-serif font-bold text-lg text-stone-800">BibliophileAI</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-amber-100">
                        <Calendar className="w-3 h-3" />
                        Updated {new Date(content.last_updated).toLocaleDateString()}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
                        {niche.title}
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        {niche.description}
                    </p>
                </header>

                {/* Book List */}
                <div className="space-y-12">
                    {niche.books.map((book, index) => (
                        <div key={index} className="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
                            {/* Fake Book Cover (using raw div if image fails, but using img tag for now) */}
                            <div className="w-full md:w-48 flex-shrink-0 bg-stone-200 rounded-lg aspect-[2/3] overflow-hidden relative shadow-inner">
                                {/* Check if image URL is valid in a real app, here we use the mock URL */}
                                <img
                                    src={book.image_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-grow">
                                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                                    {index + 1}. {book.title}
                                </h2>
                                <div className="text-amber-700 font-medium mb-4">
                                    by {book.author}
                                </div>
                                <div className="prose prose-stone leading-relaxed text-stone-600 mb-6">
                                    <p>{book.description}</p>
                                </div>

                                <a
                                    href={book.amazon_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/10 w-full md:w-auto justification-center"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Buy on Amazon
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-stone-200 py-12 px-6 bg-white mt-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-sm text-stone-400">
                        © {new Date().getFullYear()} BibliophileAI.
                        <p className="mt-2 text-xs">
                            Disclosure: As an Amazon Associate, we earn from qualifying purchases.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
