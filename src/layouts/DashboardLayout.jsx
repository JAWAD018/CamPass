// DashboardLayout.jsx
import React, { useState } from "react";
import DashNav from "../Components/DashNav";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <DashNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto z-0">
        {/* Mobile Nav Button */}
        <button
          className="md:hidden m-4 text-white bg-[#7C3AED] px-3 py-2 text-2xl rounded z-50"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
