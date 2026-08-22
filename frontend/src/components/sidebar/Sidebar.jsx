import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

import { navigation } from "../../constants/navigation";
import { APP } from "../../constants/app";
import { logout } from "../../store/authActions";

import SidebarItem from "./SidebarItem";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ${
        collapsed ? "w-[76px]" : "w-[248px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-[72px] items-center border-b border-slate-200 ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-content shadow-sm">
          TH
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight text-[#1E293B]">
              {APP.NAME}
            </p>

            <p className="truncate text-[11px] text-slate-500">
              Learn with focus
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Menu
          </p>
        )}

        {navigation.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-1 border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-[#1E293B] ${
            collapsed ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 ${
            collapsed ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          <LogOut size={18} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;