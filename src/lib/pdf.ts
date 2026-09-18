import { parseDocument, sanitizeFilename, type DocBlock } from "./document";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 56;

const WINANSI: Record<string, number> = {
  Ä: 0xc4,
  Ö: 0xd6,
  Ü: 0xdc,
  ä: 0xe4,
  ö: 0xf6,
  ü: 0xfc,
  ß: 0xdf,
  "€": 0x80,
  "„": 0x84,
  "“": 0x93,
  "”": 0x94,
  "’": 0x92,
};

function pdfEscape(text: string) {
  return Array.from(text)
    .map((char) => {
      if (char === "\\" || char === "(" || char === ")") return `\\${char}`;
      const code = char.charCodeAt(0);
      if (code >= 32 && code <= 126) return char;
      const mapped = WINANSI[char] ?? (code < 256 ? code : 63);
      return `\\${mapped.toString(8).padStart(3, "0")}`;
    })
    .join("");
}

function wrapText(text: string, fontSize: number, width: number) {
  const max = Math.max(18, Math.floor(width / (fontSize * 0.5)));
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function blocksToLines(blocks: DocBlock[]) {
  const lines: { text: string; size: number; bold: boolean; gap: number }[] = [];
  for (const block of blocks) {
    if (block.type === "title") {
      for (const line of wrapText(block.text, 18, PAGE_WIDTH - MARGIN * 2)) {
        lines.push({ text: line, size: 18, bold: true, gap: 8 });
      }
      continue;
    }
    if (block.type === "heading") {
      lines.push({ text: "", size: 8, bold: false, gap: 10 });
      for (const line of wrapText(block.text, 12, PAGE_WIDTH - MARGIN * 2)) {
        lines.push({ text: line, size: 12, bold: true, gap: 6 });
      }
      continue;
    }
    if (block.type === "bullet") {
      for (const [index, line] of wrapText(block.text, 11, PAGE_WIDTH - MARGIN * 2 - 14).entries()) {
        lines.push({
          text: index === 0 ? `- ${line}` : `  ${line}`,
          size: 11,
          bold: false,
          gap: 4,
        });
      }
      continue;
    }
    for (const line of wrapText(block.text, 11, PAGE_WIDTH - MARGIN * 2)) {
      lines.push({ text: line, size: 11, bold: false, gap: 5 });
    }
    lines.push({ text: "", size: 8, bold: false, gap: 6 });
  }
  return lines;
}

function buildPdf(sections: { title?: string; blocks: DocBlock[] }[]) {
  const pages: string[][] = [[]];
  let y = PAGE_HEIGHT - MARGIN;

  function addPage() {
    pages.push([]);
    y = PAGE_HEIGHT - MARGIN;
  }

  function writeLine(text: string, size: number, bold: boolean, gap: number) {
    if (y < MARGIN + 24) addPage();
    if (!text) {
      y -= gap;
      return;
    }
    const font = bold ? "F2" : "F1";
    pages[pages.length - 1].push(
      `BT /${font} ${size} Tf ${MARGIN} ${y} Td (${pdfEscape(text)}) Tj ET`,
    );
    y -= size + gap;
  }

  for (const [index, section] of sections.entries()) {
    if (index > 0) addPage();
    for (const line of blocksToLines(section.blocks)) {
      writeLine(line.text, line.size, line.bold, line.gap);
    }
  }

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  const pageIds = pages.map((_, index) => 3 + index);
  objects.push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  );

  const contentStart = 3 + pages.length;
  pages.forEach((ops, index) => {
    const contentId = contentStart + index;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${contentStart + pages.length} 0 R /F2 ${contentStart + pages.length + 1} 0 R >> >> >>`,
    );
  });
  pages.forEach((ops) => {
    const stream = ops.join("\n");
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(output.length);
    output += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = output.length;
  const xrefTable = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n `),
  ].join("\n");
  return `${output}${xrefTable}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
}

function downloadBlob(filename: string, bytes: string) {
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) buffer[i] = bytes.charCodeAt(i) & 0xff;
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 4_000);
}

export function downloadApplicationPdf({
  name,
  company,
  role,
  cv,
  letter,
}: {
  name: string;
  company: string;
  role: string;
  cv: string;
  letter: string;
}) {
  const filename = `${sanitizeFilename(`Bewerbung-${company}-${role}-${name}`) || "Bewerbung"}.pdf`;
  const bytes = buildPdf([
    { blocks: parseDocument(cv, true) },
    { blocks: parseDocument(letter, false) },
  ]);
  downloadBlob(filename, bytes);
}
