import PageHeader from "../components/common/PageHeader";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { authUser } = useSelector((state) => state.auth);

  const fields = [
    {
      label: "Full name",
      value: authUser?.fullName || "Not available",
    },
    {
      label: "Email",
      value: authUser?.email || "Not available",
    },
    {
      label: "Role",
      value: authUser?.role || "Not available",
    },
  ];

  const initial =
    authUser?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        subtitle="Your public details in the classroom."
      />

      <div className="panel overflow-hidden">
        <div className="h-24 bg-canvas" />

        <div className="px-6 pb-6">
          <div className="-mt-8 mb-6 flex items-end gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-base-300 bg-base-100 text-xl font-semibold text-primary shadow-card">
              {initial}
            </div>

            <div className="pb-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {authUser?.fullName || "User"}
              </h2>

              <p className="text-sm text-neutral/50">
                {authUser?.role || "User"} · TuitionHub
              </p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.label}
                className="rounded-xl bg-canvas px-4 py-3"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral/45">
                  {field.label}
                </dt>

                <dd className="mt-1 text-sm font-medium">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;