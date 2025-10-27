# Repository Structure Graphs — Openwork

This folder contains two visual representations of the repository structure for `openwork/`.

Files:

- `repo-structure.dot` — Graphviz DOT file (high-level). Render with Graphviz:

  dot -Tpng repo-structure.dot -o repo-structure.png

- `REPO-STRUCTURE.mmd` — Mermaid flowchart (high-level). Copy the content into https://mermaid.live/ or any Markdown viewer that supports Mermaid to render.

Notes:

- The graphs highlight the canonical project root `openwork-platform/` and show duplicated/nested copies (e.g., `openwork-platform/frontend/openwork-platform/` and top-level `shared-ui/`).
- These are high-level graphs meant to make it easy to spot where duplicate copies live. They intentionally do not list every single file.

If you want:

- A full, file-by-file DOT that includes every file (large) — I can generate it but it will be big.
- A script to automatically diff the duplicated folders and produce a report of differing files.
- A cleaned branch that removes exact duplicate folders after you confirm diffs.
