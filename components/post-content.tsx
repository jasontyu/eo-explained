"use client"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-muted pl-4 italic my-4" {...props} />
        ),
        img: ({ node, ...props }) => (
          <img className="max-w-full h-auto rounded-lg my-6" {...props} alt={props.alt || ""} />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter style={nord} language={match[1]} PreTag="div" className="rounded-md my-6" {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          )
        },
        hr: ({ node, ...props }) => <hr className="my-8 border-muted" {...props} />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
        th: ({ node, ...props }) => <th className="border border-border px-4 py-2 text-left font-bold" {...props} />,
        td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

