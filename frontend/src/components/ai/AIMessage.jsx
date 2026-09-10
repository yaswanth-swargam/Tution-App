import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 px-4 py-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
          <img
            src="/genie.png"
            alt="Genie"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <div
        className={`max-w-[80%] break-words ${
          isUser
            ? "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-content"
            : "min-w-0 px-1 py-1 text-base-content"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-3 mt-1 text-xl font-bold">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="mb-2 mt-4 text-lg font-semibold">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mb-2 mt-3 text-base font-semibold">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul className="mb-3 ml-5 list-disc space-y-1">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="mb-3 ml-5 list-decimal space-y-1">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li>{children}</li>
                ),

                strong: ({ children }) => (
                  <strong className="font-semibold">
                    {children}
                  </strong>
                ),

                code: ({ inline, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        className="rounded bg-base-300 px-1.5 py-0.5 text-[0.85em]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      className="block overflow-x-auto rounded-lg bg-base-300 p-3 text-xs leading-5"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                pre: ({ children }) => (
                  <pre className="mb-3 overflow-x-auto rounded-lg">
                    {children}
                  </pre>
                ),

                blockquote: ({ children }) => (
                  <blockquote className="mb-3 border-l-4 border-primary/40 pl-4 italic opacity-80">
                    {children}
                  </blockquote>
                ),

                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),

                table: ({ children }) => (
                  <div className="mb-3 overflow-x-auto">
                    <table className="table table-sm">
                      {children}
                    </table>
                  </div>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-300 text-base-content">
          <User size={17} />
        </div>
      )}
    </div>
  );
};

export default AIMessage;