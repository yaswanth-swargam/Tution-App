import {
  Bell,
  Megaphone,
  Users,
} from "lucide-react";

import SendNotificationForm from "../components/notifications/SendNotificationForm.jsx";

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral">
              Notifications
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Send important updates and announcements to your students.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* Send Notification */}
        <div className="min-w-0">
          <SendNotificationForm />
        </div>

        {/* Information Card */}
        <div className="h-fit rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Megaphone size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-neutral">
                About Notifications
              </h2>

              <p className="text-xs text-slate-500">
                Keep students informed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-base-200 text-slate-500">
                <Users size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral">
                  Select sections
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Choose one or more sections to send the notification to.
                </p>
              </div>
            </div>

            <div className="h-px bg-base-300" />

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-base-200 text-slate-500">
                <Bell size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral">
                  In-app notification
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Students will see the notification in their notification
                  center.
                </p>
              </div>
            </div>

            <div className="h-px bg-base-300" />

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-base-200 text-slate-500">
                <Megaphone size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral">
                  Email delivery
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Notifications can also be delivered to students by email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;