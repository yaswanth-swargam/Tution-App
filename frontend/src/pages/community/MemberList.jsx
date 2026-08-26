import { useState } from "react";
import { Trash2 } from "lucide-react";
import MemberProfilePopover from "./MemberProfilePopover";

const MemberList = ({
  members,
  isLoadingMembers,
  onlineUsers,
  authUser,
  onRemoveStudent,
  isRemovingStudent,
}) => {
  const [hoveredMemberId, setHoveredMemberId] = useState(
    null
  );

  return (
    <div className="divide-y divide-base-300">
      {isLoadingMembers ? (
        <div className="p-6 text-center">
          <span className="loading loading-spinner loading-sm text-primary"></span>
        </div>
      ) : members.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-base-content/60">
            No members found
          </p>
        </div>
      ) : (
        members.map((member) => {
          const isOnline =
            onlineUsers.includes(member.id);
          const isCurrentUser =
            authUser?.id === member.id;

          return (
            <div
              key={member.id}
              className="relative"
              onMouseEnter={() =>
                setHoveredMemberId(member.id)
              }
              onMouseLeave={() =>
                setHoveredMemberId(null)
              }
            >
              <div className="p-6 hover:bg-base-200/50 transition-colors duration-150">
                <div className="flex items-center justify-between gap-4">
                  {/* Member info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    {member.profile_pic ? (
                      <img
                        src={member.profile_pic}
                        alt={member.full_name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {member.full_name
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Name and role */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-base-content truncate">
                          {member.full_name}
                        </p>

                        {/* Online indicator */}
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isOnline
                              ? "bg-success"
                              : "bg-base-300"
                          }`}
                          title={
                            isOnline
                              ? "Online"
                              : "Offline"
                          }
                        ></div>

                        {isCurrentUser && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-base-content/60 capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Remove button (admin only, not for self) */}
                  {authUser?.role === "admin" &&
                    member.role === "student" &&
                    !isCurrentUser && (
                      <button
                        onClick={() =>
                          onRemoveStudent(member.id)
                        }
                        disabled={isRemovingStudent}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-error/20 hover:text-error"
                        title="Remove student"
                        aria-label={`Remove ${member.full_name}`}
                      >
                        {isRemovingStudent ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                </div>
              </div>

              {/* Hover Profile Popover */}
              {hoveredMemberId === member.id && (
                <MemberProfilePopover member={member} />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MemberList;