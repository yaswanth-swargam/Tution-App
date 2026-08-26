import { BookOpen, ChevronRight } from "lucide-react";

const SectionCard = ({ section, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-base-100 border border-base-300 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer text-left overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 inline-flex p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>

        {/* Section name */}
        <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-200">
          {section.name}
        </h3>

        {/* Section description or meta info */}
        <p className="text-sm text-base-content/60 mb-4">
          {section.description || "Educational community"}
        </p>

        {/* Footer with chevron */}
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