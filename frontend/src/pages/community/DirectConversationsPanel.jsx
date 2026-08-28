import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";

import Loader from "../../components/common/Loader";

const matchesQuery = (user, query) => {
  if (!query) return false;

  return (
    user.full_name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query) ||
    user.role?.toLowerCase().includes(query)
  );
};

const ConversationRow = ({ user, isOnline, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="flex w-full items-center gap-3 rounded-xl border border-base-300 bg-base-100 p-3 text-left transition-colors duration-150 hover:bg-base-200"
    >
      <div className="relative shrink-0">
        {user.profile_pic ? (
          <img
            src={user.profile_pic}
            alt={user.full_name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {user.full_name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        {isOnline ? (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-base-100 bg-success" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-base-content">
            {user.full_name}
          </h3>
          {isOnline ? (
            <span className="text-[11px] text-success">Online</span>
          ) : null}
        </div>
        <p className="truncate text-xs text-base-content/50">{user.email}</p>
      </div>

      <span className="badge badge-outline badge-sm shrink-0">
        {user.role === "admin" ? "Admin" : "Student"}
      </span>
    </button>
  );
};

const DirectConversationsPanel = ({
  conversations = [],
  isLoading = false,
  onSelectUser,
  authUser,
  onlineUsers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;
  const isAdmin = authUser?.role === "admin";

  const recentConversations = conversations.filter(
    (user) => user.last_message_at
  );

  const searchResults = isSearching
    ? conversations.filter((user) => matchesQuery(user, query))
    : [];

  const listToShow = isSearching ? searchResults : recentConversations;

  return (
    <div className="flex min-h-0 flex-col">
      {(isAdmin || conversations.length > 0) && !isLoading ? (
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAdmin
                ? "Search users to start a message..."
                : "Search conversations..."
            }
            className="input input-bordered w-full pl-10"
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="py-16">
          <Loader text="Loading conversations..." />
        </div>
      ) : listToShow.length === 0 ? (
        <div className="rounded-xl border border-base-300 px-6 py-12 text-center">
          <MessageCircle className="mx-auto mb-3 h-12 w-12 text-base-content/20" />
          <h3 className="font-semibold text-base-content">
            {isSearching ? "No users found" : "No conversations yet"}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-base-content/50">
            {isSearching
              ? "Try a different name or email."
              : isAdmin
                ? "Search for a student or admin to start a direct message."
                : "Your direct conversations will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {isSearching ? (
            <p className="text-xs text-base-content/50">
              {listToShow.length}{" "}
              {listToShow.length === 1 ? "result" : "results"}
            </p>
          ) : null}

          {listToShow.map((user) => (
            <ConversationRow
              key={user.id}
              user={user}
              isOnline={onlineUsers.includes(Number(user.id))}
              onSelect={onSelectUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectConversationsPanel;
