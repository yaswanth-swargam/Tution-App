import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

import { socket } from "../lib/socket.js";

// =========================
// ASYNC REDUX ACTIONS
// =========================

import {
  fetchSections,
  fetchMessages,
  sendMessage,
  fetchSectionMembers,
  fetchAvailableStudents,
  addStudentToSection,
  removeStudentFromSection,

  fetchDirectConversations,
  fetchDirectMessages,
  sendDirectMessage,

  createSection,
  renameSection,
  deleteSection,
  markSectionMessagesAsRead
} from "../store/chatActions.js";

// =========================
// REDUX SLICE ACTIONS
// =========================

import {
  setSelectedSection,
  setSelectedDirectUser,
  addMessage,
  addDirectMessage,
  setOnlineUsers,
  incrementUnreadSectionCount,
  incrementUnreadDirectMessageCount,
  clearUnreadDirectMessageCount,
} from "../store/chatSlice.js";

// =========================
// COMPONENTS
// =========================

import SectionsView from "./community/SectionsView.jsx";
import SectionChat from "./community/SectionsChat.jsx";
import DirectChat from "./community/DirectChat.jsx";
import GroupInfoDrawer from "./community/GroupInfoDrawer.jsx";
import DirectConversationsPanel from "./community/DirectConversationsPanel.jsx";

const CommunityPage = () => {
  const dispatch = useDispatch();

  // =========================
  // LOCAL STATE
  // =========================

  const [content, setContent] =
    useState("");

  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState("");

  const [
    showGroupInfo,
    setShowGroupInfo,
  ] = useState(false);

  const [
    showAddStudentModal,
    setShowAddStudentModal,
  ] = useState(false);

  // community = sections page
  // messages = direct conversation list
  const [
    communityView,
    setCommunityView,
  ] = useState("community");

  // =========================
  // REDUX STATE
  // =========================

  const {
    // SECTION CHAT
    sections,
    selectedSection,
    messages,

    // MEMBERS
    members,
    availableStudents,
    onlineUsers,

    // DIRECT CHAT
    conversations,
    selectedDirectUser,
    directMessages,

    // SECTION LOADING
    isLoadingSections,
    isLoadingMessages,
    isSendingMessage,

    // MEMBER LOADING
    isLoadingMembers,
    isLoadingAvailableStudents,
    isAddingStudent,
    isRemovingStudent,

    // DIRECT MESSAGE LOADING
    isLoadingConversations,
    isLoadingDirectMessages,
    isSendingDirectMessage,

    unreadSectionCounts,
    unreadDirectMessageCounts,
  } = useSelector(
    (state) => state.chat
  );

  const { authUser } =
    useSelector(
      (state) => state.auth
    );

  // =========================
  // INITIAL DATA FETCH
  // =========================

  useEffect(() => {
    dispatch(fetchSections());

    dispatch(
      fetchDirectConversations()
    );
  }, [dispatch]);

  // =========================
  // SOCKET:
  // USER IDENTIFICATION
  // =========================

  useEffect(() => {
    if (!authUser?.id) return;

    const identifyUser = () => {
      socket.emit(
        "user_online",
        authUser.id
      );
    };

    if (socket.connected) {
      identifyUser();
    }

    socket.on(
      "connect",
      identifyUser
    );

    return () => {
      socket.off(
        "connect",
        identifyUser
      );
    };
  }, [authUser?.id]);

  // =========================
  // SOCKET:
  // ONLINE USERS
  // =========================

  useEffect(() => {
    const handleOnlineUsers =
      (users) => {
        dispatch(
          setOnlineUsers(users)
        );
      };

    socket.on(
      "online_users",
      handleOnlineUsers
    );

    return () => {
      socket.off(
        "online_users",
        handleOnlineUsers
      );
    };
  }, [dispatch]);

  
  
  useEffect(() => {
  const handleNewMessage = (message) => {
    const messageSectionId =
      Number(message.section_id);

    const currentSectionId =
      selectedSection
        ? Number(selectedSection.id)
        : null;

    console.log(
      "🔥 REALTIME NEW MESSAGE:",
      message
    );

    console.log(
      "📍 Message section:",
      messageSectionId,
      "Current section:",
      currentSectionId
    );

    // Only add the message if
    // the user is currently viewing that section.
    if (
      currentSectionId === messageSectionId
    ) {
      dispatch(
        addMessage(message)
      );
    }
  };

  socket.on(
    "new_message",
    handleNewMessage
  );

  return () => {
    socket.off(
      "new_message",
      handleNewMessage
    );
  };
}, [
  dispatch,
  selectedSection,
]);


// =========================
// SOCKET:
// UNREAD SECTION MESSAGES
// =========================

useEffect(() => {
  const handleUnreadMessage = (data) => {
    const sectionId =
      Number(data.section_id);

    const currentSectionId =
      selectedSection
        ? Number(selectedSection.id)
        : null;

    console.log(
      "🔴 REALTIME SECTION UNREAD:",
      data
    );

    // User is already inside this section.
    // Don't show an unread badge.
    if (
      currentSectionId === sectionId
    ) {
      return;
    }

    dispatch(
      incrementUnreadSectionCount(
        sectionId
      )
    );
  };

  socket.on(
    "section_message_unread",
    handleUnreadMessage
  );

  return () => {
    socket.off(
      "section_message_unread",
      handleUnreadMessage
    );
  };
}, [
  dispatch,
  selectedSection,
]);

  // =========================
  // SOCKET:
  // DIRECT MESSAGES
  // =========================

  useEffect(() => {
    const handleNewDirectMessage =
      (message) => {
        if (!authUser?.id) return;

        const otherUserId =
          Number(message.sender_id) ===
          Number(authUser.id)
            ? Number(message.receiver_id)
            : Number(message.sender_id);

        // Refresh conversation list
        dispatch(
          fetchDirectConversations()
        );

        // Add message only if that chat
        // is currently open
        if (
          selectedDirectUser &&
          Number(selectedDirectUser.id) ===
            otherUserId
        ) {
          const alreadyExists =
            directMessages.some(
              (msg) =>
                Number(msg.id) ===
                Number(message.id)
            );

          if (!alreadyExists) {
            dispatch(
              addDirectMessage(message)
            );
          }
        }
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
  }, [
    dispatch,
    authUser?.id,
    selectedDirectUser,
    directMessages,
  ]);




  // =========================
// SOCKET:
// UNREAD DIRECT MESSAGES
// =========================

useEffect(() => {
  const handleDirectMessageUnread = (data) => {
    if (!authUser?.id) {
      return;
    }

    const senderId =
      Number(data.user_id);

    const currentUserId =
      selectedDirectUser
        ? Number(selectedDirectUser.id)
        : null;

    console.log(
      "🔴 REALTIME DIRECT UNREAD:",
      data
    );

    // Already inside this conversation
    if (
      currentUserId === senderId
    ) {
      return;
    }

    dispatch(
      incrementUnreadDirectMessageCount(
        senderId
      )
    );
  };

  socket.on(
    "direct_message_unread",
    handleDirectMessageUnread
  );

  return () => {
    socket.off(
      "direct_message_unread",
      handleDirectMessageUnread
    );
  };
}, [
  dispatch,
  authUser?.id,
  selectedDirectUser,
]);
  // =========================
  // OPEN MESSAGES PAGE
  // =========================

  const handleOpenDirectMessages =
    () => {
      dispatch(
        setSelectedSection(null)
      );

      dispatch(
        setSelectedDirectUser(null)
      );

      setShowGroupInfo(false);

      setShowAddStudentModal(false);

      setCommunityView("messages");

      dispatch(
        fetchDirectConversations()
      );
    };

  // =========================
  // SELECT SECTION
  // =========================

  const handleSelectSection = (section) => {
  setCommunityView("community");

  // Close direct chat
  dispatch(
    setSelectedDirectUser(null)
  );

  // Open section
  dispatch(
    setSelectedSection(section)
  );

  // Fetch messages
  dispatch(
    fetchMessages(section.id)
  );

  // Mark section messages as read
  dispatch(
    markSectionMessagesAsRead(section.id)
  );

  // Fetch members
  dispatch(
    fetchSectionMembers(section.id)
  );

  // Admin:
  // fetch available students
  if (authUser?.role === "admin") {
    dispatch(
      fetchAvailableStudents(section.id)
    );
  }

  // Join section room
  const joinSection = () => {
    socket.emit(
      "join_section",
      section.id
    );
  };

  if (socket.connected) {
    joinSection();
  } else {
    socket.once(
      "connect",
      joinSection
    );
  }

  setSelectedStudentId("");

  setShowGroupInfo(false);

  setShowAddStudentModal(false);
};

  // =========================
  // SELECT DIRECT USER
  // =========================

  const handleSelectDirectUser = (user) => {
  // Close section
  dispatch(
    setSelectedSection(null)
  );

  // Select direct user
  dispatch(
    setSelectedDirectUser(user)
  );

  // Clear unread count for this conversation
  dispatch(
    clearUnreadDirectMessageCount(
      Number(user.id)
    )
  );

  // Fetch messages
  dispatch(
    fetchDirectMessages(user.id)
  );

  setShowGroupInfo(false);

  setShowAddStudentModal(false);
};
  // =========================
  // BACK TO COMMUNITY HOME
  // =========================

  const handleBackToCommunity =
    () => {
      dispatch(
        setSelectedSection(null)
      );

      dispatch(
        setSelectedDirectUser(null)
      );

      setShowGroupInfo(false);

      setShowAddStudentModal(false);

      setCommunityView("community");

      setContent("");
    };

  // =========================
  // BACK TO DIRECT MESSAGE LIST
  // =========================

  const handleBackToMessages =
    () => {
      dispatch(
        setSelectedDirectUser(null)
      );

      setCommunityView("messages");

      dispatch(
        fetchDirectConversations()
      );
    };

  // =========================
  // SEND SECTION MESSAGE
  // =========================

  const handleSendMessage = async (messageData) => {
  if (!selectedSection) {
    return;
  }

  try {
    await dispatch(
      sendMessage(
        selectedSection.id,
        messageData
      )
    );
  } catch (error) {
    console.error(
      "Failed to send section message:",
      error
    );
  }
};  // =========================
  // SEND DIRECT MESSAGE
  // =========================

  const handleSendDirectMessage = async (
  messageData
) => {
  if (!selectedDirectUser) {
    return;
  }

  if (
    !messageData.content?.trim() &&
    !messageData.file_url
  ) {
    return;
  }

  try {
    await dispatch(
      sendDirectMessage(
        selectedDirectUser.id,
        messageData
      )
    );

  } catch (error) {
    console.error(
      "Failed to send direct message:",
      error
    );
  }
};
  // =========================
  // CREATE SECTION
  // =========================

  const handleCreateSection =
    async (name) => {
      if (!name?.trim()) return;

      try {
        await dispatch(
          createSection(
            name.trim()
          )
        );
      } catch (error) {
        console.error(
          "Failed to create section:",
          error
        );
      }
    };

  // =========================
  // RENAME SECTION
  // =========================

  const handleRenameSection = async (name) => {
  if (!name || typeof name !== "string" || !name.trim()) {
    return;
  }

  try {
    await dispatch(
      renameSection(
        selectedSection.id,
        name.trim()
      )
    ).unwrap?.();

  } catch (error) {
    console.error(
      "Failed to rename section:",
      error
    );
  }
};

  // =========================
  // DELETE SECTION
  // =========================

  const handleDeleteSection =
    async () => {
      if (!selectedSection) return;

      const shouldDelete =
        window.confirm(
          `Are you sure you want to delete "${selectedSection.name}"?`
        );

      if (!shouldDelete) return;

      try {
        await dispatch(
          deleteSection(
            selectedSection.id
          )
        );

        dispatch(
          setSelectedSection(null)
        );

        setShowGroupInfo(false);

        setCommunityView("community");

      } catch (error) {
        console.error(
          "Failed to delete section:",
          error
        );

        throw error;
      }
    };

  // =========================
  // ADD STUDENT
  // =========================

  const handleAddStudent =
    () => {
      if (
        !selectedSection ||
        !selectedStudentId
      ) {
        return;
      }

      dispatch(
        addStudentToSection(
          selectedSection.id,
          Number(selectedStudentId)
        )
      );

      setSelectedStudentId("");

      setShowAddStudentModal(false);
    };

  // =========================
  // REMOVE STUDENT
  // =========================

  const handleRemoveStudent =
    (userId) => {
      if (!selectedSection) {
        return;
      }

      dispatch(
        removeStudentFromSection(
          selectedSection.id,
          userId
        )
      );
    };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="h-full min-h-0 overflow-hidden">

      {/* =========================
          COMMUNITY HOME
      ========================= */}

      {!selectedSection &&
        !selectedDirectUser &&
        communityView === "community" && (
          <SectionsView
              sections={sections}
              isLoadingSections={isLoadingSections}
              onSelectSection={handleSelectSection}
              authUser={authUser}
              onCreateSection={handleCreateSection}
  
              unreadSectionCounts={unreadSectionCounts}

              conversations={conversations}
              isLoadingConversations={isLoadingConversations}
              onSelectDirectUser={handleSelectDirectUser}
              onlineUsers={onlineUsers}
/>
        )}


      {/* =========================
          DIRECT MESSAGE LIST
      ========================= */}

      {!selectedSection &&
        !selectedDirectUser &&
        communityView === "messages" && (

          <div className="flex h-full min-h-0 flex-col">

            {/* HEADER */}

            <div className="shrink-0 border-b border-base-300 px-6 py-5 md:px-8">

              <div className="flex items-center gap-4">

                <button
                  onClick={
                    handleBackToCommunity
                  }
                  className="btn btn-ghost btn-circle"
                  aria-label="Back to community"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>

                  <div className="flex items-center gap-3">

                    <MessageCircle className="w-7 h-7 text-primary" />

                    <h1 className="text-3xl font-bold text-base-content">

                      Messages

                    </h1>

                  </div>

                  <p className="text-sm text-base-content/60 mt-1">

                    Your direct conversations

                  </p>

                </div>

              </div>

            </div>


            {/* CONVERSATION LIST */}

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
              <DirectConversationsPanel
  conversations={conversations}
  isLoading={isLoadingConversations}
  onSelectUser={handleSelectDirectUser}
  authUser={authUser}
  onlineUsers={onlineUsers}
  unreadDirectMessageCounts={unreadDirectMessageCounts}
/>
            </div>

          </div>

        )}


      {/* =========================
          SECTION CHAT
      ========================= */}

      {selectedSection && (
        <div className="h-full min-h-0">
          <SectionChat
            section={selectedSection}
            messages={messages}
            content={content}
            onContentChange={setContent}
            onSendMessage={handleSendMessage}
            isLoadingMessages={isLoadingMessages}
            isSendingMessage={isSendingMessage}
            authUser={authUser}
            onBack={handleBackToCommunity}
            onShowGroupInfo={() => setShowGroupInfo(true)}
          />
        </div>
      )}


      {/* =========================
          DIRECT CHAT
      ========================= */}

      {selectedDirectUser && (
        <div className="h-full min-h-0">
          <DirectChat
            selectedUser={selectedDirectUser}
            messages={directMessages}
            authUser={authUser}
            onBack={handleBackToMessages}
            onSendMessage={handleSendDirectMessage}
            isLoading={isLoadingDirectMessages}
            isSending={isSendingDirectMessage}
          />
        </div>
      )}


      {/* =========================
          GROUP INFO
      ========================= */}

      {selectedSection &&
        showGroupInfo && (

          <GroupInfoDrawer
            section={selectedSection}

            members={members}

            isLoadingMembers={
              isLoadingMembers
            }

            onlineUsers={
              onlineUsers
            }

            authUser={
              authUser
            }

            availableStudents={
              availableStudents
            }

            isLoadingAvailableStudents={
              isLoadingAvailableStudents
            }

            selectedStudentId={
              selectedStudentId
            }

            onSelectedStudentChange={
              setSelectedStudentId
            }

            onAddStudent={
              handleAddStudent
            }

            isAddingStudent={
              isAddingStudent
            }

            onRemoveStudent={
              handleRemoveStudent
            }

            isRemovingStudent={
              isRemovingStudent
            }

            onRenameSection={
              handleRenameSection
            }

            onDeleteSection={
              handleDeleteSection
            }

            onClose={() =>
              setShowGroupInfo(false)
            }

            showAddStudentModal={
              showAddStudentModal
            }

            onShowAddStudentModal={
              setShowAddStudentModal
            }
          />

        )}

    </div>
  );
};

export default CommunityPage;