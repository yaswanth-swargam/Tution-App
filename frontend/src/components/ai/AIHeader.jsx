
import { Menu, Sparkles } from "lucide-react";

const AIHeader = ({
  title = "AI Assistant",
  onMenuClick,
  onMoreClick,
}) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-base-300 bg-base-100 px-3 sm:px-5">
      {/* Left Side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          aria-label="Open AI conversations"
        >
          <Menu size={20} />
        </button>

        {/* AI Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles size={19} />
        </div>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold sm:text-base">
            {title}
          </h1>

          <p className="hidden text-xs text-base-content/50 sm:block">
            Your learning assistant
          </p>
        </div>
      </div>


    </header>
  );
};

export default AIHeader;

