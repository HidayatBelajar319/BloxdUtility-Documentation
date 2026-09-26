'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import {
  BLOCK_NAMES,
  CODE_API_CONTENTS,
  CODE_API_RAW,
  CODE_API_REPOSITORY,
  FALLBACK_DOC_FILES,
  GAME_FEATURES,
  ITEM_NAMES,
  SECRET_ITEMS,
} from '@/lib/docs-data';
import type { DocFile } from '@/lib/docs-data';

const FALLBACK = FALLBACK_DOC_FILES.map((file) => ({ ...file }));

const ITEM_USAGES: Record<string, string> = {
  wooden_sword: 'A starting melee weapon.',
  stone_sword: 'A mid-tier melee weapon.',
  iron_sword: 'A durable melee weapon.',
  diamond_sword: 'A high-tier melee weapon.',
  wooden_pickaxe: 'Mines basic stone and soil blocks.',
  stone_pickaxe: 'Mines stone and common building blocks.',
  iron_pickaxe: 'Mines a broad range of world materials.',
  diamond_pickaxe: 'A fast, high-tier mining tool.',
  shield: 'Reduces damage from an incoming hit.',
  bow: 'Ranged ammunition weapon.',
  crossbow: 'A ranged weapon that supports quick shots.',
  arrow: 'Ammunition for bows and crossbows.',
  bread: 'Restores a small amount of hunger.',
  torch: 'Provides a portable light source.',
  bucket: 'Collects or places a supported fluid.',
  potion: 'Applies a temporary effect when consumed.',
  ender_pearl: 'Moves or teleports a player to a chosen location.',
  rope: 'Can be used to connect or secure supported structures.',
};

type PrimaryTab = 'api' | 'game';
type GameTab = 'all' | 'items' | 'secrets' | 'blocks';
type SourceState = 'loading' | 'github' | 'fallback';
type FontSize = 'sm' | 'md' | 'lg';

interface Bookmark {
  id: string;
  label: string;
}

interface SearchMatch {
  fileName: string;
  index: number;
  start: number;
  snippet: string;
}

function cloneFallbackDocs(): DocFile[] {
  return FALLBACK.map((file) => ({ ...file }));
}

function isMarkdown(name: string): boolean {
  return name.toLowerCase().endsWith('.md');
}

function rawUrlFor(name: string): string {
  return `${CODE_API_RAW}/${name
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  const slug = stripMarkdown(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

function uniqueSlug(value: string, used: Map<string, number>): string {
  const base = slugify(value);
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function getHeadings(content: string) {
  const used = new Map<string, number>();
  const headings: Array<{ id: string; label: string; level: number }> = [];
  content.split(/\r?\n/).forEach((line) => {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) return;
    const label = stripMarkdown(match[2]);
    headings.push({ id: uniqueSlug(label, used), label, level: match[1].length });
  });
  return headings;
}

function addHeadingIds(html: string): string {
  const used = new Map<string, number>();
  return html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attributes: string, inner: string) => {
      const label = stripHtml(inner);
      const id = uniqueSlug(label, used);
      return `<h${level}${attributes} id="${escapeHtml(id)}" data-heading-label="${escapeHtml(label)}">${inner}</h${level}>`;
    },
  );
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|iframe|object|embed)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '');
}

function renderMarkdown(content: string, fileName: string, collapsedCodes: Set<string>): string {
  const renderer = new marked.Renderer() as unknown as {
    code: (token: unknown, infostring?: string) => string;
  };
  let codeIndex = 0;

  renderer.code = (token: unknown, infostring?: string) => {
    const codeToken = token && typeof token === 'object'
      ? (token as { text?: string; lang?: string })
      : { text: String(token), lang: infostring };
    const language = (codeToken.lang || '').split(/\s+/)[0].toLowerCase();
    const source = codeToken.text || '';
    const codeId = `${slugify(fileName)}-${codeIndex++}`;
    const grammar = language ? Prism.languages[language] : undefined;
    const highlighted = grammar
      ? Prism.highlight(source, grammar, language)
      : escapeHtml(source);
    const languageLabel = escapeHtml(language || 'text');
    const collapsedClass = collapsedCodes.has(codeId) ? ' is-collapsed' : '';
    const toggleLabel = collapsedCodes.has(codeId) ? 'Expand' : 'Collapse';

    return `<div class="code-block${collapsedClass}" data-code-id="${escapeHtml(codeId)}"><div class="code-toolbar"><span class="code-language">${languageLabel}</span><span class="code-actions"><button type="button" data-code-toggle="${escapeHtml(codeId)}">${toggleLabel}</button><button type="button" data-code-copy="${escapeHtml(codeId)}">Copy</button></span></div><pre><code class="language-${escapeHtml(language || 'text')}">${highlighted}</code></pre></div>`;
  };

  const parsed = marked.parse(content, {
    gfm: true,
    breaks: false,
    renderer: renderer as never,
  }) as string;

  return sanitizeHtml(addHeadingIds(parsed));
}

function highlightHtml(html: string, query: string): string {
  const term = query.trim();
  if (!term) return html;
  const pattern = new RegExp(`(${escapeRegExp(term)})`, 'gi');
  let matchIndex = 0;

  return html
    .split(/(<[^>]*>)/g)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part.replace(pattern, (match) => {
        const current = matchIndex++;
        return `<mark class="search-hit" data-search-hit="${current}">${match}</mark>`;
      });
    })
    .join('');
}

function getTextNames(content: string): string[] {
  const names = content
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+[.)])\s*/, '').trim())
    .filter((line) => line.length > 0 && line.length < 120 && !line.startsWith('#'));
  return Array.from(new Set(names));
}

function getCodeIds(content: string, fileName: string): string[] {
  const ids: string[] = [];
  const matches = content.match(/```[\s\S]*?```/g) ?? [];
  matches.forEach((_match, index) => ids.push(`${slugify(fileName)}-${index}`));
  return ids;
}

function countCodeBlocks(content: string): number {
  return (content.match(/```[\s\S]*?```/g) ?? []).length;
}

function countWords(content: string): number {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function codeApiKind(name: string): DocFile['kind'] {
  return isMarkdown(name) ? 'markdown' : 'text';
}

export default function DocumentationPage() {
  const [docs, setDocs] = useState<DocFile[]>(() => cloneFallbackDocs());
  const [activeName, setActiveName] = useState(FALLBACK[0].name);
  const [source, setSource] = useState<SourceState>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [collapsedCodes, setCollapsedCodes] = useState<Set<string>>(new Set());
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>('api');
  const [gameTab, setGameTab] = useState<GameTab>('all');
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState('');
  const articleRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('players-doc-theme') ?? localStorage.getItem('darkMode');
    const nextDark = storedTheme === 'true';
    const storedSize = localStorage.getItem('players-doc-font-size') as FontSize | null;
    const storedBookmarks = localStorage.getItem('players-doc-bookmarks');

    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    if (storedSize === 'sm' || storedSize === 'md' || storedSize === 'lg') {
      setFontSize(storedSize);
    }
    if (storedBookmarks) {
      try {
        const parsed = JSON.parse(storedBookmarks) as Bookmark[];
        if (Array.isArray(parsed)) setBookmarks(parsed);
      } catch {
        localStorage.removeItem('players-doc-bookmarks');
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const discoverDocs = async () => {
      try {
        const response = await fetch(CODE_API_CONTENTS, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const payload = (await response.json()) as Array<{ name?: unknown; type?: unknown }>;
        if (!Array.isArray(payload)) throw new Error('Unexpected GitHub response');

        const candidates = payload.filter((entry) => (
          typeof entry.name === 'string'
          && entry.type === 'file'
          && /\.(md|txt)$/i.test(entry.name)
        ));
        const settled = await Promise.allSettled(candidates.map(async (entry) => {
          const name = String(entry.name);
          const url = rawUrlFor(name);
          const fileResponse = await fetch(url);
          if (!fileResponse.ok) throw new Error(`Could not load ${name}`);
          const content = await fileResponse.text();
          return { name, content, kind: codeApiKind(name), url } satisfies DocFile;
        }));
        const loaded = settled
          .filter((result): result is PromiseFulfilledResult<DocFile> => result.status === 'fulfilled')
          .map((result) => result.value);

        if (!cancelled && loaded.length > 0) {
          setDocs(loaded);
          setActiveName(loaded[0].name);
          setSource('github');
        } else if (!cancelled) {
          setDocs(cloneFallbackDocs());
          setActiveName(FALLBACK[0].name);
          setSource('fallback');
        }
      } catch {
        if (!cancelled) {
          setDocs(cloneFallbackDocs());
          setActiveName(FALLBACK[0].name);
          setSource('fallback');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void discoverDocs();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [docs.length]);

  useEffect(() => {
    setSearchIndex(0);
  }, [query, docs]);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const activeDoc = useMemo(
    () => docs.find((doc) => doc.name === activeName) ?? docs[0],
    [activeName, docs],
  );

  const headings = useMemo(
    () => activeDoc && activeDoc.kind === 'markdown' ? getHeadings(activeDoc.content) : [],
    [activeDoc],
  );

  const activeCodeIds = useMemo(
    () => activeDoc ? getCodeIds(activeDoc.content, activeDoc.name) : [],
    [activeDoc],
  );

  const searchMatches = useMemo<SearchMatch[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const matches: SearchMatch[] = [];
    docs.forEach((doc) => {
      const content = doc.content.toLowerCase();
      let start = content.indexOf(term);
      while (start !== -1) {
        const lineStart = content.lastIndexOf('\n', start) + 1;
        const lineEndIndex = content.indexOf('\n', start);
        const lineEnd = lineEndIndex === -1 ? content.length : lineEndIndex;
        matches.push({
          fileName: doc.name,
          index: matches.length,
          start,
          snippet: doc.content.slice(lineStart, lineEnd).trim(),
        });
        start = content.indexOf(term, start + term.length);
      }
    });
    return matches;
  }, [docs, query]);

  const matchingFiles = useMemo(() => {
    if (!query.trim()) return new Set(docs.map((doc) => doc.name));
    return new Set(searchMatches.map((match) => match.fileName));
  }, [docs, query, searchMatches]);

  const renderedContent = useMemo(() => {
    if (!activeDoc || activeDoc.kind !== 'markdown') return '';
    return highlightHtml(renderMarkdown(activeDoc.content, activeDoc.name, collapsedCodes), query);
  }, [activeDoc, collapsedCodes, query]);

  const stats = useMemo(() => {
    const allContent = docs.map((doc) => doc.content).join('\n');
    const words = countWords(allContent);
    return {
      files: docs.length,
      codeBlocks: docs.reduce((total, doc) => total + countCodeBlocks(doc.content), 0),
      items: ITEM_NAMES.length,
      words,
      readTime: Math.max(1, Math.ceil(words / 200)),
    };
  }, [docs]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  const toggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('players-doc-theme', String(nextDark));
    document.documentElement.classList.toggle('dark', nextDark);
  };

  const changeFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('players-doc-font-size', size);
  };

  const scrollToId = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHeadingContextMenu = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const heading = target.closest('h1,h2,h3,h4,h5,h6') as HTMLElement | null;
    if (!heading || !articleRef.current?.contains(heading)) return;
    event.preventDefault();
    const id = heading.id;
    const label = heading.dataset.headingLabel || stripHtml(heading.innerHTML) || id;
    const existing = bookmarks.find((bookmark) => bookmark.id === id);
    const next = existing
      ? bookmarks.filter((bookmark) => bookmark.id !== id)
      : [...bookmarks, { id, label }];
    setBookmarks(next);
    localStorage.setItem('players-doc-bookmarks', JSON.stringify(next));
    showToast(existing ? 'Bookmark removed' : 'Heading bookmarked');
  };

  const removeBookmark = (id: string) => {
    const next = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(next);
    localStorage.setItem('players-doc-bookmarks', JSON.stringify(next));
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast('Copied to clipboard');
  };

  const handleArticleClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const toggle = target.closest('[data-code-toggle]') as HTMLElement | null;
    if (toggle) {
      const id = toggle.dataset.codeToggle;
      if (!id) return;
      setCollapsedCodes((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      return;
    }

    const copy = target.closest('[data-code-copy]') as HTMLElement | null;
    if (copy) {
      const id = copy.dataset.codeCopy;
      const block = id
        ? Array.from(articleRef.current?.querySelectorAll<HTMLElement>('[data-code-id]') ?? [])
          .find((element) => element.dataset.codeId === id)
        : null;
      const code = block?.querySelector('code')?.textContent;
      if (code) void copyText(code);
    }
  };

  const jumpToSearchResult = (direction: 1 | -1) => {
    if (searchMatches.length === 0) return;
    const nextIndex = (searchIndex + direction + searchMatches.length) % searchMatches.length;
    const match = searchMatches[nextIndex];
    setSearchIndex(nextIndex);
    setPrimaryTab('api');
    setActiveName(match.fileName);
    const localIndex = searchMatches
      .filter((candidate) => candidate.fileName === match.fileName)
      .findIndex((candidate) => candidate.index === match.index);
    window.setTimeout(() => {
      const hit = articleRef.current?.querySelector<HTMLElement>(`[data-search-hit="${Math.max(0, localIndex)}"]`);
      hit?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  const chooseSearchResult = (match: SearchMatch) => {
    setSearchIndex(match.index);
    setPrimaryTab('api');
    setActiveName(match.fileName);
    const localIndex = searchMatches
      .filter((candidate) => candidate.fileName === match.fileName)
      .findIndex((candidate) => candidate.index === match.index);
    window.setTimeout(() => {
      const hit = articleRef.current?.querySelector<HTMLElement>(`[data-search-hit="${Math.max(0, localIndex)}"]`);
      hit?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  const toggleAllCodeBlocks = (collapse: boolean) => {
    setCollapsedCodes(collapse ? new Set(activeCodeIds) : new Set());
    showToast(collapse ? 'Code blocks collapsed' : 'Code blocks expanded');
  };

  const exportMarkdown = () => {
    const content = docs
      .map((doc) => `# ${doc.name}\n\n_Source: ${doc.url}_\n\n${doc.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bloxdy-code-api-docs.md';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('Markdown export downloaded');
  };

  const textNames = activeDoc?.kind === 'text' ? getTextNames(activeDoc.content) : [];

  return (
    <div className={`docs-app font-size-${fontSize} min-h-screen bg-[var(--bg)] text-[var(--text)]`}>
      <div className="reading-progress" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>

      <header className="border-b border-[var(--border)] bg-[var(--sidebar-bg)] sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <Link href="/" className="flex items-center gap-2" aria-label="Players home">
              <img src="/logo.svg" alt="Players Logo" className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tighter">Players</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-5" aria-label="Primary navigation">
              <Link href="/documentation" className="text-sm font-semibold text-[var(--primary)]">Documentation</Link>
              <Link href="/api" className="text-sm font-medium hover:text-[var(--primary)]">API</Link>
              <Link href="/guides" className="text-sm font-medium hover:text-[var(--primary)]">Guides</Link>
              <Link href="/bloxdbench" className="text-sm font-medium hover:text-[var(--primary)]">BloxdBench</Link>
              <Link href="/ai" className="text-sm font-medium hover:text-[var(--primary)]">Bloxd AI</Link>
              <Link href="/platform" className="text-sm font-medium hover:text-[var(--primary)]">Platform</Link>
              <Link href="/changelog" className="text-sm font-medium hover:text-[var(--primary)]">Changelog</Link>
              <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-[var(--primary)]">Main Website</a>
            </nav>
            <div className="flex items-center gap-2">
              <button type="button" onClick={toggleDark} className="docs-control-button" aria-label="Toggle dark mode">
                {isDark ? 'Light' : 'Dark'}
              </button>
              <div className="docs-font-controls" aria-label="Font size">
                {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => changeFontSize(size)}
                    className={fontSize === size ? 'is-active' : ''}
                    aria-label={`${size} font size`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text)]/60 mb-6">
          <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[var(--text)]">Documentation</span>
        </div>

        <section className="docs-hero mb-8">
          <div>
            <p className="docs-kicker">Players · Code API reference</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Bloxd Utility Documentation</h1>
            <p className="text-[var(--text)]/70 max-w-3xl leading-relaxed">
              Browse the Bloxdy Code API, discover game features, and keep the complete reference available offline. Markdown and text files are loaded from the official repository whenever possible.
            </p>
          </div>
          <div className="docs-hero-links">
            <a href={CODE_API_REPOSITORY} target="_blank" rel="noopener noreferrer" className="docs-button docs-button-primary">Code API repository</a>
            <a href="https://bloxd.io" target="_blank" rel="noopener noreferrer" className="docs-button">Play Bloxd.io</a>
            <a href="https://bloxd.fandom.com/" target="_blank" rel="noopener noreferrer" className="docs-button">Fandom wiki</a>
          </div>
        </section>

        <section className="stats-strip" aria-label="Documentation statistics">
          <div><span className="stats-value">{stats.files}</span><span className="stats-label">Files</span></div>
          <div><span className="stats-value">{stats.codeBlocks}</span><span className="stats-label">Code blocks</span></div>
          <div><span className="stats-value">{stats.items}</span><span className="stats-label">Items</span></div>
          <div><span className="stats-value">{stats.words.toLocaleString()}</span><span className="stats-label">Words</span></div>
          <div><span className="stats-value">~{stats.readTime} min</span><span className="stats-label">Read time</span></div>
        </section>

        <section className="docs-toolbar" aria-label="Documentation tools">
          <div className="docs-search-wrap">
            <label htmlFor="doc-search" className="sr-only">Search all documentation</label>
            <input
              id="doc-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all docs..."
              className="docs-search"
            />
            {query && (
              <div className="docs-search-meta">
                <span>{searchMatches.length} match{searchMatches.length === 1 ? '' : 'es'}</span>
                <button type="button" onClick={() => jumpToSearchResult(-1)} disabled={searchMatches.length === 0} aria-label="Previous search result">↑</button>
                <button type="button" onClick={() => jumpToSearchResult(1)} disabled={searchMatches.length === 0} aria-label="Next search result">↓</button>
              </div>
            )}
          </div>
          <div className="docs-toolbar-actions">
            <button type="button" className="docs-button" onClick={() => toggleAllCodeBlocks(true)} disabled={activeCodeIds.length === 0}>Collapse code</button>
            <button type="button" className="docs-button" onClick={() => toggleAllCodeBlocks(false)} disabled={activeCodeIds.length === 0}>Expand code</button>
            <button type="button" className="docs-button" onClick={exportMarkdown}>Export Markdown</button>
            <button type="button" className="docs-button" onClick={() => window.print()}>Print</button>
          </div>
        </section>

        {searchMatches.length > 0 && (
          <section className="search-results" aria-label="Search results">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="font-semibold">Search results</h2>
              <span className="text-xs text-[var(--text)]/60">Current: {searchMatches[Math.min(searchIndex, searchMatches.length - 1)]?.fileName}</span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {searchMatches.slice(0, 100).map((match) => (
                <button
                  type="button"
                  key={`${match.fileName}-${match.index}`}
                  className={`search-result ${match.index === searchIndex ? 'is-active' : ''}`}
                  onClick={() => chooseSearchResult(match)}
                >
                  <span className="search-result-file">{match.fileName}</span>
                  <span className="search-result-snippet">{match.snippet}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="docs-workspace">
          <aside className="docs-files" aria-label="Documentation files">
            <div className="docs-panel-heading">
              <h2 className="font-semibold">Files</h2>
              <span className="text-xs text-[var(--text)]/60">{source === 'github' ? 'Live' : source === 'fallback' ? 'Fallback' : 'Loading'}</span>
            </div>
            {isLoading && <p className="docs-loading">Discovering repository files...</p>}
            <div className="space-y-1">
              {docs.map((doc) => {
                const matchCount = searchMatches.filter((match) => match.fileName === doc.name).length;
                return (
                  <button
                    type="button"
                    key={doc.name}
                    onClick={() => setActiveName(doc.name)}
                    className={`docs-file ${activeDoc?.name === doc.name ? 'is-active' : ''} ${query && !matchingFiles.has(doc.name) ? 'is-dimmed' : ''}`}
                  >
                    <span>{doc.name}</span>
                    <small>{doc.kind === 'text' ? 'TXT' : 'MD'}{query && matchCount > 0 ? ` · ${matchCount}` : ''}</small>
                  </button>
                );
              })}
            </div>
            <a className="docs-repo-link" href={CODE_API_REPOSITORY} target="_blank" rel="noopener noreferrer">Open source repository →</a>
          </aside>

          <section className="docs-reader" aria-live="polite">
            {activeDoc && activeDoc.kind === 'markdown' ? (
              <>
                <div className="docs-reader-header">
                  <div>
                    <p className="docs-file-kicker">{activeDoc.name}</p>
                    <h2 className="text-2xl font-bold">{headings[0]?.label ?? activeDoc.name}</h2>
                  </div>
                  <a href={activeDoc.url} target="_blank" rel="noopener noreferrer" className="docs-button">View source</a>
                </div>
                <article
                  ref={articleRef}
                  className="markdown-body"
                  data-doc-file={activeDoc.name}
                  onContextMenu={handleHeadingContextMenu}
                  onClick={handleArticleClick}
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
                <p className="docs-reader-hint">Right-click a heading to add or remove a bookmark.</p>
              </>
            ) : activeDoc ? (
              <>
                <div className="docs-reader-header">
                  <div>
                    <p className="docs-file-kicker">{activeDoc.name}</p>
                    <h2 className="text-2xl font-bold">Name catalog</h2>
                  </div>
                  <a href={activeDoc.url} target="_blank" rel="noopener noreferrer" className="docs-button">View source</a>
                </div>
                <p className="docs-reader-hint mb-5">Click any name to copy it to the clipboard.</p>
                <div className="name-grid">
                  {textNames.map((name) => (
                    <button type="button" key={name} className="name-chip" onClick={() => void copyText(name)} title={`Copy ${name}`}>
                      {name}
                    </button>
                  ))}
                </div>
                {textNames.length === 0 && <p className="text-[var(--text)]/70">No names were found in this text file.</p>}
              </>
            ) : (
              <p>Select a documentation file to begin.</p>
            )}
          </section>

          <aside className="docs-toc" aria-label="Table of contents">
            <div className="docs-panel-heading">
              <h2 className="font-semibold">On this page</h2>
              {headings.length > 0 && <span className="text-xs text-[var(--text)]/60">{headings.length}</span>}
            </div>
            {headings.length > 0 ? (
              <nav className="toc-list">
                {headings.map((heading) => (
                  <button
                    type="button"
                    key={heading.id}
                    onClick={() => scrollToId(heading.id)}
                    className={`toc-item toc-level-${heading.level}`}
                  >
                    {heading.label}
                  </button>
                ))}
              </nav>
            ) : <p className="text-sm text-[var(--text)]/60">Headings appear for Markdown files.</p>}

            <div className="docs-bookmarks">
              <div className="docs-panel-heading">
                <h2 className="font-semibold">Bookmarks</h2>
                <span className="text-xs text-[var(--text)]/60">{bookmarks.length}</span>
              </div>
              {bookmarks.length === 0 ? (
                <p className="text-sm text-[var(--text)]/60">Right-click a heading to save it here.</p>
              ) : (
                <div className="space-y-1">
                  {bookmarks.map((bookmark) => (
                    <div className="bookmark-row" key={bookmark.id}>
                      <button type="button" onClick={() => scrollToId(bookmark.id)}>{bookmark.label}</button>
                      <button type="button" onClick={() => removeBookmark(bookmark.id)} aria-label={`Remove ${bookmark.label}`}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="game-features" aria-labelledby="game-features-title">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="docs-kicker">Reference library</p>
              <h2 id="game-features-title" className="text-3xl font-black">Game Features</h2>
              <p className="text-[var(--text)]/70 mt-2">Use the live Code API files or browse the built-in game feature catalog.</p>
            </div>
            <a href="https://bloxd.io" target="_blank" rel="noopener noreferrer" className="docs-button">Open Bloxd.io</a>
          </div>

          <div className="feature-tabs" role="tablist" aria-label="Game feature categories">
            <button type="button" role="tab" aria-selected={primaryTab === 'api'} className={primaryTab === 'api' ? 'is-active' : ''} onClick={() => setPrimaryTab('api')}>Code API Docs</button>
            <button type="button" role="tab" aria-selected={primaryTab === 'game'} className={primaryTab === 'game' ? 'is-active' : ''} onClick={() => setPrimaryTab('game')}>Bloxd.io Game Features</button>
          </div>

          {primaryTab === 'api' ? (
            <div className="feature-panel" role="tabpanel">
              <h3>Code API documentation</h3>
              <p>These files are discovered from <a href={CODE_API_REPOSITORY} target="_blank" rel="noopener noreferrer">Bloxdy/code-api</a>. Use the file list, full-text search, and table of contents to move through the reference.</p>
              <div className="api-file-grid">
                {docs.map((doc) => (
                  <button type="button" key={doc.name} onClick={() => { setActiveName(doc.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="api-file-card">
                    <strong>{doc.name}</strong>
                    <span>{doc.kind === 'text' ? 'Clickable TXT catalog' : 'Markdown reference'}</span>
                  </button>
                ))}
              </div>
              <pre className="inline-code-sample"><code>{`onPlayerJoin((player) => {
  print('Welcome to the world')
})`}</code></pre>
            </div>
          ) : (
            <div className="feature-panel" role="tabpanel">
              <div className="feature-subtabs" role="tablist" aria-label="Game feature sections">
                {([
                  ['all', 'All Features'],
                  ['items', 'Items & Uses'],
                  ['secrets', 'Secret Items'],
                  ['blocks', 'Blocks'],
                ] as Array<[GameTab, string]>).map(([key, label]) => (
                  <button type="button" role="tab" aria-selected={gameTab === key} className={gameTab === key ? 'is-active' : ''} onClick={() => setGameTab(key)} key={key}>{label}</button>
                ))}
              </div>

              {gameTab === 'all' && (
                <div className="feature-card-grid">
                  {GAME_FEATURES.map((feature) => (
                    <article className="feature-card" key={feature.title}>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </article>
                  ))}
                </div>
              )}

              {gameTab === 'items' && (
                <div className="feature-table-wrap">
                  <h3>Items & Uses</h3>
                  <p>These names come from the ITEM_NAMES catalog and can be used with inventory or item helpers.</p>
                  <table className="feature-table">
                    <thead><tr><th>Item name</th><th>Typical use</th></tr></thead>
                    <tbody>
                      {ITEM_NAMES.map((item) => (
                        <tr key={item}><td><code>{item}</code></td><td>{ITEM_USAGES[item] ?? 'Use with the item API or a custom gameplay system.'}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gameTab === 'secrets' && (
                <div>
                  <h3>Secret Items obtained only by Code</h3>
                  <p className="mb-5">These hidden items are intentionally not part of the ordinary inventory list. Grant or use them from a Code Block.</p>
                  <div className="feature-card-grid">
                    {SECRET_ITEMS.map((item) => (
                      <article className="feature-card secret-card" key={item.name}>
                        <div className="flex items-center justify-between gap-3"><h3>{item.name}</h3><span className="secret-badge">{item.obtain}</span></div>
                        <p>{item.usage}</p>
                        <div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {gameTab === 'blocks' && (
                <div>
                  <h3>Blocks</h3>
                  <p className="mb-5">These names come from the BLOCK_NAMES data set and are ready to copy into Code Block workflows.</p>
                  <div className="name-grid block-grid">
                    {BLOCK_NAMES.map((block) => (
                      <button type="button" key={block} className="name-chip" onClick={() => void copyText(block)} title={`Copy ${block}`}>{block}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="external-links" aria-labelledby="external-links-title">
          <h2 id="external-links-title">Project links</h2>
          <div className="external-link-grid">
            <a href={CODE_API_REPOSITORY} target="_blank" rel="noopener noreferrer">Bloxdy/code-api repository</a>
            <a href="https://bloxd.io" target="_blank" rel="noopener noreferrer">Bloxd.io</a>
            <a href="https://bloxd.fandom.com/" target="_blank" rel="noopener noreferrer">Bloxd.io Fandom</a>
            <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer">Bloxd Utility Main Website</a>
            <a href="https://github.com/HidayatBelajar319/BloxdUtility-Documentation" target="_blank" rel="noopener noreferrer">Documentation repository</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--sidebar-bg)] mt-12">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><img src="/logo.svg" alt="Players Logo" className="w-6 h-6" /><span className="font-bold">Players</span></div>
          <p className="text-sm text-[var(--text)]/60 text-center">Documentation for <a href="https://bloxd.io" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Bloxd.io</a> · <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Main Website</a><br />Official account: <a href="https://github.com/HidayatBelajar319" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">HidayatBelajar319</a> is one of the official accounts made by <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">FallenNightA</a> (owner)</p>
          <a href="https://github.com/HidayatBelajar319/BloxdUtility-Documentation" target="_blank" rel="noopener noreferrer" className="text-[var(--text)]/60 hover:text-[var(--primary)]">GitHub</a>
        </div>
      </footer>

      <div className={`docs-toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
