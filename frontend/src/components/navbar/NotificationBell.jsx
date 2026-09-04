import { useEffect } from "react";
import {
  Bell,
  Megaphone,
  BookOpen,
  Info,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  fetchNotificationLogs,
} from "../../store/notificationActions.js";

const getNotificationIcon = (type) => {
  switch (type) {
    case "ANNOUNCEMENT":
      return <Megaphone size={15} />;

    case "MATERIAL":
      return <BookOpen size={15} />;

    default:
      return <Info size={15} />;
  }
};

const formatNotificationTime = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);

  const diffInSeconds = Math.floor(
    (now - notificationDate) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(
    diffInSeconds / 60
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(
    diffInMinutes / 60
  );

  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(
    diffInHours / 24
  );

  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return notificationDate.toLocaleDateString();
};

const NotificationBell = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector(
    (state) => state.auth
  );

  const {
    notifications,
    notificationLogs,
    unreadCount,
  } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (!authUser) {
      return;
    }

    // Everyone receives notifications
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    // Admins also need their sent announcement history
    if (authUser.role === "admin") {
      dispatch(fetchNotificationLogs());
    }
  }, [dispatch, authUser]);

  const handleNotificationClick = (
    notificationId,
    isRead
  ) => {
    if (!isRead) {
      dispatch(markAsRead(notificationId));
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllAsRead());
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Notification Bell */}
      <button
        type="button"
        tabIndex={0}
        className="btn btn-ghost btn-circle btn-sm text-slate-500 hover:bg-slate-100 hover:text-neutral"
      >
        <span className="relative inline-flex">
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </span>
      </button>

      {/* Notification Dropdown */}
      <div
        tabIndex={0}
        className="dropdown-content z-50 mt-3 w-80 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-card"
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm font-semibold">
            Notifications
          </p>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* ==========================================
            ADMIN VIEW
        ========================================== */}

        {authUser?.role === "admin" ? (
          <>
            {/* RECEIVED NOTIFICATIONS */}
            {notifications.length > 0 && (
              <div>
                <div className="mb-1 px-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Received
                  </p>
                </div>

                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.is_read
                        )
                      }
                      className={`w-full rounded-xl px-3 py-3 text-left transition-colors duration-150 hover:bg-base-200 ${
                        !notification.is_read
                          ? "bg-primary/[0.04]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            !notification.is_read
                              ? "bg-primary/10 text-primary"
                              : "bg-base-200 text-slate-500"
                          }`}
                        >
                          {getNotificationIcon(
                            notification.type
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-sm ${
                                !notification.is_read
                                  ? "font-semibold text-neutral"
                                  : "font-medium text-neutral/80"
                              }`}
                            >
                              {notification.title}
                            </span>

                            {!notification.is_read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {formatNotificationTime(
                              notification.created_at
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {notifications.length > 0 &&
              notificationLogs.length > 0 && (
                <div className="my-3 border-t border-base-300" />
              )}

            {/* SENT ANNOUNCEMENTS */}
            {notificationLogs.length > 0 && (
              <div>
                <div className="mb-1 px-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Sent Announcements
                  </p>
                </div>

                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {notificationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl px-3 py-3 hover:bg-base-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Megaphone size={15} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-neutral">
                            {log.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {log.message}
                          </p>

                          <div className="mt-2 space-y-0.5 text-[11px]">
                            <p className="text-slate-500">
                              Sent to{" "}
                              <span className="font-medium text-neutral">
                                {log.recipient_count}
                              </span>{" "}
                              students
                            </p>

                            <p className="text-slate-500">
                              Emails:{" "}
                              <span className="font-medium text-success">
                                {log.email_sent_count} sent
                              </span>
                              {" • "}
                              <span className="font-medium text-error">
                                {log.email_failed_count} failed
                              </span>
                            </p>
                          </div>

                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {formatNotificationTime(
                              log.created_at
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN EMPTY STATE */}
            {notifications.length === 0 &&
              notificationLogs.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-slate-500">
                    No notifications yet
                  </p>
                </div>
              )}
          </>
        ) : (
          /* ==========================================
             STUDENT VIEW
          ========================================== */

          notifications.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-slate-500">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.is_read
                    )
                  }
                  className={`w-full rounded-xl px-3 py-3 text-left transition-colors duration-150 hover:bg-base-200 ${
                    !notification.is_read
                      ? "bg-primary/[0.04]"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        !notification.is_read
                          ? "bg-primary/10 text-primary"
                          : "bg-base-200 text-slate-500"
                      }`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-sm ${
                            !notification.is_read
                              ? "font-semibold text-neutral"
                              : "font-medium text-neutral/80"
                          }`}
                        >
                          {notification.title}
                        </span>

                        {!notification.is_read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {notification.message}
                      </p>

                      <p className="mt-1.5 text-[11px] text-slate-400">
                        {formatNotificationTime(
                          notification.created_at
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NotificationBell;