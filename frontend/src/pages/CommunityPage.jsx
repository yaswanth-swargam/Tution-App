import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  MessageCircle,
  ArrowLeft,
  Users,
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
} from "../store/chatSlice.js";

// =========================
// COMPONENTS
// =========================

import SectionsView from "./community/SectionsView.jsx";
import SectionChat from "./community/SectionsChat.jsx";
import DirectChat from "./community/DirectChat.jsx";
import GroupInfoDrawer from "./community/GroupInfoDrawer.jsx";

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

  // =========================
  // SOCKET:
  // SECTION MESSAGES
  // =========================

  useEffect(() => {
    const handleNewMessage =
      (message) => {
        if (
          selectedSection &&
          Number(message.section_id) ===
            Number(selectedSection.id)
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

  const handleSelectSection =
    (section) => {
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

      // Fetch members
      dispatch(
        fetchSectionMembers(
          section.id
        )
      );

      // Admin:
      // fetch available students
      if (
        authUser?.role === "admin"
      ) {
        dispatch(
          fetchAvailableStudents(
            section.id
          )
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

  const handleSelectDirectUser =
    (user) => {
      // Close section
      dispatch(
        setSelectedSection(null)
      );

      // Select direct user
      dispatch(
        setSelectedDirectUser(user)
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

  const handleSendMessage =
    (e) => {
      e.preventDefault();

      if (
        !content.trim() ||
        !selectedSection
      ) {
        return;
      }

      const messageContent =
        content.trim();

      setContent("");

      dispatch(
        sendMessage(
          selectedSection.id,
          messageContent
        )
      );
    };

  // =========================
  // SEND DIRECT MESSAGE
  // =========================

  const handleSendDirectMessage =
    (messageContent) => {
      if (
        !selectedDirectUser ||
        !messageContent.trim()
      ) {
        return;
      }

      dispatch(
        sendDirectMessage(
          selectedDirectUser.id,
          messageContent.trim()
        )
      );
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

  const handleRenameSection =
    async (name) => {
      if (
        !selectedSection ||
        !name?.trim()
      ) {
        return;
      }

      try {
        const updatedSection =
          await dispatch(
            renameSection(
              selectedSection.id,
              name.trim()
            )
          );

        dispatch(
          setSelectedSection(
            updatedSection
          )
        );
      } catch (error) {
        console.error(
          "Failed to rename section:",
          error
        );

        throw error;
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
    <div className="h-full">

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

  conversations={conversations}
  isLoadingConversations={isLoadingConversations}
  onSelectDirectUser={handleSelectDirectUser}
/>
        )}


      {/* =========================
          DIRECT MESSAGE LIST
      ========================= */}

      {!selectedSection &&
        !selectedDirectUser &&
        communityView === "messages" && (

          <div className="flex-1 flex flex-col h-full">

            {/* HEADER */}

            <div className="border-b border-base-300 px-6 py-6 md:px-8">

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

            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">

              {isLoadingConversations ? (

                <div className="flex justify-center py-12">

                  <span className="loading loading-spinner loading-lg text-primary" />

                </div>

              ) : conversations.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-16 text-center">

                  <MessageCircle className="w-16 h-16 text-base-content/20 mb-4" />

                  <h3 className="text-lg font-semibold text-base-content">

                    No conversations yet

                  </h3>

                  <p className="text-sm text-base-content/50 mt-2 max-w-sm">

                    Your direct conversations will appear here once you send or receive a message.

                  </p>

                </div>

              ) : (

                <div className="max-w-3xl space-y-2">

                  {conversations.map(
                    (user) => {

                      const isOnline =
                        onlineUsers.includes(
                          Number(user.id)
                        );

                      return (

                        <button
                          key={user.id}

                          onClick={() =>
                            handleSelectDirectUser(
                              user
                            )
                          }

                          className="w-full flex items-center gap-4 p-4 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition text-left"
                        >

                          {/* PROFILE */}

                          <div className="relative">

                            {user.profile_pic ? (

                              <img
                                src={
                                  user.profile_pic
                                }
                                alt={
                                  user.full_name
                                }
                                className="w-12 h-12 rounded-full object-cover"
                              />

                            ) : (

                              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">

                                {user.full_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}

                              </div>

                            )}

                            {/* ONLINE INDICATOR */}

                            {isOnline && (

                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-base-100" />

                            )}

                          </div>


                          {/* USER INFO */}

                          <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-2">

                              <h3 className="font-semibold truncate">

                                {user.full_name}

                              </h3>

                              {isOnline && (

                                <span className="text-xs text-success">

                                  Online

                                </span>

                              )}

                            </div>

                            <p className="text-sm text-base-content/50 truncate">

                              {user.email}

                            </p>

                          </div>

                          <MessageCircle className="w-5 h-5 text-base-content/40" />

                        </button>

                      );
                    }
                  )}

                </div>

              )}

            </div>

          </div>

        )}


      {/* =========================
          SECTION CHAT
      ========================= */}

      {selectedSection && (

        <SectionChat
          section={selectedSection}
          messages={messages}
          content={content}
          onContentChange={
            setContent
          }
          onSendMessage={
            handleSendMessage
          }
          isLoadingMessages={
            isLoadingMessages
          }
          isSendingMessage={
            isSendingMessage
          }
          authUser={authUser}
          onBack={
            handleBackToCommunity
          }
          onShowGroupInfo={() =>
            setShowGroupInfo(true)
          }
        />

      )}


      {/* =========================
          DIRECT CHAT
      ========================= */}

      {selectedDirectUser && (

        <DirectChat
          selectedUser={
            selectedDirectUser
          }
          messages={
            directMessages
          }
          authUser={
            authUser
          }

          onBack={
            handleBackToMessages
          }

          onSendMessage={
            handleSendDirectMessage
          }

          isLoading={
            isLoadingDirectMessages
          }

          isSending={
            isSendingDirectMessage
          }
        />

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