import { GraduationCap } from "lucide-react";
import { APP } from "../../constants/app";

const SidebarHeader = () => {
  return (
    <div className="border-b border-base-300 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content shadow">
          <GraduationCap size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold leading-none">
            {APP.NAME}
          </h1>

          <p className="mt-1 text-xs text-base-content/60">
            {APP.DESCRIPTION}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;