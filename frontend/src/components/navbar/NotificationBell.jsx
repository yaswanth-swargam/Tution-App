import { Bell } from "lucide-react";

const notifications = [
  { id: 1, title: "Welcome to TuitionHub", time: "Just now" },
  { id: 2, title: "New study material uploaded", time: "2h ago" },
  { id: 3, title: "Your AI summary is ready", time: "Yesterday" },
];

const NotificationBell = () => {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="btn btn-ghost btn-circle btn-sm text-slate-500 hover:bg-slate-100 hover:text-neutral"
      >
        <span className="relative inline-flex">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
        </span>
      </button>

      <div
        tabIndex={0}
        className="dropdown-content z-50 mt-3 w-80 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-card"
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="text-[11px] font-medium text-primary">
            {notifications.length} new
          </span>
        </div>

        <div className="space-y-1">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-neutral/[0.04]"
            >
              <span className="text-sm text-neutral">{notification.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral/45">
                {notification.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
