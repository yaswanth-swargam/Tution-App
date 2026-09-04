import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Users,
  Send,
} from "lucide-react";

import { fetchSections } from "../../store/chatActions.js";
import { sendNotification } from "../../store/notificationActions.js";

const SendNotificationForm = () => {
  const dispatch = useDispatch();

  const {
    sections,
    isLoadingSections,
  } = useSelector((state) => state.chat);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleSectionChange = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        sendNotification({
          title: title.trim(),
          message: message.trim(),
          section_ids: selectedSections,
        })
      );

      console.log("Notification sent:", response);

      setTitle("");
      setMessage("");
      setSelectedSections([]);
    } catch (error) {
      console.error(
        "Failed to send notification:",
        error
      );
    }
  };

  const selectedSectionCount =
    selectedSections.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell size={19} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-neutral">
            Send Notification
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Send an important update to students in
            selected sections.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter notification title"
            className="input input-bordered w-full"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral">
            Message
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Write your notification..."
            rows={5}
            className="textarea textarea-bordered w-full resize-none"
          />
        </div>

        {/* Sections */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral">
              Send to Sections
            </label>

            {selectedSectionCount > 0 && (
              <span className="text-xs font-medium text-primary">
                {selectedSectionCount}{" "}
                {selectedSectionCount === 1
                  ? "section"
                  : "sections"}{" "}
                selected
              </span>
            )}
          </div>

          {isLoadingSections ? (
            <div className="rounded-xl border border-base-300 px-4 py-5 text-center">
              <span className="loading loading-spinner loading-sm text-primary" />
            </div>
          ) : sections.length === 0 ? (
            <div className="rounded-xl border border-base-300 px-4 py-5 text-center">
              <Users
                size={20}
                className="mx-auto mb-2 text-slate-400"
              />

              <p className="text-sm text-slate-500">
                No sections available.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => {
                const isSelected =
                  selectedSections.includes(
                    section.id
                  );

                return (
                  <label
                    key={section.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      isSelected
                        ? "border-primary/30 bg-primary/[0.05]"
                        : "border-base-300 hover:bg-base-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={isSelected}
                      onChange={() =>
                        handleSectionChange(
                          section.id
                        )
                      }
                    />

                    <span
                      className={`text-sm ${
                        isSelected
                          ? "font-semibold text-neutral"
                          : "font-medium text-neutral/80"
                      }`}
                    >
                      {section.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {selectedSectionCount > 0
              ? "Students in the selected sections will receive this notification."
              : "Select at least one section to continue."}
          </p>

          <button
            type="submit"
            className="btn btn-primary shrink-0"
            disabled={
              !title.trim() ||
              !message.trim() ||
              selectedSections.length === 0
            }
          >
            <Send size={16} />
            Send Notification
          </button>
        </div>
      </div>
    </form>
  );
};

export default SendNotificationForm;