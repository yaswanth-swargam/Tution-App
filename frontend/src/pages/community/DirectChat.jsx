import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Send,
  MessageCircle,
  Search,
  X,
} from "lucide-react";

const DirectChat = ({
  selectedUser,
  messages = [],
  authUser,
  onBack,
  onSendMessage,
  isLoading,
  isSending,
}) => {
  const [content, setContent] = useState("");

  // =========================
  // MESSAGE SEARCH
  // =========================

  const [isSearching, setIsSearching] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const messagesEndRef = useRef(null);

  const normalizedQuery =
    searchQuery.trim().toLowerCase();

  const filteredMessages =
    normalizedQuery
      ? messages.filter((message) =>
          message.content
            ?.toLowerCase()
            .includes(normalizedQuery)
        )
      : messages;

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [filteredMessages]);

  // =========================
  // TOGGLE SEARCH
  // =========================

  const handleToggleSearch = () => {
    setIsSearching((prev) => !prev);

    if (isSearching) {
      setSearchQuery("");
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSending) {
      return;
    }

    onSendMessage(trimmedContent);

    setContent("");
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* ================= HEADER ================= */}

      <div className="border-b border-base-300 shrink-0">

        {isSearching ? (

          /* SEARCH MODE */

          <div className="flex items-center gap-3 px-4 py-4">

            <div className="relative flex-1">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-base-content/40
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search messages..."
                className="
                  input
                  input-bordered
                  w-full
                  pl-10
                "
                autoFocus
              />

            </div>

            <button
              onClick={handleToggleSearch}
              className="btn btn-ghost btn-circle btn-sm"
              title="Close search"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        ) : (

          /* NORMAL HEADER */

          <div className="flex items-center gap-4 px-4 py-4">

            <button
              onClick={onBack}
              className="btn btn-ghost btn-sm btn-circle"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>


            {/* AVATAR */}

            <div className="avatar placeholder">

              <div className="
                w-11
                rounded-full
                bg-primary
                text-primary-content
                overflow-hidden
              ">

                {selectedUser?.profile_pic ? (

                  <img
                    src={selectedUser.profile_pic}
                    alt={selectedUser.full_name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <span className="text-lg">

                    {selectedUser?.full_name
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </span>

                )}

              </div>

            </div>


            {/* USER INFO */}

            <div className="flex-1 min-w-0">

              <h2 className="
                font-semibold
                text-base-content
                truncate
              ">
                {selectedUser?.full_name}
              </h2>

              <p className="
                text-xs
                text-base-content/50
              ">
                {selectedUser?.role === "admin"
                  ? "Administrator"
                  : selectedUser?.email}
              </p>

            </div>


            {/* SEARCH BUTTON */}

            <button
              onClick={handleToggleSearch}
              className="
                btn
                btn-ghost
                btn-sm
                btn-circle
              "
              title="Search messages"
              aria-label="Search messages"
            >
              <Search className="w-5 h-5" />
            </button>

          </div>

        )}

      </div>


      {/* ================= MESSAGES ================= */}

      <div className="
        flex-1
        min-h-0
        overflow-y-auto
        px-4
        py-5
        space-y-4
      ">

        {isLoading ? (

          <div className="flex justify-center py-10">

            <span className="
              loading
              loading-spinner
              loading-lg
              text-primary
            " />

          </div>

        ) : filteredMessages.length === 0 ? (

          <div className="
            h-full
            flex
            flex-col
            items-center
            justify-center
            text-center
          ">

            <MessageCircle
              className="
                w-14
                h-14
                text-base-content/20
                mb-4
              "
            />

            <h3 className="
              font-semibold
              text-base-content/70
            ">

              {normalizedQuery
                ? "No matching messages found"
                : "No messages yet"}

            </h3>

            <p className="
              text-sm
              text-base-content/50
              mt-1
            ">

              {normalizedQuery
                ? "Try searching with different words"
                : (
                  <>
                    Start the conversation with{" "}
                    {selectedUser?.full_name}
                  </>
                )}

            </p>

          </div>

        ) : (

          filteredMessages.map((message) => {

            const isMine =
              Number(message.sender_id) ===
              Number(authUser?.id);

            return (

              <div
                key={message.id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    isMine
                      ? "bg-primary text-primary-content rounded-br-md"
                      : "bg-base-200 text-base-content rounded-bl-md"
                  }`}
                >

                  <p className="
                    text-sm
                    whitespace-pre-wrap
                    break-words
                  ">
                    {message.content}
                  </p>


                  <p
                    className={`text-[11px] mt-1 ${
                      isMine
                        ? "text-primary-content/70"
                        : "text-base-content/40"
                    }`}
                  >
                    {formatDateTime(
                      message.created_at
                    )}
                  </p>

                </div>

              </div>

            );
          })

        )}

        <div ref={messagesEndRef} />

      </div>


      {/* ================= INPUT ================= */}

      <form
        onSubmit={handleSubmit}
        className="
          border-t
          border-base-300
          p-4
          shrink-0
        "
      >

        <div className="flex items-center gap-3">

          <input
            type="text"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder={`Message ${
              selectedUser?.full_name || ""
            }`}
            className="
              input
              input-bordered
              flex-1
            "
            disabled={isSending}
          />

          <button
            type="submit"
            disabled={
              !content.trim() ||
              isSending
            }
            className="
              btn
              btn-primary
              btn-circle
              shrink-0
            "
          >

            {isSending ? (

              <span className="
                loading
                loading-spinner
                loading-sm
              " />

            ) : (

              <Send className="w-5 h-5" />

            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default DirectChat;