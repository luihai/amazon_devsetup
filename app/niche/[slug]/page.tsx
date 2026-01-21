import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, ShoppingBag, Calendar } from "lucide-react";
import content from "@/app/data/content.json";

// Define the type for our data
type Product = {
    title: string;
    brand: string;
    category: string;
    description: string;
    image_url: string;
    amazon_link: string;
};

type Niche = {
    slug: string;
    title: string;
    description: string;
    products: Product[];
};

// This function is required for static site generation (SSG) with dynamic routes
export async function generateStaticParams() {
    return content.niches.map((niche) => ({
        slug: niche.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const niche = content.niches.find((n) => n.slug === slug);

    if (!niche) {
        return {
            title: "Setup Not Found",
            description: "The requested setup could not be found.",
        };
    }

    return {
        title: niche.title,
        description: `Top gear recommendations for ${niche.title}. ${niche.description}`,
        openGraph: {
            title: `${niche.title} | DevSetup.AI`,
            description: niche.description,
            type: "article",
            images: niche.products[0]?.image_url ? [{ url: niche.products[0].image_url }] : [],
        },
    };
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Find the niche matching the slug
    const niche = content.niches.find((n) => n.slug === slug);

    if (!niche) {
        notFound();
    }

    // Generate JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": niche.products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.title,
                "description": product.description,
                "image": product.image_url,
                "brand": {
                    "@type": "Brand",
                    "name": product.brand || "Generic"
                },
                "offers": {
                    "@type": "Offer",
                    "url": product.amazon_link,
                    "availability": "https://schema.org/InStock"
                }
            }
        }))
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-indigo-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Navbar */}
            <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Setups</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-indigo-400" />
                        <span className="font-bold text-lg text-white">DevSetup.AI</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-neutral-700">
                        <Calendar className="w-3 h-3" />
                        Updated {new Date(content.last_updated).toLocaleDateString()}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        {niche.title}
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        {niche.description}
                    </p>
                </header>

                {/* Product List */}
                <div className="space-y-8">
                    {niche.products.map((product, index) => (
                        <div key={index} className="bg-neutral-800/50 p-6 md:p-8 rounded-2xl border border-neutral-800 hover:border-neutral-700 flex flex-col md:flex-row gap-8 items-start hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                            {/* Product Image */}
                            <div className="w-full md:w-56 flex-shrink-0 bg-white rounded-xl aspect-square overflow-hidden relative shadow-lg p-4 flex items-center justify-center">
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>

                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                        {product.category}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-700/50 px-2 py-1 rounded">
                                        {product.brand}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                    {product.title}
                                </h2>
                                <div className="prose prose-invert prose-neutral leading-relaxed text-neutral-400 mb-8 max-w-none">
                                    <p>{product.description}</p>
                                </div>

                                <a
                                    href={product.amazon_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 w-full md:w-auto justify-center"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Check Price on Amazon
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-12 px-6 bg-neutral-900 mt-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} DevSetup.AI.
                        <p className="mt-2 text-xs">
                            Disclosure: As an Amazon Associate, we earn from qualifying purchases. This helps support the project.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
