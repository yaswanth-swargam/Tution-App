import { useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatLayout from "./ChatLayout";

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMessages = normalizedQuery
    ? messages.filter((message) =>
        message.content?.toLowerCase().includes(normalizedQuery)
      )
    : messages;

  const handleToggleSearch = () => {
    setIsSearching((prev) => !prev);

    if (isSearching) {
      setSearchQuery("");
    }
  };

  return (
    <ChatLayout
      isLoading={isLoadingMessages}
      loadingText="Loading messages..."
      header={
        <ChatHeader
          section={section}
          onBack={onBack}
          onShowGroupInfo={onShowGroupInfo}
          isSearching={isSearching}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSearch={handleToggleSearch}
        />
      }
      footer={
        <MessageInput
  content={content}
  onContentChange={onContentChange}
  onSendMessage={onSendMessage}
  isSendingMessage={isSendingMessage}
  authUser={authUser}
/>
      }
    >
      <MessageList
        messages={filteredMessages}
        authUser={authUser}
        isSearching={isSearching}
        searchQuery={searchQuery}
      />
    </ChatLayout>
  );
};

export default SectionChat;
