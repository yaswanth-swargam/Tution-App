import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, collapsed }) => {
  const { icon: Icon, label, path } = item;

  return (
    <NavLink
      to={path}
      end
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "flex items-center rounded-xl text-sm font-medium transition-colors duration-150",
          collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-500 hover:bg-slate-100 hover:text-neutral",
        ].join(" ")
      }
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

export default SidebarItem;
