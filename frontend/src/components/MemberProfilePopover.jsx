import { Mail, MessageCircle, Shield, User } from "lucide-react";

const MemberProfilePopover = ({
  member,
  currentUser,
  onMessage,
}) => {
  const isAdmin = member.role === "admin";

  // Student can message only admin
  // Admin can message students
  const canMessage =
    member.id !== currentUser?.id &&
    (currentUser?.role === "admin" || isAdmin);

  return (
    <div className="absolute right-full top-0 z-50 mr-3 hidden w-72 group-hover:block">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xl">

        {/* Profile */}
        <div className="flex items-center gap-3">
          {member.profile_pic ? (
            <img
              src={member.profile_pic}
              alt={member.full_name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content">
              {member.full_name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="font-semibold">
              {member.full_name}
            </h3>

            <div className="flex items-center gap-1 text-xs text-neutral/50">
              {isAdmin ? (
                <Shield size={13} />
              ) : (
                <User size={13} />
              )}

              <span>
                {isAdmin ? "Admin" : "Student"}
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mt-4 flex items-center gap-2 text-sm text-neutral/60">
          <Mail size={15} />
          <span className="truncate">
            {member.email}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5">

          {canMessage ? (
            <button
              onClick={() => onMessage(member)}
              className="btn btn-primary btn-sm w-full gap-2"
            >
              <MessageCircle size={16} />
              Message
            </button>
          ) : (
            <div className="rounded-lg bg-base-200 px-3 py-2 text-center text-xs text-neutral/50">
              Private messaging unavailable
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MemberProfilePopover;