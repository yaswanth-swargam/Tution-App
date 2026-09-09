
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

import {
  setConversations,
  addConversation,
  removeConversation,
  updateConversation,
  setCurrentConversation,
  setMessages,
  setLoadingConversations,
  setLoadingConversation,
  setSendingMessage,
  setAIError,
} from "./aiSlice.js";

// ===============================
// Get All Conversations
// ===============================
export const fetchConversations = () => async (dispatch) => {
  dispatch(setLoadingConversations(true));
  dispatch(setAIError(null));

  try {
    const res = await axiosInstance.get("/ai/conversations");

    dispatch(setConversations(res.data.conversations));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to load conversations";

    dispatch(setAIError(message));
    toast.error(message);
  } finally {
    dispatch(setLoadingConversations(false));
  }
};

// ===============================
// Create New Conversation
// ===============================
export const createConversation = () => async (dispatch) => {
  dispatch(setAIError(null));

  try {
    const res = await axiosInstance.post("/ai/conversations");

    const conversation = res.data.conversation;

    dispatch(addConversation(conversation));
    dispatch(setCurrentConversation(conversation.id));

    return conversation;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to create conversation";

    dispatch(setAIError(message));
    toast.error(message);

    return null;
  }
};

// ===============================
// Get One Conversation
// ===============================
export const fetchConversation =
  (conversationId) => async (dispatch) => {
    dispatch(setLoadingConversation(true));
    dispatch(setAIError(null));

    try {
      const res = await axiosInstance.get(
        `/ai/conversations/${conversationId}`
      );

      dispatch(
        setCurrentConversation(
          res.data.conversation.id
        )
      );

      dispatch(setMessages(res.data.messages));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load conversation";

      dispatch(setAIError(message));
      toast.error(message);
    } finally {
      dispatch(setLoadingConversation(false));
    }
  };

// ===============================
// Send Message
// ===============================

export const sendMessage =
  ({ conversationId, message }) =>
  async (dispatch) => {
    dispatch(setSendingMessage(true));
    dispatch(setAIError(null));

    try {
      const res = await axiosInstance.post(
        `/ai/conversations/${conversationId}/messages`,
        {
          message,
        }
      );

      // Reload the current conversation
      // so Redux gets the latest messages from DB.
      await dispatch(fetchConversation(conversationId));

      // Reload conversations so the sidebar gets
      // the latest title and updated_at.
      await dispatch(fetchConversations());

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send message";

      dispatch(setAIError(message));
      toast.error(message);

      return null;
    } finally {
      dispatch(setSendingMessage(false));
    }
  };

// ===============================
// Delete Conversation
// ===============================
export const deleteConversation =
  (conversationId) => async (dispatch) => {
    dispatch(setAIError(null));

    try {
      await axiosInstance.delete(
        `/ai/conversations/${conversationId}`
      );

      dispatch(removeConversation(conversationId));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete conversation";

      dispatch(setAIError(message));
      toast.error(message);
    }
  };

  export const renameConversation =
  ({ conversationId, title }) =>
  async (dispatch) => {
    try {
      const res = await axiosInstance.patch(
        `/ai/conversations/${conversationId}`,
        { title }
      );

      dispatch(
        updateConversation({
          id: conversationId,
          updates: {
            title: res.data.title,
          },
        })
      );

      toast.success("Conversation renamed");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to rename conversation";

      dispatch(setAIError(message));
      toast.error(message);
    }
  };