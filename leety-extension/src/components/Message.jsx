import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl shadow
          ${isUser ? "bg-blue-600 text-white px-4 py-3" : "bg-slate-800 text-gray-100 p-4"}
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-3 mb-1">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="leading-relaxed my-2">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-6 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-6 my-2">{children}</ol>
              ),
              li: ({ children }) => <li className="my-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-3">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="border border-gray-700">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-700 bg-gray-700 px-3 py-2">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-700 px-3 py-2">
                  {children}
                </td>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default Message;