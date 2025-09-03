import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import okaidia from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";
// register common languages
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";

SyntaxHighlighter.registerLanguage("tsx", tsx as any);
SyntaxHighlighter.registerLanguage("jsx", jsx as any);
SyntaxHighlighter.registerLanguage("typescript", typescript as any);
SyntaxHighlighter.registerLanguage("javascript", javascript as any);

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function simpleHighlight(code: string) {
  // very small fallback: escape and wrap in pre
  return escapeHtml(code);
}

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const lang = language || "tsx";

  try {
    return (
      <SyntaxHighlighter
        language={lang}
        style={okaidia as any}
        showLineNumbers={true}
        wrapLongLines={false}
        useInlineStyles={true}
        lineNumberStyle={{ color: "rgba(255,255,255,0.35)", paddingRight: 12 }}
        customStyle={{
          background: "#0b1220",
          borderRadius: 8,
          padding: 12,
          fontSize: 13,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
          whiteSpace: "pre",
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
  } catch (e) {
    // fallback: render escaped code inside a neutral pre
    const html = simpleHighlight(code);
    return (
      <pre className="code-block pretty" aria-hidden={false}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    );
  }
}
