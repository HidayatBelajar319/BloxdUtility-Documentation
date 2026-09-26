# 📚 Players — BloxdUtility Documentation

![Status: Active](https://img.shields.io/badge/status-Active-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14_Static_Export-black?style=flat-square)

**The official documentation website for the Players Bloxd.io Utility platform.**
**Live API reference (auto-synced from [`Bloxdy/code-api`](https://github.com/Bloxdy/code-api)) + guides + docs of OUR OWN platform features.**

> 🏢 **Official account:** [HidayatBelajar319](https://github.com/HidayatBelajar319) is one of the official accounts made by **FallenNightA** (owner).
> 🏠 **Main website:** [https://bloxdutility.netlify.app/](https://bloxdutility.netlify.app/)

---

## 🗺️ Routes (clean URLs, trailing slash)
| Route | Page |
|---|---|
| `/` | Home — overview, features, quick links |
| `/documentation` | Full API docs (auto-discovered) + Bloxd.io Game Features + secret items |
| `/api` | API reference index |
| `/guides` | Step-by-step guides & tutorials |
| `/bloxdbench` | BloxdBench info (assets auto-load from `Bloxdy/texture-packs`) |
| `/platform` | **Our platform features**: how each feature works, what code it uses, what tech it uses |
| `/changelog` | Release notes, synced with `CHANGELOG.md` |

---

## ✨ Features
✅ **Automatic GitHub discovery** – file list fetched from `api.github.com/repos/Bloxdy/code-api/contents`, then each file from `raw.githubusercontent.com` (hardcoded list is only a fallback).
✅ **Full-text search** with highlight + prev/next jump · **Table of contents** · **Bookmarks** (localStorage).
✅ **Dark mode** + font-size controls · **Export all docs as Markdown** · **Print** · **Collapse/expand code** · **Reading progress** + read-time estimate.
✅ **Game Features tab** – every Bloxd.io feature, item usage table, secret code-only items with `api` examples.
✅ **Platform tab** – documentation of OUR OWN features: what each does, how it works, what code/tech powers it.

---

## 🛠️ Technologies
- **Framework**: [Next.js 14](https://nextjs.org/) App Router, static export (`output: 'export'`)
- **Styling**: Tailwind CSS + one global stylesheet (`src/app/globals.css`, CSS variables)
- **Docs**: [Marked](https://marked.js.org/) + [Prism.js](https://prismjs.com/)
- **Data**: GitHub REST API at runtime (no build-time secrets)

---

## 🚀 Local Run & Deploy
```bash
npm install
npm run dev      # dev server
npm run build    # static export → out/
```
Deploy the `out/` folder to Netlify (build command `npm run build`, publish directory `out`). No API keys required. See [`Tutorial_Build.txt`](../Tutorial_Build.txt) at the workspace root for the full Netlify guide.

---

## 🙏 Credits
- **Company**: Players · **Owner/Author**: [FallenNightA](https://github.com/FallenNightA)
- **Official account**: [HidayatBelajar319](https://github.com/HidayatBelajar319) (made by FallenNightA)
- **API Data**: [Bloxdy/code-api](https://github.com/Bloxdy/code-api) · **Models**: [Bloxdy/texture-packs](https://github.com/Bloxdy/texture-packs)
- Main site: [https://bloxdutility.netlify.app/](https://bloxdutility.netlify.app/) · See [LICENSE.md](../LICENSE.md)
