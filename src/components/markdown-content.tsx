import type { ReactNode } from "react";

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function inlineMarkdown(value: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
  return value
    .split(pattern)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a
            key={index}
            href={link[2]}
            className="font-medium text-brand underline decoration-brand/40 underline-offset-4"
            target={link[2].startsWith("http") ? "_blank" : undefined}
            rel={link[2].startsWith("http") ? "noreferrer" : undefined}
          >
            {link[1]}
          </a>
        );
      }
      return part.split("\n").map((line, lineIndex, lines) => (
        <span key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ));
    });
}

export function MarkdownContent({ value, compact = false }: { value: string; compact?: boolean }) {
  const blocks = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (blocks.length === 0) return <p className="text-sm text-muted-foreground">No content yet.</p>;

  return (
    <div
      className={
        compact
          ? "space-y-5 text-sm leading-7 text-muted-foreground"
          : "space-y-6 text-[16px] leading-[1.9] text-muted-foreground"
      }
    >
      {blocks.map((block, index) => {
        const heading = block.match(/^(#{1,3})\s+(.+)$/s);
        if (heading) {
          const level = heading[1].length;
          const text = heading[2].trim();
          if (level === 1)
            return (
              <h1
                key={index}
                id={headingId(text)}
                className="scroll-mt-36 pt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {inlineMarkdown(text)}
              </h1>
            );
          if (level === 2)
            return (
              <h2
                key={index}
                id={headingId(text)}
                className="scroll-mt-36 pt-5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {inlineMarkdown(text)}
              </h2>
            );
          return (
            <h3
              key={index}
              id={headingId(text)}
              className="scroll-mt-36 pt-3 font-display text-xl font-bold tracking-tight text-foreground"
            >
              {inlineMarkdown(text)}
            </h3>
          );
        }
        if (block.split("\n").every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="space-y-2 pl-1">
              {block.split("\n").map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{inlineMarkdown(item.replace(/^[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.split("\n").every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={index} className="space-y-2 pl-1">
              {block.split("\n").map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="font-mono text-xs text-brand">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span>{inlineMarkdown(item.replace(/^\d+\.\s+/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-brand bg-card/50 px-6 py-5 font-display text-lg leading-relaxed text-foreground"
            >
              {inlineMarkdown(block.replace(/^>\s*/, ""))}
            </blockquote>
          );
        }
        return <p key={index}>{inlineMarkdown(block)}</p>;
      })}
    </div>
  );
}
