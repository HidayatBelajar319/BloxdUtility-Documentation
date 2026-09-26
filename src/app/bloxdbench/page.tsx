'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ModelEntry {
  name: string;
  url: string;
  type: string;
}

const TEXTURE_PACKS_CONTENTS = 'https://api.github.com/repos/Bloxdy/texture-packs/contents';
const TEXTURE_PACKS_RAW = 'https://raw.githubusercontent.com/Bloxdy/texture-packs/main';

export default function BloxdBenchPage() {
  const [isDark, setIsDark] = useState(false);
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [modelStatus, setModelStatus] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
    document.documentElement.classList.toggle('dark', savedDark);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      try {
        const response = await fetch(TEXTURE_PACKS_CONTENTS, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const entries = (await response.json()) as Array<{ name?: unknown; type?: unknown; download_url?: unknown }>;
        const discovered = entries
          .filter((entry) => typeof entry.name === 'string' && entry.type === 'file' && /\.(glb|gltf|json)$/i.test(entry.name))
          .map((entry) => {
            const name = String(entry.name);
            return {
              name,
              type: name.split('.').pop()?.toUpperCase() ?? 'MODEL',
              url: typeof entry.download_url === 'string' ? entry.download_url : `${TEXTURE_PACKS_RAW}/${encodeURIComponent(name)}`,
            } satisfies ModelEntry;
          });
        if (!cancelled) {
          setModels(discovered);
          setModelStatus('live');
        }
      } catch {
        if (!cancelled) setModelStatus('fallback');
      }
    };

    void loadModels();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    document.documentElement.classList.toggle('dark', newDark);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #1f2328;
          --sidebar-bg: #f6f8fa;
          --border: #d0d7de;
          --nav-hover: #ebeff2;
          --nav-active-bg: #0969da;
          --nav-active-text: #ffffff;
          --primary: #3b82f6;
          --primary-hover: #2563eb;
        }
        .dark {
          --bg: #0d1117;
          --text: #e6edf3;
          --sidebar-bg: #161b22;
          --border: #30363d;
          --nav-hover: #21262d;
          --nav-active-bg: #1f6feb;
          --nav-active-text: #ffffff;
          --primary: #58a6ff;
          --primary-hover: #79c0ff;
        }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <header className="border-b border-[var(--border)] bg-[var(--sidebar-bg)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Players Logo" className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tighter">Players</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/documentation" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Documentation</Link>
              <Link href="/api" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">API Reference</Link>
              <Link href="/guides" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Guides</Link>
              <Link href="/bloxdbench" className="text-sm font-medium text-[var(--primary)] font-semibold">BloxdBench</Link>
              <Link href="/changelog" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Changelog</Link>
              <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Main Website</a>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={toggleDark} className="p-2 rounded-lg bg-[var(--border)] hover:bg-[var(--nav-hover)] transition-colors" aria-label="Toggle dark mode">
                {isDark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Link href="/documentation" className="text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">Documentation</Link>
          <span className="text-sm text-[var(--text)]/40 mx-2">/</span>
          <span className="text-sm font-semibold text-[var(--text)]">BloxdBench</span>
        </div>

        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></path></svg>
            Powered by Three.js - Auto-loads models from Bloxdy/texture-packs
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6">
            BloxdBench <span className="text-purple-500">Studio</span>
          </h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Professional voxel model editor for Bloxd.io. Create, edit, and export custom block models, item models, and voxel structures.
            Models are auto-loaded from the official <a href="https://github.com/Bloxdy/texture-packs" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline font-semibold">Bloxdy/texture-packs</a> repository.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/25">
              Open Main Website
            </a>
            <Link href="/guides/mesh-entities" className="bg-[var(--sidebar-bg)] text-[var(--text)] border border-[var(--border)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--nav-hover)] transition-colors">
              Mesh Entities Guide
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l3-3 3 3 3-3v6l-3 3-3-3-3 3V15z" /></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Block Models</h3>
            <p className="text-[var(--text)]/70">Create custom 3D block models with voxel precision. Export as Bloxd.js code for direct use in Code Blocks.</p>
          </div>
          <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Item Models</h3>
            <p className="text-[var(--text)]/70">Design custom item models with flat voxel geometry. Perfect for weapons, tools, and held items.</p>
          </div>
          <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Generic Models</h3>
            <p className="text-[var(--text)]/70">Free-form voxel modeling for any custom structure. Export as GLTF for use in other applications.</p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></path></svg>
              </div>
              <h4 className="font-bold mb-1">Auto Model Loading</h4>
              <p className="text-sm text-[var(--text)]/70">Loads 3D models directly from Bloxdy/texture-packs GitHub repo</p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></path></svg>
              </div>
              <h4 className="font-bold mb-1">Bloxd.js Export</h4>
              <p className="text-sm text-[var(--text)]/70">One-click export to Bloxd.io JavaScript Code Block API</p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></path></svg>
              </div>
              <h4 className="font-bold mb-1">GLTF Export</h4>
              <p className="text-sm text-[var(--text)]/70">Export models as standard GLTF for use in Blender, Unity, etc.</p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></path></svg>
              </div>
              <h4 className="font-bold mb-1">Texture Atlas</h4>
              <p className="text-sm text-[var(--text)]/70">Built-in texture picker with auto-loaded Bloxd.io textures</p>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-16">
          <h2 className="text-3xl font-bold text-center mb-10">Model Sources</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold">Bloxdy/texture-packs</p>
                    <p className="text-sm text-[var(--text)]/60">Official Bloxd.io model repository</p>
                  </div>
                </div>
                <a href="https://github.com/Bloxdy/texture-packs" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary)] hover:underline font-medium">View Repository →</a>
              </div>
            </div>
            <div className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold">Auto-discovery</p>
                    <p className="text-sm text-[var(--text)]/60">Automatically fetches all .glb files from the repository</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">Live</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-10 mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Auto-loaded texture-pack models</h2>
              <p className="text-[var(--text)]/70 mt-2">The catalog is refreshed from Bloxdy/texture-packs when this page opens.</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {modelStatus === 'loading' ? 'Loading models' : modelStatus === 'live' ? 'Live catalog' : 'Repository unavailable'}
            </span>
          </div>
          {modelStatus === 'loading' && <p className="text-sm text-[var(--text)]/60">Reading the texture-pack index...</p>}
          {modelStatus === 'fallback' && <p className="text-sm text-[var(--text)]/60">The live catalog could not be loaded. Open the repository to browse the source files.</p>}
          {modelStatus === 'live' && models.length === 0 && <p className="text-sm text-[var(--text)]/60">No model files were found at the repository root.</p>}
          {modelStatus === 'live' && models.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {models.slice(0, 24).map((model) => (
                <a key={model.name} href={model.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg hover:border-purple-500 transition-colors">
                  <span className="block font-semibold text-sm truncate" title={model.name}>{model.name}</span>
                  <span className="block text-xs text-[var(--text)]/60 mt-1">{model.type} model</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--sidebar-bg)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Players Logo" className="w-6 h-6" />
              <span className="font-bold">Players</span>
            </div>
            <p className="text-sm text-[var(--text)]/60">
              Built by <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">FallenNightA</a>
              · Models from <a href="https://github.com/Bloxdy/texture-packs" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Bloxdy/texture-packs</a>
              <br />
              Official account: <a href="https://github.com/HidayatBelajar319" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">HidayatBelajar319</a> is one of the official accounts made by <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">FallenNightA</a> (owner)
            </p>
            <a href="https://github.com/HidayatBelajar319/BloxdUtility-Documentation" target="_blank" rel="noopener noreferrer" className="text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}