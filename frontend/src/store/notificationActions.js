import api from "../lib/axios.js";

import {
  setNotifications,
  setUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotificationLogs,
} from "./notificationSlice.js";


// ==========================================
// FETCH NOTIFICATIONS
// ==========================================

export const fetchNotifications =
  () => async (dispatch) => {
    try {
      const response = await api.get(
        "/notifications"
      );

      dispatch(
        setNotifications(response.data.notifications)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error
      );

      throw error;
    }
  };


// ==========================================
// FETCH UNREAD COUNT
// ==========================================

export const fetchUnreadCount =
  () => async (dispatch) => {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      dispatch(
        setUnreadCount(response.data.unreadCount)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching unread notification count:",
        error
      );

      throw error;
    }
  };


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

export const markAsRead =
  (notificationId) => async (dispatch) => {
    try {
      const response = await api.patch(
        `/notifications/${notificationId}/read`
      );

      dispatch(
        markNotificationAsRead(notificationId)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );

      throw error;
    }
  };


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export const markAllAsRead =
  () => async (dispatch) => {
    try {
      const response = await api.patch(
        "/notifications/read-all"
      );

      dispatch(
        markAllNotificationsAsRead()
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );

      throw error;
    }
  };


// ==========================================
// SEND NOTIFICATION - ADMIN
// ==========================================

export const sendNotification =
  (notificationData) => async (dispatch) => {
    try {
      const response = await api.post(
        "/notifications/send",
        notificationData
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error sending notification:",
        error
      );

      throw error;
    }
  };

  export const fetchNotificationLogs =
  () => async (dispatch) => {
    try {
      const response = await api.get(
        "/notifications/logs"
      );

      dispatch(
        setNotificationLogs(response.data.logs)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching notification logs:",
        error
      );

      throw error;
    }
  };