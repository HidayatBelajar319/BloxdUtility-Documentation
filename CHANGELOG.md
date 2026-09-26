# Changelog 📜

All notable changes to the **Players — Bloxd Utility Documentation** site.
Newest entries first. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows [Semantic Versioning](https://semver.org).

---

## [1.5.0] - 2026-09-26

### ✨ Added
- 🧩 New **Our Platform Features** section — documentation of our own platform (not the Bloxd.io API): what each feature is, how it works, and the code behind it.
- 📄 Four new pages under [`/platform`](https://bloxdutility-documentation.netlify.app/platform): **Code Lab** (Monaco + code-api autocomplete + CodexMind), **BloxdBench** (Three.js voxel studio, internet-loaded assets), **Free AI system** (Puter.js default, BYOK fallbacks), and **Data pipeline** (code-api auto-discovery, search/TOC/bookmarks/export, global CSS theming).
- 🧭 **Platform** link added to the primary navigation on every page, placed after BloxdBench.
- 🔗 Platform quick-link cards added to the home page quick-links grid.

### 🔧 Changed
- 🧭 Navigation order is now Documentation → API Reference → Guides → BloxdBench → Platform → Changelog across the whole site.
- 🎨 The new pages use the existing design tokens only, so they inherit light and dark themes with no extra styling.

---

## [1.4.0] - 2026-09-26

### 🔧 Fixed
- 🟢 **Netlify build green** — moved all per-page style blocks into `src/app/globals.css` and removed 17 stray SVG closing tags breaking the JSX compile.
- 📖 Added `README.md` documenting routes, auto-discovery architecture, and Netlify deploy.

## [1.3.0] - 2026-09-26

### ✨ Added
- 🧾 New **Changelog** page at [`/changelog`](https://bloxdutility-documentation.netlify.app/changelog) listing every release of the documentation site.
- 🧭 **Changelog** link added to the primary navigation on every page (Home, Documentation, API Reference, Guides, BloxdBench).
- 🔗 GitHub-flavoured Markdown changelog (`CHANGELOG.md`) kept in sync with the on-site changelog page.

### 🔧 Changed
- 📄 All footers now carry the official-accounts notice for the whole project.
- 🧩 Changelog entries reuse the existing card styling so they read consistently with the rest of the site.

---

## [1.2.0] - 2026-09-20

### ✨ Added
- 🎮 **Game Features** section covering the Bloxd.io gameplay systems now documented in the reference.
- 🕵️ **Secret / code-only items** section — the items that can only be obtained or used from code, documented with their IDs and usage notes.
- 🧪 Code snippets for every secret item so they can be copy-pasted straight into a World Code block.

### 🔧 Changed
- 📚 Item and block tables expanded to cover the newly documented Game Features.
- 🏷️ Secret items flagged with their own badge in the item listings for quick scanning.

---

## [1.1.0] - 2026-09-12

### ✨ Added
- 🔄 **GitHub auto-discovery** — documentation files are discovered automatically from the [Bloxdy/code-api](https://github.com/Bloxdy/code-api) repository.
- 🗂️ Sidebar file list generated from the discovered repository contents, so new upstream files appear without a code change.
- 🔗 Every discovered file keeps a direct link back to its source on GitHub.

### 🔧 Changed
- ⏱️ Sync runs automatically, keeping the site aligned with upstream at all times.
- 🧹 Manual file listing removed in favour of the auto-discovered list.

---

## [1.0.0] - 2026-09-01

### ✨ Added
- 🏠 **Home** landing page with hero, feature grid, and quick links.
- 📖 **/documentation** — full documentation browser with table of contents.
- ⚡ **/api** — API reference for functions, callbacks, blocks, items, and variables.
- 📚 **/guides** — guides index for step-by-step Bloxd.io tutorials.
- 🧱 **/bloxdbench** — BloxdBench voxel model editor.
- 🌙 **Dark mode** toggle with the choice persisted in `localStorage`.
- 🔎 Full-text **search** across every documentation file with match highlighting.
- 🔖 **Bookmarks** for sections you want to come back to.
- 📤 **Export** as Markdown, plus print-friendly output for offline reference.

### 🔧 Changed
- 🎨 Site-wide design tokens (`--bg`, `--text`, `--sidebar-bg`, `--border`, `--primary`) drive both light and dark themes.

---

## 👥 Official Accounts

- **[HidayatBelajar319](https://github.com/HidayatBelajar319)** is an official account made by **[FallenNightA](https://github.com/FallenNightA)** (owner).

If a link claims to be part of Bloxd Utility, verify it against the accounts above before using it.

[1.5.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.4.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.3.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.2.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.1.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.0.0]: https://bloxdutility-documentation.netlify.app/changelog
