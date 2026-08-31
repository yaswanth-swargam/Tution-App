import { BookOpen, ChevronRight } from "lucide-react";

const SectionCard = ({
  section,
  onClick,
  unreadCount = 0,
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-base-100 border border-base-300 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer text-left overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

      {/* Content */}
      <div className="relative z-10">

        {/* Icon + unread badge */}
        <div className="flex items-start justify-between mb-4">

          <div className="inline-flex p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>

          {/* Unread count */}
          {unreadCount > 0 && (
            <span
              className="
                flex
                min-w-6
                h-6
                items-center
                justify-center
                rounded-full
                bg-error
                px-2
                text-xs
                font-bold
                text-error-content
              "
            >
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}

        </div>

        {/* Section name */}
        <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-200">
          {section.name}
        </h3>

        {/* Section description */}
        <p className="text-sm text-base-content/60 mb-4">
          {section.description ||
            "Educational community"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-base-300/50">

          <span className="text-xs font-medium text-base-content/50">
            Tap to join
          </span>

          <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />

        </div>

      </div>
    </button>
  );
};

export default SectionCard;