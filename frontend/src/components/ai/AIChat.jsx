import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import AIEmptyState from "./AIEmptyState.jsx";
import AIMessage from "./AIMessage.jsx";
import AILoading from "./AILoading.jsx";
import AIInput from "./AIInput.jsx";

import {
  sendMessage,
  createConversation,
} from "../../store/aiActions.js";

const AIChat = () => {
  const dispatch = useDispatch();

  const {
    currentConversationId,
    messages,
    isLoadingConversation,
    isSendingMessage,
  } = useSelector((state) => state.ai);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      shouldAutoScrollRef.current = distanceFromBottom < 100;
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isSendingMessage]);

  const handleSendMessage = async (message) => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      const conversation = await dispatch(createConversation());

      if (!conversation) return;

      conversationId = conversation.id;
    }

    shouldAutoScrollRef.current = true;

    await dispatch(
      sendMessage({
        conversationId,
        message,
      })
    );
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  if (isLoadingConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <AIEmptyState onPromptClick={handlePromptClick} />
        ) : (
          <div className="mx-auto w-full max-w-4xl py-4">
            {messages.map((message) => (
              <AIMessage
                key={message.id}
                message={message}
              />
            ))}

            {isSendingMessage && <AILoading />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <AIInput
        onSend={handleSendMessage}
        disabled={isSendingMessage}
      />
    </div>
  );
};

export default AIChat;