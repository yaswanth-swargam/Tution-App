import { useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const SectionChat = ({
  section,
  messages,
  isLoadingMessages,
  content,
  onContentChange,
  onSendMessage,
  isSendingMessage,
  authUser,
  onBack,
  onShowGroupInfo,
}) => {

  // =========================
  // MESSAGE SEARCH
  // =========================

  const [isSearching, setIsSearching] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

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


  const handleToggleSearch = () => {

    setIsSearching((prev) => !prev);

    // Clear search when closing
    if (isSearching) {
      setSearchQuery("");
    }
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ================= HEADER ================= */}

      <ChatHeader
        section={section}
        onBack={onBack}
        onShowGroupInfo={onShowGroupInfo}

        isSearching={isSearching}

        searchQuery={searchQuery}

        onSearchChange={setSearchQuery}

        onToggleSearch={handleToggleSearch}
      />


      {/* ================= MESSAGES ================= */}

      <MessageList
        messages={filteredMessages}
        isLoadingMessages={isLoadingMessages}
        authUser={authUser}

        isSearching={isSearching}
        searchQuery={searchQuery}
      />


      {/* ================= MESSAGE INPUT ================= */}

      <MessageInput
        content={content}
        onContentChange={onContentChange}
        onSendMessage={onSendMessage}
        isSendingMessage={isSendingMessage}
      />

    </div>
  );
};

export default SectionChat;