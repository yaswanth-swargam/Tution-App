import { useEffect, useRef } from "react";
import {
  MessageCircle,
  FileText,
  Download,
  ExternalLink,
  File,
} from "lucide-react";

const MessageList = ({
  messages,
  authUser,
  isSearching,
  searchQuery,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const hasSearchQuery =
    isSearching && searchQuery.trim();

  const isEmpty =
    !messages || messages.length === 0;

  const isImage = (fileType) => {
    return fileType?.startsWith("image/");
  };

  const isPDF = (fileType) => {
    return fileType === "application/pdf";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-5 md:px-6">

      {isEmpty ? (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 text-center">

          <MessageCircle className="mb-3 h-12 w-12 text-base-content/20" />

          <p className="font-medium text-base-content/70">
            {hasSearchQuery
              ? "No matching messages found"
              : "No messages yet"}
          </p>

          <p className="mt-1 text-sm text-base-content/45">
            {hasSearchQuery
              ? "Try searching with different words"
              : "Start the conversation"}
          </p>

        </div>
      ) : (

        <div className="flex flex-col gap-4">

          {messages.map((message) => {

            const isSender =
              Number(message.sender_id) ===
              Number(authUser?.id);

            return (
              <div
                key={message.id}
                className={`flex ${
                  isSender
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-[80%] md:max-w-[65%]">

                  {/* SENDER NAME */}

                  {!isSender && (
                    <p className="mb-1 ml-1 text-xs text-base-content/50">
                      {message.full_name}
                    </p>
                  )}

                  {/* MESSAGE BUBBLE */}

                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isSender
                        ? "rounded-br-md bg-primary text-primary-content"
                        : "rounded-bl-md bg-base-200 text-base-content"
                    }`}
                  >

                    {/* TEXT CONTENT */}

                    {message.content && (
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}

                    {/* IMAGE */}

                    {message.file_url &&
                      isImage(message.file_type) && (
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={message.file_url}
                            alt={message.file_name || "Uploaded image"}
                            className={`max-h-80 w-full rounded-lg object-cover ${
                              message.content
                                ? "mt-3"
                                : ""
                            }`}
                          />
                        </a>
                      )}

                    {/* PDF */}

                    {message.file_url &&
                      isPDF(message.file_type) && (
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            message.content
                              ? "mt-3"
                              : ""
                          }`}
                        >

                          <FileText className="h-8 w-8 shrink-0" />

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-medium">
                              {message.file_name}
                            </p>

                            <p className="text-xs opacity-60">
                              PDF · {formatFileSize(message.file_size)}
                            </p>

                          </div>

                          <ExternalLink className="h-4 w-4 shrink-0" />

                        </a>
                      )}

                    {/* OTHER FILES */}

                    {message.file_url &&
                      !isImage(message.file_type) &&
                      !isPDF(message.file_type) && (
                        <a
                          href={message.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            message.content
                              ? "mt-3"
                              : ""
                          }`}
                        >

                          <File className="h-8 w-8 shrink-0" />

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-medium">
                              {message.file_name}
                            </p>

                            <p className="text-xs opacity-60">
                              {formatFileSize(message.file_size)}
                            </p>

                          </div>

                          <Download className="h-4 w-4 shrink-0" />

                        </a>
                      )}

                  </div>

                  {/* TIME */}

                  <p
                    className={`mt-1 text-[10px] text-base-content/40 ${
                      isSender
                        ? "mr-1 text-right"
                        : "ml-1 text-left"
                    }`}
                  >
                    {message.created_at
                      ? new Date(
                          message.created_at
                        ).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>

                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>
      )}

    </div>
  );
};

export default MessageList;