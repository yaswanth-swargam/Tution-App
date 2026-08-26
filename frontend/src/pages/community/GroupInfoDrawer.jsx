import { useState } from "react";
import {
  X,
  Users,
  Pencil,
  Trash2,
  Check,
  XCircle,
} from "lucide-react";

import MemberList from "./MemberList";
import AddStudentModal from "./AddStudentModal";

const GroupInfoDrawer = ({
  section,
  members,
  isLoadingMembers,
  onlineUsers,
  authUser,

  availableStudents,
  isLoadingAvailableStudents,
  selectedStudentId,
  onSelectedStudentChange,
  onAddStudent,
  isAddingStudent,

  onRemoveStudent,
  isRemovingStudent,

  onClose,

  showAddStudentModal,
  onShowAddStudentModal,

  // NEW
  onRenameSection,
  onDeleteSection,
}) => {
  const [isEditingName, setIsEditingName] =
    useState(false);

  const [sectionName, setSectionName] =
    useState(section?.name || "");

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  // =========================
  // RENAME SECTION
  // =========================

  const handleRename = async () => {
    const trimmedName = sectionName.trim();

    if (!trimmedName) {
      return;
    }

    if (trimmedName === section.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await onRenameSection(
        section.id,
        trimmedName
      );

      setIsEditingName(false);

    } catch (error) {
      console.error(
        "Failed to rename section:",
        error
      );
    }
  };

  const handleCancelRename = () => {
    setSectionName(section.name);
    setIsEditingName(false);
  };

  // =========================
  // DELETE SECTION
  // =========================

  const handleDelete = async () => {
    try {
      await onDeleteSection(section.id);

      setShowDeleteConfirm(false);

    } catch (error) {
      console.error(
        "Failed to delete section:",
        error
      );
    }
  };

  const isAdmin =
    authUser?.role === "admin";

  return (
    <>
      {/* ================= OVERLAY ================= */}

      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* ================= DRAWER ================= */}

      <div className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-base-100 shadow-xl z-50 flex flex-col">

        {/* ================= HEADER ================= */}

        <div className="border-b border-base-300 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />

            <h3 className="text-lg font-bold text-base-content">
              Group Info
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close group info"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto">

          {/* ================= SECTION INFO ================= */}

          <div className="p-6 border-b border-base-300">

            {/* SECTION NAME */}

            <div className="flex items-start justify-between gap-3 mb-2">

              {!isEditingName ? (
                <>
                  <h4 className="font-semibold text-lg text-base-content break-words">
                    {section.name}
                  </h4>

                  {/* ADMIN RENAME BUTTON */}

                  {isAdmin && (
                    <button
                      onClick={() =>
                        setIsEditingName(true)
                      }
                      className="btn btn-ghost btn-sm btn-circle"
                      title="Rename section"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full">

                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) =>
                      setSectionName(
                        e.target.value
                      )
                    }
                    className="input input-bordered input-sm w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename();
                      }

                      if (e.key === "Escape") {
                        handleCancelRename();
                      }
                    }}
                  />

                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={handleRename}
                      disabled={
                        !sectionName.trim()
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Check className="w-4 h-4" />

                      Save
                    </button>

                    <button
                      onClick={handleCancelRename}
                      className="btn btn-ghost btn-sm"
                    >
                      <XCircle className="w-4 h-4" />

                      Cancel
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* DESCRIPTION */}

            <p className="text-sm text-base-content/60 mb-5">
              {section.description ||
                "Educational community"}
            </p>

            {/* STATS */}

            {!isLoadingMembers && (
              <div className="flex gap-6 text-sm">

                <div>
                  <p className="font-semibold text-base-content">
                    {members.length}
                  </p>

                  <p className="text-base-content/60">
                    Members
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-base-content">
                    {
                      members.filter((member) =>
                        onlineUsers.includes(
                          member.id
                        )
                      ).length
                    }
                  </p>

                  <p className="text-base-content/60">
                    Online
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* ================= ADMIN ACTIONS ================= */}

          {isAdmin && (
            <div className="p-6 border-b border-base-300 space-y-3">

              {/* ADD STUDENT */}

              <button
                onClick={() =>
                  onShowAddStudentModal(true)
                }
                className="btn btn-primary btn-sm w-full"
              >
                + Add Student
              </button>

              {/* DELETE SECTION */}

              <button
                onClick={() =>
                  setShowDeleteConfirm(true)
                }
                className="btn btn-error btn-outline btn-sm w-full"
              >
                <Trash2 className="w-4 h-4" />

                Delete Section
              </button>

            </div>
          )}

          {/* ================= MEMBERS ================= */}

          <MemberList
            members={members}
            isLoadingMembers={
              isLoadingMembers
            }
            onlineUsers={onlineUsers}
            authUser={authUser}
            onRemoveStudent={
              onRemoveStudent
            }
            isRemovingStudent={
              isRemovingStudent
            }
          />

        </div>
      </div>

      {/* ================= ADD STUDENT MODAL ================= */}

      {showAddStudentModal && (
        <AddStudentModal
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
            onSelectedStudentChange
          }
          onAddStudent={
            onAddStudent
          }
          isAddingStudent={
            isAddingStudent
          }
          onClose={() =>
            onShowAddStudentModal(false)
          }
        />
      )}

      {/* ================= DELETE CONFIRMATION ================= */}

      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() =>
              setShowDeleteConfirm(false)
            }
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">

            <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-md p-6">

              <div className="flex items-center gap-3 mb-4">

                <div className="p-3 rounded-full bg-error/10">
                  <Trash2 className="w-6 h-6 text-error" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Delete Section?
                  </h3>

                  <p className="text-sm text-base-content/60">
                    This action cannot be undone.
                  </p>
                </div>

              </div>

              <p className="text-sm text-base-content/70 mb-6">
                Are you sure you want to delete{" "}

                <span className="font-semibold">
                  {section.name}
                </span>

                ? All messages and member
                associations may also be removed.
              </p>

              <div className="flex justify-end gap-3">

                <button
                  onClick={() =>
                    setShowDeleteConfirm(false)
                  }
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  <Trash2 className="w-4 h-4" />

                  Delete
                </button>

              </div>

            </div>

          </div>
        </>
      )}

    </>
  );
};

export default GroupInfoDrawer;