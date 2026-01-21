import { Monitor, Keyboard, Headphones, Coffee, Zap, ArrowRight, Laptop } from "lucide-react";
import Link from "next/link";
import content from "@/app/data/content.json";

export default function Home() {
  // Map icons to slugs manually since icons are components
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
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-xl tracking-tight text-white">DevSetup.AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer">
              How it works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-neutral-800 px-4 py-1.5 rounded-full shadow-inner border border-neutral-700 mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold tracking-wide uppercase text-neutral-400">High Performance Workspaces</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Build your dream <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">code station.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Curated desk setups for software engineers.
            Stop buying cheap gear. Invest in tools that maximize your flow state.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#setups"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Browse Setups
            </Link>
            <Link
              href="/create"
              className="bg-neutral-800 text-white border border-neutral-700 px-8 py-3.5 rounded-full font-bold hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Create your own
            </Link>
          </div>
        </div>

        {/* Abstract Background Elemets */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Setups Grid */}
      <section id="setups" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Curated Setups</h2>
            <p className="text-neutral-500">Optimized for different coding styles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {content.niches.map((niche) => (
            <Link
              key={niche.slug}
              href={`/niche/${niche.slug}`}
              className="group bg-neutral-800/50 p-8 rounded-2xl border border-neutral-800 hover:border-neutral-600 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-neutral-900 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-neutral-800 text-indigo-400 shadow-lg">
                  {iconMap[niche.slug] || <Monitor className="w-6 h-6" />}
                </div>
                <div className="p-2 bg-neutral-900 rounded-full border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                {niche.title}
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-6 flex-grow">
                {niche.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 flex-grow bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4"></div>
                </div>
                <span className="text-xs font-mono text-neutral-500">5 Items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 mb-8 border border-neutral-800">
            <Coffee className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Code Better. Live Healthy.
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The average developer spends 2,000+ hours a year at their desk. Bad ergonomics lead to RSI and burnout. We curate gear that keeps you shipping code for the long haul.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-indigo-400 font-bold text-xl mb-3">01. Ergonomics</div>
              <p className="text-neutral-500">We prioritize chairs, mice, and keyboards that prevent strain.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-indigo-400 font-bold text-xl mb-3">02. Focus</div>
              <p className="text-neutral-500">Active noise cancelling and bias lighting to maintain flow state.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-indigo-400 font-bold text-xl mb-3">03. Aesthetics</div>
              <p className="text-neutral-500">Because if you love your desk, you'll love your work.</p>
            </div>
          </div>
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
