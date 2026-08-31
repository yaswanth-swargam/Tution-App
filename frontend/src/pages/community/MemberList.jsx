import { useEffect, useRef, useState } from "react";
import {
  Users,
  User,
  Shield,
  Trash2,
} from "lucide-react";

import MemberProfilePopover from "./MemberProfilePopover";

const MemberList = ({
  members = [],
  isLoadingMembers,
  onlineUsers = [],
  authUser,
  onRemoveStudent,
  isRemovingStudent,
}) => {
  const [selectedMember, setSelectedMember] =
    useState(null);

  const profileRef = useRef(null);

  // =========================
  // CLOSE PROFILE ON OUTSIDE CLICK
  // =========================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setSelectedMember(null);
      }
    };

    if (selectedMember) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [selectedMember]);

  // =========================
  // LOADING
  // =========================

  if (isLoadingMembers) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <Users className="h-4 w-4 text-base-content/50" />

          <span className="text-sm text-base-content/50">
            Loading members...
          </span>
        </div>

        <div className="flex items-center justify-center py-8">
          <span className="loading loading-spinner loading-md" />
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Users className="mb-3 h-10 w-10 text-base-content/20" />

        <p className="font-medium text-base-content/60">
          No members found
        </p>

        <p className="mt-1 text-sm text-base-content/40">
          There are no members in this section.
        </p>
      </div>
    );
  }

  // =========================
  // ONLINE CHECK
  // =========================

  const isUserOnline = (userId) => {
    return onlineUsers?.some(
      (id) => Number(id) === Number(userId)
    );
  };

  // =========================
  // PROFILE INITIAL
  // =========================

  const getInitial = (name) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  // =========================
  // REMOVE STUDENT
  // =========================

  const handleRemoveStudent = (member) => {
    if (!onRemoveStudent) return;

    if (
      Number(member.id) ===
      Number(authUser?.id)
    ) {
      return;
    }

    onRemoveStudent(member.id);

    // Close profile if the removed
    // student was selected.
    if (
      Number(selectedMember?.id) ===
      Number(member.id)
    ) {
      setSelectedMember(null);
    }
  };

  // =========================
  // MEMBER CLICK
  // =========================

  const handleMemberClick = (member) => {
    setSelectedMember((current) => {
      if (
        current &&
        Number(current.id) === Number(member.id)
      ) {
        return null;
      }

      return member;
    });
  };

  return (
    <div className="flex flex-col">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-base-content/60" />

          <span className="text-sm font-semibold text-base-content">
            Members
          </span>
        </div>

        <span className="badge badge-ghost badge-sm">
          {members.length}
        </span>

      </div>

      {/* =========================
          MEMBER LIST
      ========================= */}

      <div className="flex flex-col gap-1">

        {members.map((member) => {

          const isOnline =
            isUserOnline(member.id);

          const isCurrentUser =
            Number(member.id) ===
            Number(authUser?.id);

          const isAdmin =
            member.role === "admin";

          const isSelected =
            Number(selectedMember?.id) ===
            Number(member.id);

          return (
            <div
              key={member.id}
              className="relative"
              ref={
                isSelected
                  ? profileRef
                  : null
              }
            >

              {/* =========================
                  MEMBER ROW
              ========================= */}

              <div
                onClick={() =>
                  handleMemberClick(member)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault();
                    handleMemberClick(member);
                  }
                }}
                className={`
                  group
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-lg
                  px-2
                  py-2.5
                  transition-colors
                  ${
                    isSelected
                      ? "bg-base-200"
                      : "hover:bg-base-200"
                  }
                `}
              >

                {/* =========================
                    AVATAR
                ========================= */}

                <div className="relative shrink-0">

                  <div className="avatar placeholder">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-primary
                        text-sm
                        font-medium
                        text-primary-content
                      "
                    >

                      {member.profile_pic ? (

                        <img
                          src={member.profile_pic}
                          alt={
                            member.full_name ||
                            "Member"
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />

                      ) : (

                        <span>
                          {getInitial(
                            member.full_name
                          )}
                        </span>

                      )}

                    </div>

                  </div>

                  {/* ONLINE INDICATOR */}

                  <span
                    className={`
                      absolute
                      bottom-0
                      right-0
                      h-3
                      w-3
                      rounded-full
                      border-2
                      border-base-100
                      ${
                        isOnline
                          ? "bg-success"
                          : "bg-base-content/20"
                      }
                    `}
                  />

                </div>

                {/* =========================
                    USER DETAILS
                ========================= */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-1.5">

                    <p className="
                      truncate
                      text-sm
                      font-medium
                      text-base-content
                    ">
                      {member.full_name ||
                        "Unknown User"}
                    </p>

                    {isCurrentUser && (
                      <span className="
                        shrink-0
                        text-[10px]
                        text-base-content/40
                      ">
                        You
                      </span>
                    )}

                  </div>

                  <div className="flex items-center gap-1.5">

                    {isAdmin ? (
                      <>
                        <Shield className="
                          h-3
                          w-3
                          text-primary
                        " />

                        <span className="
                          text-xs
                          text-primary
                        ">
                          Administrator
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="
                          h-3
                          w-3
                          text-base-content/40
                        " />

                        <span className="
                          text-xs
                          text-base-content/50
                        ">
                          {isOnline
                            ? "Online"
                            : "Offline"}
                        </span>
                      </>
                    )}

                  </div>

                </div>

                {/* =========================
                    REMOVE STUDENT
                ========================= */}

                {!isAdmin &&
                  !isCurrentUser &&
                  onRemoveStudent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        handleRemoveStudent(
                          member
                        );
                      }}
                      disabled={
                        isRemovingStudent
                      }
                      className="
                        btn
                        btn-ghost
                        btn-sm
                        btn-square
                        text-error
                        opacity-0
                        transition-opacity
                        group-hover:opacity-100
                      "
                      title="Remove student"
                      aria-label={`Remove ${
                        member.full_name ||
                        "student"
                      }`}
                    >
                      {isRemovingStudent ? (
                        <span className="
                          loading
                          loading-spinner
                          loading-xs
                        " />
                      ) : (
                        <Trash2 className="
                          h-4
                          w-4
                        " />
                      )}
                    </button>
                  )}

              </div>

              {/* =========================
                  PROFILE POPOVER
              ========================= */}

              {isSelected && (
                <MemberProfilePopover
                  member={selectedMember}
                />
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MemberList;