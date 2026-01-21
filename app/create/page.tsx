"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Zap, Wand2, Loader2, CheckCircle, ShoppingBag } from "lucide-react";

export default function CreateCollectionPage() {
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isDone, setIsDone] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;

        setIsGenerating(true);
        setProducts([]);

        try {
            // Note: The backend /api/generate endpoint will also need updating to return products,
            // but for now we are just pivoting the frontend.
            // In a real scenario, we'd update the prompt in the backend too.
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            const data = await res.json();
            // Assuming the backend returns 'books' currently, we map it to products or the backend needs update.
            // For chaos engineering safety: let's assume it returns { books: [] } and we map it.
            // Ideally we should update the backend too, but let's stick to the frontend pivot request first.
            if (data.books) {
                setProducts(data.books); // The data structure might be slightly wrong (author vs brand) but it won't crash.
                setIsDone(true);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Monitor className="w-6 h-6 text-indigo-500" />
                        <span className="font-bold text-xl tracking-tight text-white">DevSetup.AI</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20">
                {!isDone ? (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-800 mb-8 animate-pulse border border-neutral-700">
                            <Wand2 className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-6">
                            Design Your Custom Setup
                        </h1>
                        <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                            Describe your profession, aesthetic, or budget. Our AI will curate the perfect desk setup for you.
                        </p>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. 'Frontend Dev under $1000', 'RGB Gaming Station'..."
                                    className="w-full px-6 py-4 text-lg bg-neutral-800 border border-neutral-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all placeholder:text-neutral-600"
                                    disabled={isGenerating}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating || !topic}
                                className="w-full bg-indigo-600 text-white text-lg font-bold py-4 rounded-2xl hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Setup...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Generate Setup
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
                            <button onClick={() => setTopic("Minimalist Mac Setup")} className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full hover:border-indigo-500 hover:text-white transition-colors">Try: "Minimalist Mac Setup"</button>
                            <button onClick={() => setTopic("Ultrawide Productivity")} className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full hover:border-indigo-500 hover:text-white transition-colors">Try: "Ultrawide Productivity"</button>
                            <button onClick={() => setTopic("Cozy Late Night Coding")} className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full hover:border-indigo-500 hover:text-white transition-colors">Try: "Cozy Late Night Coding"</button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-8">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Setup Generated!
                            </h2>
                            <p className="text-lg text-neutral-400">
                                Here is a custom configuration for <strong>"{topic}"</strong>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {products.map((product, i) => (
                                <a
                                    key={i}
                                    href={product.amazon_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-neutral-800/50 rounded-xl border border-neutral-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col hover:border-neutral-700"
                                >
                                    <div className="aspect-square bg-white relative overflow-hidden p-6 flex items-center justify-center">
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg text-white mb-1 leading-tight group-hover:text-indigo-400 transition-colors">
                                            {product.title}
                                        </h3>
                                        <div className="text-sm font-medium text-neutral-500 mb-4">{product.author || product.brand}</div>
                                        <p className="text-neutral-400 text-sm leading-relaxed flex-grow">
                                            {product.description}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-neutral-700 text-sm font-bold text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                                            <ShoppingBag className="w-4 h-4 text-indigo-500" />
                                            Check Price
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => { setIsDone(false); setTopic(""); setProducts([]); }}
                                className="bg-neutral-800 text-white px-8 py-3.5 rounded-full font-bold hover:bg-neutral-700 transition-all shadow-lg border border-neutral-700"
                            >
                                Generate another setup
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
