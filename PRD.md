# Product Requirements Document: MD Converter

## Overview

MD Converter is a desktop-style web application that converts `.docx`, `.pdf`, and `.xlsx` files into clean, well-structured Markdown (`.md`) files. Users upload one or more files through a drag-and-drop interface, preview the converted Markdown, and download the results — all client-side with no server uploads required.

---

## Problem Statement

Converting documents to Markdown today requires either:
- Multiple single-purpose CLI tools with inconsistent output quality
- Online services that upload files to third-party servers (privacy concern)
- Manual copy-paste-and-reformat workflows

There is no single, privacy-respecting tool that handles all three common document formats with high-fidelity Markdown output.

---

## Goals

1. **One tool, three formats** — Accept `.docx`, `.pdf`, and `.xlsx` files and produce clean Markdown
2. **Privacy-first** — All conversion happens in the browser; no files leave the user's machine
3. **High fidelity** — Preserve document structure: headings, lists, tables, links, images, code blocks, bold/italic
4. **Batch support** — Convert multiple files in one session
5. **Instant preview** — Show rendered Markdown side-by-side with raw output before download

---

## Target Users

- Developers migrating documentation into Git-based systems
- Technical writers converting legacy docs to Markdown for static site generators
- Anyone who needs quick, private document-to-Markdown conversion

---

## Functional Requirements

### FR-1: File Input

| ID | Requirement |
|----|-------------|
| FR-1.1 | Accept files via drag-and-drop zone or file picker dialog |
| FR-1.2 | Support `.docx`, `.pdf`, and `.xlsx` file extensions |
| FR-1.3 | Support batch upload (multiple files at once) |
| FR-1.4 | Validate file type on selection; reject unsupported formats with clear error message |
| FR-1.5 | Display file name, size, and type for each queued file |

### FR-2: DOCX Conversion

| ID | Requirement |
|----|-------------|
| FR-2.1 | Convert Word headings (Heading 1–6) to Markdown `#` headings |
| FR-2.2 | Convert bold, italic, underline, strikethrough to Markdown equivalents |
| FR-2.3 | Convert numbered and bulleted lists (including nested) |
| FR-2.4 | Convert tables to Markdown pipe tables |
| FR-2.5 | Convert hyperlinks to `[text](url)` format |
| FR-2.6 | Extract embedded images, convert to base64 data URIs or offer as separate downloads |
| FR-2.7 | Preserve code blocks / monospace text as fenced code blocks |

### FR-3: PDF Conversion

| ID | Requirement |
|----|-------------|
| FR-3.1 | Extract text content with reading-order preservation |
| FR-3.2 | Detect and convert headings based on font size/weight heuristics |
| FR-3.3 | Detect and convert lists (bulleted and numbered) |
| FR-3.4 | Detect and convert tables to Markdown pipe tables |
| FR-3.5 | Handle multi-column layouts by linearizing to single-column reading order |
| FR-3.6 | Handle scanned/image-based PDFs gracefully — show warning that OCR is not supported (v1) |

### FR-4: XLSX Conversion

| ID | Requirement |
|----|-------------|
| FR-4.1 | Convert each sheet to a separate Markdown section with `## Sheet Name` heading |
| FR-4.2 | Convert cell data to Markdown pipe tables |
| FR-4.3 | Respect merged cells by expanding into the top-left cell value |
| FR-4.4 | Preserve number formatting where possible (dates, currency, percentages) |
| FR-4.5 | Handle empty rows/columns by trimming trailing blanks |
| FR-4.6 | Support `.xlsx` and `.csv` formats |

### FR-5: Output & Preview

| ID | Requirement |
|----|-------------|
| FR-5.1 | Display raw Markdown in an editable text area |
| FR-5.2 | Display rendered Markdown preview (HTML) side-by-side |
| FR-5.3 | Copy raw Markdown to clipboard with one click |
| FR-5.4 | Download individual `.md` files |
| FR-5.5 | Download all converted files as a `.zip` archive |
| FR-5.6 | Allow user to edit raw Markdown before downloading |

### FR-6: Batch & Queue

| ID | Requirement |
|----|-------------|
| FR-6.1 | Show conversion status per file: queued, converting, done, error |
| FR-6.2 | Allow removing individual files from the queue |
| FR-6.3 | Process files sequentially to avoid browser memory issues |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Client-side only** — zero file uploads to any server |
| NFR-2 | **Performance** — Convert a 50-page DOCX in under 5 seconds on modern hardware |
| NFR-3 | **File size limit** — Handle files up to 50 MB; show warning for larger files |
| NFR-4 | **Browser support** — Chrome, Edge, Firefox (latest 2 versions), Safari 16+ |
| NFR-5 | **Responsive** — Usable on tablet-width screens (768px+) |
| NFR-6 | **Accessibility** — WCAG 2.1 AA compliance for all interactive elements |
| NFR-7 | **No external dependencies at runtime** — all conversion libraries bundled |

---

## Tech Stack (Recommended)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) or Vite + React |
| DOCX parsing | `mammoth.js` |
| PDF parsing | `pdf.js` (Mozilla) |
| XLSX parsing | `SheetJS (xlsx)` |
| Markdown rendering | `react-markdown` + `remark-gfm` |
| Markdown editing | `@uiw/react-md-editor` or `textarea` |
| ZIP download | `JSZip` + `file-saver` |
| Styling | Tailwind CSS |

---

## UI Wireframe (Text)

```
┌─────────────────────────────────────────────────────┐
│  MD Converter                          [Dark/Light] │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌───────────────────────────────────────────┐     │
│   │                                           │     │
│   │     Drop files here or click to browse    │     │
│   │     .docx  .pdf  .xlsx  .csv              │     │
│   │                                           │     │
│   └───────────────────────────────────────────┘     │
│                                                     │
│   Files:                                            │
│   ┌──────────────────────────────────┬────────┐     │
│   │ report.docx (2.3 MB)            │ ✓ Done │     │
│   │ data.xlsx (540 KB)              │ ⟳ ...  │     │
│   │ manual.pdf (12 MB)              │ Queued │     │
│   └──────────────────────────────────┴────────┘     │
│                                                     │
│   ┌──────────────────┬──────────────────────┐       │
│   │  Raw Markdown    │  Preview             │       │
│   │                  │                      │       │
│   │  # Report Title  │  Report Title        │       │
│   │  ## Section 1    │  ────────────        │       │
│   │  Some text...    │  Section 1           │       │
│   │                  │  Some text...        │       │
│   │                  │                      │       │
│   └──────────────────┴──────────────────────┘       │
│                                                     │
│   [Copy to Clipboard]  [Download .md]  [Download All ZIP] │
└─────────────────────────────────────────────────────┘
```

---

## Milestones

| Phase | Scope | Target |
|-------|-------|--------|
| **v0.1** | Project setup, drag-and-drop UI, DOCX conversion | Week 1 |
| **v0.2** | XLSX/CSV conversion, batch queue | Week 2 |
| **v0.3** | PDF conversion, preview pane | Week 3 |
| **v0.4** | Editing, clipboard, ZIP download, dark mode | Week 4 |
| **v1.0** | Polish, accessibility audit, browser testing, deploy | Week 5 |

---

## Future Considerations (Post v1)

- **OCR support** for scanned PDFs (via Tesseract.js)
- **Custom conversion rules** (e.g., map specific Word styles to custom Markdown)
- **Image extraction** as separate files in ZIP download
- **CLI version** using the same conversion core (Node.js)
- **Google Docs / Sheets URL import** via public export links
- **Obsidian / Notion flavor** Markdown output options

---

## Success Metrics

- Conversion accuracy: 90%+ structural fidelity vs. source document (manual spot-check)
- File support: handles 95% of standard DOCX/PDF/XLSX files without errors
- Performance: p95 conversion time under 5s for files up to 20 pages
- Zero data leaves the browser (verifiable via network tab)
