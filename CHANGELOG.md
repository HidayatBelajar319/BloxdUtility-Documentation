# Changelog 📜

All notable changes to the **Players — Bloxd Utility Documentation** site.
Newest entries first. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows [Semantic Versioning](https://semver.org).

---

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

[1.3.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.2.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.1.0]: https://bloxdutility-documentation.netlify.app/changelog
[1.0.0]: https://bloxdutility-documentation.netlify.app/changelog
