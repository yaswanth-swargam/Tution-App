import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  notificationLogs:[],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },

    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        (item) => item.id === action.payload
      );

      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.is_read = true;
      });

      state.unreadCount = 0;
    },

    clearNotificationError: (state) => {
      state.error = null;
    },
    setNotificationLogs: (state, action) => {
  state.notificationLogs = action.payload;
},
  },
});

export const {
  setNotifications,
  setNotificationLogs,
  setUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotificationError,
} = notificationSlice.actions;

export default notificationSlice.reducer;