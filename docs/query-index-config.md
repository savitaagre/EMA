# Blog Query Index — Configuration

The **Article List** block (`blocks/article-list/`) reads a query index at
`/blog/query-index.json` and paginates the results (10 cards + "Load more").

This document records how that index is configured. There are two layers:

1. **Repo file** — `helix-query.yaml` at the project root (committed).
2. **Hosted config at [tools.aem.live](https://tools.aem.live)** — the
   authoritative indexing configuration for this project.

> **Why both?** This project's `AGENTS.md` states `helix-query.yaml` is
> *retired* and that "config lives at tools.aem.live." The committed
> `helix-query.yaml` documents the intended index shape and works with the
> standard indexer, **but if the site's indexing is driven by the hosted admin
> service, the YAML may be ignored in production** — the same definition must be
> entered at tools.aem.live to take effect. Keep the two in sync.

**Project:** `savitaagre` / `EMA` (content source: `https://content.da.live/savitaagre/ema/`)

---

## What to configure at tools.aem.live

Open the project at https://tools.aem.live, go to the **Index / Query Index**
configuration, and define an index equivalent to the committed
`helix-query.yaml`:

| Field | Value | Notes |
|-------|-------|-------|
| **Index name** | `blog` | |
| **Include** | `/blog/**` | all blog article pages |
| **Exclude** | `/blog` | the blog listing page itself is not an article |
| **Target** | `/blog/query-index.json` | the JSON the Article List block fetches |

### Properties (columns emitted per row)

| Property | Source | Populated now? |
|----------|--------|----------------|
| `path` | page path (implicit) | ✅ yes |
| `title` | `<meta property="og:title">` (falls back to page title) | ✅ yes |
| `description` | `<meta name="description">` | ✅ yes |
| `image` | `<meta property="og:image">` | ✅ yes — emitted by the blog transformer |
| `category` | `<meta name="category">` | ✅ yes — emitted by the blog transformer |
| `date` | `<meta name="publication-date">` | ✅ yes — emitted by the blog transformer |
| `lastModified` | response `last-modified` header (auto) | ✅ yes (set at publish) |

The blog import transformer (`tools/importer/transformers/wknd-trendsetters-blog-metadata.js`)
harvests the masthead category pill, byline date, and cover image and writes them
as page metadata (`Category`, `Publication Date`, `Image`) — which EDS emits as
`<meta name="category">`, `<meta name="publication-date">`, and `<meta property="og:image">`.
So all Article List card fields (image, tag, date) now populate. The block still
degrades gracefully if any field is absent.

---

## Image / category / date — DONE

The blog pages now emit `Image`, `Category`, and `Publication Date` metadata:

1. ✅ `wknd-trendsetters-blog-metadata.js` harvests them from the masthead and
   writes a metadata block; the 7 blog pages were re-imported with `--force`.
2. ✅ `image`, `category`, and `date` properties added to `helix-query.yaml`.
3. ⚠️ **Remaining human step:** add those same three properties to the
   tools.aem.live index config, then re-publish so the indexer regenerates
   `/blog/query-index.json` with the new columns.

---

## How it goes live

Once the blog pages and this config are published, the EDS indexer generates
`/blog/query-index.json` automatically on publish — no code change needed. The
Article List block (default index path `/blog/query-index.json`) picks it up.

To point the block at a different index, set its first authoring cell to the
index path; the second cell is an optional path-prefix filter (e.g. `/blog/`).

---

## Local development note

The local dev server does **not** generate a query index — it is produced by
the hosted indexer at publish time. The `content/query-index.json` and
`content/blog/query-index.json` files in this repo are **throwaway test
fixtures** used to exercise the block locally; they are not the production
index and can be ignored.
