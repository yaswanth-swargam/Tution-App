import PageHeader from "../components/common/PageHeader";

const rows = [
  { label: "Email notifications", hint: "Class updates and replies", on: true },
  { label: "Study reminders", hint: "Daily at 7:00 PM", on: true },
  { label: "Public profile", hint: "Visible to your batch only", on: false },
];

const SettingsPage = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        subtitle="Keep the workspace quiet and useful."
      />

      <div className="panel divide-y divide-base-300">
        {rows.map((row) => (
          <label
            key={row.label}
            className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
          >
            <span>
              <span className="block text-sm font-medium">{row.label}</span>
              <span className="mt-0.5 block text-xs text-neutral/50">
                {row.hint}
              </span>
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              defaultChecked={row.on}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
