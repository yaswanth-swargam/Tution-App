import {
  ArrowLeft,
  Info,
  Search,
  X,
} from "lucide-react";

const ChatHeader = ({
  section,
  onBack,
  onShowGroupInfo,
  isSearching,
  searchQuery,
  onSearchChange,
  onToggleSearch,
}) => {
  return (
    <div className="shrink-0 border-b border-base-300 bg-base-100 px-4 py-3 md:px-6">

      {isSearching ? (

        /* ================= SEARCH MODE ================= */

        <div className="flex items-center gap-3">

          <div className="relative flex-1">

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-5
                h-5
                text-base-content/40
              "
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Search messages..."
              className="
                input
                input-bordered
                w-full
                pl-10
              "
              autoFocus
            />

          </div>

          <button
            onClick={onToggleSearch}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      ) : (

        /* ================= NORMAL HEADER ================= */

        <div className="flex items-center justify-between gap-4">

          {/* LEFT */}

          <div className="flex items-center gap-4 min-w-0">

            <button
              onClick={onBack}
              className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-base-300"
              aria-label="Back to sections"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">

              <h2 className="text-lg md:text-xl font-bold text-base-content truncate">
                {section.name}
              </h2>

              <p className="text-xs text-base-content/50">
                {section.description || "Section"}
              </p>

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-1">

            {/* SEARCH */}

            <button
              onClick={onToggleSearch}
              className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-base-300"
              aria-label="Search messages"
              title="Search messages"
            >
              <Search className="w-5 h-5" />
            </button>


            {/* GROUP INFO */}

            <button
              onClick={onShowGroupInfo}
              className="btn btn-ghost btn-circle btn-sm md:btn-md hover:bg-base-300"
              aria-label="Show group information"
              title="Group information"
            >
              <Info className="w-5 h-5" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default ChatHeader;