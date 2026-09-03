import { Search } from "lucide-react";
import { useSelector } from "react-redux";

import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  console.log(authUser)
  const firstName = authUser?.fullName?.split(" ")[0] || "User";
  const initial = authUser?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-6 border-b border-base-300 bg-chrome px-6 lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-[17px] font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>

        <p className="truncate text-xs text-slate-500">
          Pick up where you left off
        </p>
      </div>

      {/* <label className="hidden min-w-[240px] max-w-sm flex-1 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm text-slate-500 transition-colors duration-150 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 md:flex">
        <SearchS size={16} />

        <input
          type="search"
          placeholder="Search materials, people..."
          className="w-full bg-transparent text-sm text-neutral outline-none placeholder:text-slate-400"
        />

        <kbd className="hidden rounded-md border border-base-300 bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-slate-500 lg:inline">
          ⌘K
        </kbd>
      </label> */}

      <div className="flex items-center gap-3">
        <NotificationBell />

        <div className="hidden h-8 w-px bg-base-300 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initial}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">
              {authUser?.fullName || "User"}
            </p>

            <p className="text-[11px] capitalize text-slate-500">
              {authUser?.role || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;