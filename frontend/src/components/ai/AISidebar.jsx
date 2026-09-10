
import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  createConversation,
  deleteConversation,
  fetchConversation,
  renameConversation,
} from "../../store/aiActions.js";

const AISidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const {
    conversations,
    currentConversationId,
    isLoadingConversations,
  } = useSelector((state) => state.ai);

  // ===============================
  // New Conversation
  // ===============================

  const handleNewConversation = async () => {
    await dispatch(createConversation());

    onClose?.();
  };

  // ===============================
  // Select Conversation
  // ===============================

  const handleSelectConversation = (conversationId) => {
    if (conversationId === currentConversationId) {
      onClose?.();
      return;
    }

    dispatch(fetchConversation(conversationId));

    onClose?.();
  };

  // ===============================
  // Delete Conversation
  // ===============================

  const handleDeleteConversation = async (
    event,
    conversationId
  ) => {
    event.stopPropagation();

    await dispatch(deleteConversation(conversationId));
  };

  // ===============================
  // Rename Conversation
  // ===============================

  const handleStartRename = (event, conversation) => {
    event.stopPropagation();

    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveRename = async (
    event,
    conversationId
  ) => {
    event.stopPropagation();

    const title = editingTitle.trim();

    if (!title) return;

    await dispatch(
      renameConversation({
        conversationId,
        title,
      })
    );

    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <aside
      className={`flex h-full w-72 shrink-0 flex-col border-r border-base-300 bg-base-200 ${
        isOpen
          ? "fixed inset-y-0 left-0 z-50 shadow-xl lg:static lg:z-auto lg:shadow-none"
          : "hidden lg:flex"
      }`}
    >
      {/* ===============================
          Header
      =============================== */}

      <div className="flex h-16 shrink-0 items-center justify-between border-b border-base-300 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
  <img
    src="/genie.png"
    alt="Genie"
    className="h-10 w-10 object-contain"
  />
</div>

<div>
  <h2 className="text-sm font-semibold">
    Genie
  </h2>

  <p className="text-xs text-base-content/50">
    Your learning companion
  </p>
</div>
        </div>

        {/* Mobile Close */}

        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          aria-label="Close conversations"
        >
          <X size={19} />
        </button>
      </div>

      {/* ===============================
          New Chat
      =============================== */}

      <div className="p-2">
        <button
          type="button"
          onClick={handleNewConversation}
          className="btn btn-primary w-full gap-3"
        >
          <Plus size={17} />
          New Chat
        </button>
      </div>

      {/* ===============================
          Recent Chats
      =============================== */}

      <div className="px-4 pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-base-content/40">
          Recent Chats
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {isLoadingConversations ? (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <MessageSquare
              size={24}
              className="mb-3 text-base-content/30"
            />

            <p className="text-sm font-medium text-base-content/60">
              No conversations yet
            </p>

            <p className="mt-1 text-xs text-base-content/40">
              Start a new chat to begin.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive =
              conversation.id === currentConversationId;

            const isEditing =
              conversation.id === editingId;

            return (
              <div
                key={conversation.id}
                className={`group mb-1 flex items-center gap-1 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                }`}
              >
                {isEditing ? (
                  /* ===============================
                     Rename Mode
                  =============================== */

                  <div className="flex min-w-0 flex-1 items-center gap-1 px-2 py-1.5">
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={(event) =>
                        setEditingTitle(event.target.value)
                      }
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSaveRename(
                            event,
                            conversation.id
                          );
                        }

                        if (event.key === "Escape") {
                          handleCancelRename();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-md bg-base-100 px-2 py-1 text-sm text-base-content outline-none"
                    />

                    {/* Save */}

                    <button
                      type="button"
                      onClick={(event) =>
                        handleSaveRename(
                          event,
                          conversation.id
                        )
                      }
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-success/20"
                      aria-label="Save name"
                    >
                      <Check size={15} />
                    </button>

                    {/* Cancel */}

                    <button
                      type="button"
                      onClick={handleCancelRename}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-error/20"
                      aria-label="Cancel rename"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ===============================
                        Conversation
                    =============================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectConversation(
                          conversation.id
                        )
                      }
                      className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left"
                    >
                      <MessageSquare
                        size={16}
                        className="shrink-0 opacity-70"
                      />

                      <span className="truncate text-sm">
                        {conversation.title}
                      </span>
                    </button>

                    {/* Rename */}

                    <button
                      type="button"
                      onClick={(event) =>
                        handleStartRename(
                          event,
                          conversation
                        )
                      }
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100 ${
                        isActive
                          ? "hover:bg-primary-focus"
                          : "hover:bg-base-100"
                      }`}
                      aria-label="Rename conversation"
                    >
                      <Pencil size={14} />
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={(event) =>
                        handleDeleteConversation(
                          event,
                          conversation.id
                        )
                      }
                      className={`mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100 ${
                        isActive
                          ? "hover:bg-primary-focus"
                          : "hover:bg-error/10 hover:text-error"
                      }`}
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default AISidebar;
