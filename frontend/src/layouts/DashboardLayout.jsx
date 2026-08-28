import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-7 lg:px-8">
          <div className="mx-auto h-full min-h-0 w-full max-w-6xl overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
