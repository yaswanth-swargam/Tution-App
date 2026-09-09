
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AISidebar from "../components/ai/AISidebar.jsx";
import AIHeader from "../components/ai/AIHeader.jsx";
import AIChat from "../components/ai/AIChat.jsx";

import {
  fetchConversations,
} from "../store/aiActions.js";

const AIPage = () => {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const {
    conversations,
    currentConversationId,
  } = useSelector((state) => state.ai);

  // ===============================
  // Load Conversations
  // ===============================

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // ===============================
  // Current Conversation
  // ===============================

  const currentConversation = conversations.find(
    (conversation) =>
      conversation.id === currentConversationId
  );

  const currentTitle =
    currentConversation?.title || "AI Assistant";

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-base-100">
      {/* Sidebar */}

      <AISidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}

      <main className="flex min-w-0 flex-1 flex-col">
        <AIHeader
          title={currentTitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="min-h-0 flex-1">
          <AIChat />
        </div>
      </main>
    </div>
  );
};

export default AIPage;
