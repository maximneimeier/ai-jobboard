import { parseDocument } from "@/lib/document";

export function DocumentPreview({
  text,
  titled = false,
}: {
  text: string;
  titled?: boolean;
}) {
  const blocks = parseDocument(text, titled);

  return (
    <div className="print-sheet min-h-[640px] rounded-lg bg-canvas px-6 py-8 ring-1 ring-hairline-soft md:px-10 md:py-10">
      {blocks.length === 0 ? (
        <p className="text-[14px] text-muted">Noch kein Text.</p>
      ) : (
        blocks.map((block, index) => {
          if (block.type === "title") {
            return (
              <h2
                key={`${block.type}-${index}`}
                className="font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "heading") {
            return (
              <h3
                key={`${block.type}-${index}`}
                className="mt-6 text-[13px] font-semibold tracking-[0.72px] text-muted uppercase"
              >
                {block.text}
              </h3>
            );
          }
          if (block.type === "bullet") {
            return (
              <p
                key={`${block.type}-${index}`}
                className="mt-1.5 flex gap-2 text-[14px] leading-6 text-ink"
              >
                <span className="text-muted">-</span>
                <span>{block.text}</span>
              </p>
            );
          }
          return (
            <p
              key={`${block.type}-${index}`}
              className="mt-3 text-[14px] leading-6 text-body first:mt-0"
            >
              {block.text}
            </p>
          );
        })
      )}
    </div>
  );
}
