
import Link from "next/link";
import { ArrowLeft, Monitor, Keyboard, Headphones, Laptop, Coffee, Zap } from "lucide-react";
import content from "@/app/data/content.json";

export default function AllNichesPage() {
    // Manually map icons for the list view
    const iconMap: Record<string, React.ReactNode> = {
        "minimalist-coder": <Keyboard className="w-6 h-6 text-indigo-400" />,
        "data-station": <Monitor className="w-6 h-6 text-indigo-400" />,
        "deep-work-chamber": <Headphones className="w-6 h-6 text-indigo-400" />,
        "nomad-kit": <Laptop className="w-6 h-6 text-indigo-400" />,
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

            {/* Header */}
            <section className="pt-16 pb-12 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    All Workspaces
                </h1>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                    Browse our complete catalog of high-performance desk setups.
                </p>
            </section>

            {/* Grid */}
            <section className="pb-20 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.niches.map((niche) => (
                        <Link
                            key={niche.slug}
                            href={`/niche/${niche.slug}`}
                            className="group bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col h-full hover:shadow-xl hover:shadow-indigo-500/5"
                        >
                            <div className="mb-4 bg-neutral-900 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-neutral-800 shadow-sm text-indigo-400">
                                {iconMap[niche.slug] || <Zap className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {niche.title}
                            </h3>
                            <p className="text-neutral-400 leading-relaxed mb-6 flex-grow">
                                {niche.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-12 px-6 bg-neutral-900">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-lg text-white">DevSetup.AI</span>
                    </div>
                    <div className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} DevSetup.AI.
                    </div>
                </div>
            </footer>
        </div>
    );
}
