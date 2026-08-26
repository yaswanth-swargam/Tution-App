const MemberProfilePopover = ({ member }) => {
  return (
    <div className="absolute left-0 top-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 w-72 z-10 pointer-events-none">
      {/* Profile section */}
      <div className="flex gap-3 mb-4 pb-4 border-b border-base-300">
        {/* Avatar */}
        {member.profile_pic ? (
          <img
            src={member.profile_pic}
            alt={member.full_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {member.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name and role */}
        <div className="flex-1">
          <p className="font-bold text-base-content">
            {member.full_name}
          </p>
          <p className="text-xs text-base-content/60 capitalize">
            {member.role}
          </p>
        </div>
      </div>

      {/* Email */}
      {member.email && (
        <div className="mb-3">
          <p className="text-xs text-base-content/60 mb-1">
            Email
          </p>
          <p className="text-sm text-base-content break-all">
            {member.email}
          </p>
        </div>
      )}

      {/* Role badge */}
      <div className="inline-block">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            member.role === "admin"
              ? "bg-error/20 text-error"
              : "bg-primary/20 text-primary"
          }`}
        >
          {member.role === "admin"
            ? "Administrator"
            : "Student"}
        </span>
      </div>
    </div>
  );
};

export default MemberProfilePopover;