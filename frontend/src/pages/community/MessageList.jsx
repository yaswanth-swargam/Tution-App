import { useEffect, useRef } from "react";

const MessageList = ({
  messages,
  isLoadingMessages,
  authUser,
  isSearching,
  searchQuery,
}) => {
  const bottomRef = useRef(null);

  // Auto-scroll when a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
  const hasSearchQuery =
    isSearching && searchQuery.trim();

  return (
    <div className="flex-1 flex items-center justify-center px-6">

      <div className="text-center">

        <p className="text-base-content/60">

          {hasSearchQuery
            ? "No matching messages found"
            : "No messages yet"}

        </p>

        <p className="text-sm text-base-content/40 mt-1">

          {hasSearchQuery
            ? "Try searching with different words"
            : "Start the conversation 👋"}

        </p>

      </div>

    </div>
  );
}

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
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
              <div
                className={`max-w-[80%] md:max-w-[65%]`}
              >
                {/* Show sender name for received messages */}
                {!isSender && (
                  <p className="text-xs text-base-content/50 mb-1 ml-1">
                    {message.full_name}
                  </p>
                )}

                {/* Message bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl break-words ${
                    isSender
                      ? "bg-primary text-primary-content rounded-br-md"
                      : "bg-base-200 text-base-content rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>

                {/* Time */}
                <p
                  className={`text-[10px] text-base-content/40 mt-1 ${
                    isSender
                      ? "text-right mr-1"
                      : "text-left ml-1"
                  }`}
                >
                  {message.created_at
  ? new Date(message.created_at).toLocaleString([], {
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

        {/* Auto-scroll target */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;