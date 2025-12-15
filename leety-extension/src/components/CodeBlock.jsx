import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ inline, className, children }) {
  const code = String(children).replace(/\n$/, "");
  if (inline) {
    return (
      <code className="bg-slate-700 text-emerald-300 px-1.5 py-0.5 rounded-md text-sm font-mono">
        {code}
      </code>
    );
  }

  if (!code.includes("\n") && code.length < 40) {
    return (
      <code className="bg-gray-700/60 text-blue-300 px-1.5 py-0.5 rounded text-sm">
        {code}
      </code>
    );
  }

  const language = className?.replace("language-", "") || "text";
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4">
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded"
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: "#020617",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "0.9rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
export default CodeBlock;