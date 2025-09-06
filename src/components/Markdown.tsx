import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const lang = match ? match[1] : "tsx";
          const value = String(children).replace(/\n$/, "");
          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          return <CodeBlock code={value} language={lang} />;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
