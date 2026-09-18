export type DocBlock =
  | { type: "title"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet"; text: string };

export function parseDocument(text: string, titled = false): DocBlock[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: DocBlock[] = [];
  let titleUsed = !titled;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (!titleUsed) {
      blocks.push({ type: "title", text: line.replace(/^#+\s*/, "") });
      titleUsed = true;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("- ")) {
      blocks.push({ type: "bullet", text: line.slice(2).trim() });
      continue;
    }
    blocks.push({ type: "paragraph", text: line });
  }

  return blocks;
}

export function sanitizeFilename(value: string) {
  return value
    .replace(/[^\wÄÖÜäöüß\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
