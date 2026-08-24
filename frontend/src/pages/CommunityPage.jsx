import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Hash,
  Send,
  Users,
  MessageCircle,
  ChevronRight,
  Mail,
  Shield,
  User,
  MessageSquare,
} from "lucide-react";

import { socket } from "../lib/socket.js";

import {
  fetchSections,
  fetchMessages,
  sendMessage,
  fetchSectionMembers,
  fetchDirectConversations,
  fetchDirectMessages,
  sendDirectMessage,
} from "../store/chatActions";

import {
  setSelectedSection,
  addMessage,
  setSelectedDirectUser,
  addDirectMessage,
} from "../store/chatSlice";

const CommunityPage = () => {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");

  const {
    sections,
    selectedSection,
    messages,
    members,

    isLoadingSections,
    isLoadingMessages,
    isLoadingMembers,
    isSendingMessage,

    conversations,
    selectedDirectUser,
    directMessages,

    isLoadingConversations,
    isLoadingDirectMessages,
    isSendingDirectMessage,
  } = useSelector((state) => state.chat);

  const { authUser } = useSelector((state) => state.auth);

  const safeMembers = Array.isArray(members) ? members : [];
  const safeConversations = Array.isArray(conversations)
    ? conversations
    : [];

  const safeDirectMessages = Array.isArray(directMessages)
    ? directMessages
    : [];

  const isDirectChat = Boolean(selectedDirectUser);

  /* ================= INITIAL FETCH ================= */

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(fetchDirectConversations());
  }, [dispatch]);

  /* ================= SECTION SOCKET ================= */

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        selectedSection &&
        message.section_id === selectedSection.id
      ) {
        dispatch(addMessage(message));
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [dispatch, selectedSection]);

  /* ================= DIRECT MESSAGE SOCKET ================= */

  useEffect(() => {
    const handleNewDirectMessage = (message) => {
      if (
        selectedDirectUser &&
        (
          message.sender_id === selectedDirectUser.id ||
          message.receiver_id === selectedDirectUser.id
        )
      ) {
        dispatch(addDirectMessage(message));
      }

      dispatch(fetchDirectConversations());
    };

    socket.on(
      "new_direct_message",
      handleNewDirectMessage
    );

    return () => {
      socket.off(
        "new_direct_message",
        handleNewDirectMessage
      );
    };
  }, [dispatch, selectedDirectUser]);

  /* ================= SELECT SECTION ================= */

  const handleSelectSection = (section) => {
    // Leave direct chat
    dispatch(setSelectedDirectUser(null));

    // Select section
    dispatch(setSelectedSection(section));

    dispatch(fetchMessages(section.id));
    dispatch(fetchSectionMembers(section.id));

    socket.emit("join_section", section.id);

    console.log(`Joined section: ${section.id}`);
  };

  /* ================= SELECT DIRECT USER ================= */

  const handleSelectDirectUser = (user) => {
    // Leave section chat
    dispatch(setSelectedSection(null));

    // Select user
    dispatch(setSelectedDirectUser(user));

    dispatch(fetchDirectMessages(user.id));

    console.log(`Opened direct chat with: ${user.full_name}`);
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    if (isDirectChat) {
      dispatch(
        sendDirectMessage(
          selectedDirectUser.id,
          content
        )
      );
    } else if (selectedSection) {
      dispatch(
        sendMessage(
          selectedSection.id,
          content
        )
      );
    }

    setContent("");
  };

  /* ================= MEMBER MESSAGE ================= */

  const handleMemberMessage = (member) => {
    if (!authUser || member.id === authUser.id) return;

    const canMessage =
      (authUser.role === "admin" &&
        member.role === "student") ||
      (authUser.role === "student" &&
        member.role === "admin");

    if (!canMessage) return;

    handleSelectDirectUser(member);
  };

  /* ================= MEMBER POPOVER ================= */

  const MemberProfilePopover = ({ member }) => {
    const isAdmin = member.role === "admin";

    const canMessage =
      authUser &&
      member.id !== authUser.id &&
      (
        (authUser.role === "admin" &&
          member.role === "student") ||
        (authUser.role === "student" &&
          member.role === "admin")
      );

    return (
<div className="pointer-events-none absolute right-2 top-full z-50 mt-2 w-64 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xl">

          <div className="flex items-center gap-3">

            {member.profile_pic ? (
              <img
                src={member.profile_pic}
                alt={member.full_name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {member.full_name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate font-semibold">
                {member.full_name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-base-content/50">
                {isAdmin ? (
                  <Shield size={13} />
                ) : (
                  <User size={13} />
                )}

                <span>
                  {isAdmin ? "Admin" : "Student"}
                </span>
              </div>
            </div>

          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-base-content/60">
            <Mail size={15} />

            <span className="truncate">
              {member.email}
            </span>
          </div>

          <div className="mt-5">

            {canMessage ? (
              <button
                type="button"
                onClick={() =>
                  handleMemberMessage(member)
                }
                className="btn btn-primary btn-sm w-full gap-2"
              >
                <MessageCircle size={16} />
                Message
              </button>
            ) : (
              <div className="rounded-xl bg-base-200 px-3 py-2 text-center text-xs text-base-content/50">
                Private messaging unavailable
              </div>
            )}

          </div>

        </div>
      </div>
    );
  };

  /* ================= CHAT TITLE ================= */

  const activeChatName = isDirectChat
    ? selectedDirectUser.full_name
    : selectedSection?.name;

  const activeMessages = isDirectChat
    ? safeDirectMessages
    : messages;

  const isLoadingActiveMessages = isDirectChat
    ? isLoadingDirectMessages
    : isLoadingMessages;

  const isSendingActiveMessage = isDirectChat
    ? isSendingDirectMessage
    : isSendingMessage;

  const hasActiveChat =
    selectedSection || selectedDirectUser;

  return (
    <div className="h-[calc(100vh-120px)] min-h-[650px]">

      {/* PAGE HEADER */}

      <div className="mb-6">
        <p className="text-sm font-medium text-primary">
          COMMUNITY
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Community Chat
        </h1>

        <p className="mt-2 text-sm text-base-content/60">
          Connect, discuss, and learn together.
        </p>
      </div>

      {/* MAIN LAYOUT */}

      <div className="grid h-[calc(100%-100px)] min-h-[600px] grid-cols-1 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm lg:grid-cols-[260px_1fr_240px]">

        {/* ================= LEFT SIDEBAR ================= */}

        <aside className="flex flex-col border-r border-base-300">

          {/* SECTIONS HEADER */}

          <div className="border-b border-base-300 p-5">
            <div className="flex items-center gap-2">

              <MessageCircle
                size={19}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Your Sections
              </h2>

            </div>

            <p className="mt-1 text-xs text-base-content/50">
              Choose a group to start chatting
            </p>
          </div>

          {/* SECTIONS */}

          <div className="max-h-[40%] overflow-y-auto p-3">

            {isLoadingSections && (
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded-xl bg-base-200"
                  />
                ))}
              </div>
            )}

            {!isLoadingSections &&
              sections.map((section) => {
                const isActive =
                  selectedSection?.id === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      handleSelectSection(section)
                    }
                    className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200/50">
                      <Hash size={17} />
                    </div>

                    <span className="flex-1 truncate text-sm font-medium">
                      {section.name}
                    </span>

                    <ChevronRight
                      size={16}
                      className={
                        isActive
                          ? "translate-x-1"
                          : "opacity-40"
                      }
                    />

                  </button>
                );
              })}

          </div>

          {/* DIRECT MESSAGES */}

          <div className="border-t border-base-300">

            <div className="flex items-center gap-2 px-5 py-4">

              <MessageSquare
                size={18}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Direct Messages
              </h2>

            </div>

            <div className="overflow-y-auto px-3 pb-4">

              {isLoadingConversations && (
                <div className="space-y-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-12 animate-pulse rounded-xl bg-base-200"
                    />
                  ))}
                </div>
              )}

              {!isLoadingConversations &&
                safeConversations.map((user) => {
                  const isActive =
                    selectedDirectUser?.id === user.id;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        handleSelectDirectUser(user)
                      }
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                        isActive
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-200"
                      }`}
                    >

                      {user.profile_pic ? (
                        <img
                          src={user.profile_pic}
                          alt={user.full_name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base-200 text-sm font-semibold">
                          {user.full_name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {user.full_name}
                        </p>

                        <p
                          className={`text-xs ${
                            isActive
                              ? "text-primary-content/70"
                              : "text-base-content/50"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : "Student"}
                        </p>

                      </div>

                    </button>
                  );
                })}

              {!isLoadingConversations &&
                safeConversations.length === 0 && (
                  <p className="px-2 py-3 text-center text-xs text-base-content/50">
                    No conversations yet.
                  </p>
                )}

            </div>
          </div>

        </aside>

        {/* ================= MAIN CHAT ================= */}

        <main className="flex min-w-0 flex-col">

          {/* CHAT HEADER */}

          <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">

            {hasActiveChat ? (
              <div className="flex items-center gap-3">

                {isDirectChat ? (
                  selectedDirectUser.profile_pic ? (
                    <img
                      src={selectedDirectUser.profile_pic}
                      alt={selectedDirectUser.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {selectedDirectUser.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Hash size={20} />
                  </div>
                )}

                <div>

                  <h2 className="font-semibold">
                    {activeChatName}
                  </h2>

                  <p className="text-xs text-base-content/50">
                    {isDirectChat
                      ? selectedDirectUser.role === "admin"
                        ? "Admin"
                        : "Student"
                      : `${safeMembers.length} members`}
                  </p>

                </div>

              </div>
            ) : (
              <div>
                <h2 className="font-semibold">
                  Select a chat
                </h2>

                <p className="text-xs text-base-content/50">
                  Choose a section or conversation.
                </p>
              </div>
            )}

            {hasActiveChat && (
              <div className="hidden items-center gap-2 text-xs text-base-content/50 sm:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                Live
              </div>
            )}

          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto bg-base-200/30 px-5 py-6">

            {!hasActiveChat && (
              <div className="flex h-full flex-col items-center justify-center text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200">
                  <MessageCircle
                    size={30}
                    className="text-base-content/40"
                  />
                </div>

                <h3 className="font-semibold">
                  Welcome to Community
                </h3>

                <p className="mt-2 max-w-xs text-sm text-base-content/50">
                  Select a section or direct conversation
                  to start chatting.
                </p>

              </div>
            )}

            {hasActiveChat &&
              isLoadingActiveMessages && (
                <div className="space-y-5">

                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3"
                    >
                      <div className="h-9 w-9 animate-pulse rounded-full bg-base-300" />

                      <div className="space-y-2">
                        <div className="h-3 w-24 animate-pulse rounded bg-base-300" />
                        <div className="h-10 w-56 animate-pulse rounded-xl bg-base-300" />
                      </div>
                    </div>
                  ))}

                </div>
              )}

            {hasActiveChat &&
              !isLoadingActiveMessages &&
              activeMessages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageCircle size={26} />
                  </div>

                  <h3 className="font-semibold">
                    No messages yet
                  </h3>

                  <p className="mt-2 text-sm text-base-content/50">
                    Start the conversation.
                  </p>

                </div>
              )}

            {hasActiveChat &&
              !isLoadingActiveMessages &&
              activeMessages.map((message) => {
                const isOwnMessage =
                  message.sender_id === authUser?.id;

                return (
                  <div
                    key={message.id}
                    className={`mb-5 flex gap-3 ${
                      isOwnMessage
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >

                    {message.profile_pic ? (
                      <img
                        src={message.profile_pic}
                        alt={message.full_name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {message.full_name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}

                    <div
                      className={`min-w-0 ${
                        isOwnMessage
                          ? "items-end"
                          : ""
                      }`}
                    >

                      <div
                        className={`mb-1 flex items-center gap-2 ${
                          isOwnMessage
                            ? "justify-end"
                            : ""
                        }`}
                      >
                        <span className="text-sm font-semibold">
                          {message.full_name}
                        </span>

                        <span className="text-xs text-base-content/40">
                          {new Date(
                            message.created_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          isOwnMessage
                            ? "rounded-tr-sm bg-primary text-primary-content"
                            : "rounded-tl-sm bg-base-100"
                        }`}
                      >
                        {message.content}
                      </div>

                    </div>

                  </div>
                );
              })}

          </div>

          {/* MESSAGE INPUT */}

          {hasActiveChat && (
            <form
              onSubmit={handleSendMessage}
              className="border-t border-base-300 bg-base-100 p-4"
            >

              <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-3 py-2 focus-within:border-primary">

                <input
                  type="text"
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder={`Message ${activeChatName}`}
                  className="h-10 flex-1 bg-transparent px-2 text-sm outline-none"
                />

                <button
                  type="submit"
                  disabled={
                    isSendingActiveMessage ||
                    !content.trim()
                  }
                  className="btn btn-primary btn-sm rounded-lg"
                >
                  {isSendingActiveMessage ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <Send size={16} />

                      <span className="hidden sm:inline">
                        Send
                      </span>
                    </>
                  )}
                </button>

              </div>

            </form>
          )}

        </main>

        {/* ================= MEMBERS ================= */}

<aside className="relative hidden overflow-visible border-l border-base-300 xl:flex xl:flex-col">
          <div className="border-b border-base-300 p-5">

            <div className="flex items-center gap-2">

              <Users
                size={18}
                className="text-primary"
              />

              <h2 className="font-semibold">
                Members
              </h2>

              {selectedSection && (
                <span className="ml-auto rounded-full bg-base-200 px-2 py-0.5 text-xs text-base-content/60">
                  {safeMembers.length}
                </span>
              )}

            </div>

          </div>

          <div className="flex-1 overflow-y-auto p-3">

            {!selectedSection && (
              <p className="p-3 text-center text-sm text-base-content/50">
                Select a section to see members.
              </p>
            )}

            {selectedSection &&
              isLoadingMembers && (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2"
                    >
                      <div className="h-9 w-9 animate-pulse rounded-full bg-base-200" />

                      <div className="h-3 w-24 animate-pulse rounded bg-base-200" />
                    </div>
                  ))}
                </div>
              )}

            {selectedSection &&
              !isLoadingMembers &&
              safeMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative flex items-center gap-3 rounded-xl p-2 transition hover:bg-base-200"
                >

                  {member.profile_pic ? (
                    <img
                      src={member.profile_pic}
                      alt={member.full_name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                      {member.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium">
                      {member.full_name}
                    </p>

                    <p className="truncate text-xs text-base-content/50">
                      {member.role === "admin"
                        ? "Admin"
                        : "Student"}
                    </p>

                  </div>

                  <MemberProfilePopover
                    member={member}
                  />

                </div>
              ))}

            {selectedSection &&
              !isLoadingMembers &&
              safeMembers.length === 0 && (
                <p className="p-4 text-center text-sm text-base-content/50">
                  No members found.
                </p>
              )}

          </div>

        </aside>

      </div>
    </div>
  );
};

export default CommunityPage;