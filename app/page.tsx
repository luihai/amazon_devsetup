import { BookOpen, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const niches = [
    {
      title: "Science Fiction for Data Scientists",
      description: "Explore the intersection of logic, AI, and futuristic worlds.",
      slug: "sci-fi-for-data-scientists",
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Philosophy for Python Developers",
      description: "Deep thinking that aligns with the Pythonic mindset of simplicity.",
      slug: "philosophy-for-python-devs",
      icon: <BookOpen className="w-6 h-6 text-amber-700" />,
    },
    {
      title: "History of Mathematics for Coders",
      description: "Understand the origins of the algorithms you use every day.",
      slug: "history-of-math-for-coders",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: "Biographies of Tech Pioneers",
      description: "Learn from the lives that built the digital age.",
      slug: "tech-pioneer-biographies",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Cyberpunk Classics",
      description: "The roots of the virtual worlds we are building today.",
      slug: "cyberpunk-classics",
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
    },
    {
      title: "Stoicism for startup founders",
      description: "Mental models for enduring the highs and lows of building.",
      slug: "stoicism-for-founders",
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      {/* Navbar */}
      <nav className="border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-stone-800" />
            <span className="font-serif text-xl font-bold tracking-tight">BibliophileAI</span>
          </div>
          <div className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
            About
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-stone-100 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold tracking-wide uppercase text-stone-500">Curated by Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-tight">
            Discover your next <br className="hidden md:block"/>
            <span className="italic text-stone-600">obsession.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Hyper-specific book recommendations for the intellectually curious. 
            Curated daily by AI to help you find hidden gems in topics you care about.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-stone-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/10">
              Browse Collections
            </button>
            <button className="bg-white text-stone-900 border border-stone-200 px-8 py-3.5 rounded-full font-medium hover:bg-stone-50 transition-colors">
              How it works
            </button>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-100/30 to-purple-100/30 rounded-full blur-3xl -z-10" />
      </section>

      {/* Trending Niches Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Trending Niches</h2>
            <p className="text-stone-500">Collections gaining popularity this week</p>
          </div>
          <Link href="/all" className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche) => (
            <Link 
              key={niche.slug} 
              href={`/niche/${niche.slug}`}
              className="group bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all duration-300 flex flex-col h-full"
            >
              <div className="mb-4 bg-stone-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {niche.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                {niche.title}
              </h3>
              <p className="text-stone-500 leading-relaxed mb-6 flex-grow">
                {niche.description}
              </p>
              <div className="flex items-center text-sm font-medium text-amber-700 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Explore List <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/all" className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            View all collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-400" />
            <span className="font-serif font-bold text-lg text-stone-600">BibliophileAI</span>
          </div>
          <div className="text-sm text-stone-400">
            © {new Date().getFullYear()} BibliophileAI. Automated Curation.
          </div>
        </div>
      </footer>
    </div>
  );
}
