import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, signOut } from "../auth/config";
import { useAuthState } from "react-firebase-hooks/auth";

function DashNav({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((err) => {
        console.error("Logout error:", err);
        alert("Logout failed.");
      });
  };

  const linkClass = (path) =>
    `hover:text-purple-600 ${
      location.pathname === path ? "text-purple-600 font-semibold" : ""
    }`;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-[#F9FAFB] border-r border-gray-300 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:z-auto`}
    >
      <div className="flex flex-col h-full justify-between overflow-y-auto p-4">
        {/* Top content */}
        <div>
          <div className="flex justify-between items-center mb-6 md:hidden">
            <div className="text-2xl font-bold">
              <Link to="/" onClick={() => setSidebarOpen(false)}>Campass</Link>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-xl">✖</button>
          </div>

          <div className="hidden md:block text-2xl font-bold mb-6">
            <Link to="/">Campass</Link>
          </div>

          <div className="flex flex-col space-y-4 font-medium">
            <Link to="/dashboard" className={linkClass("/dashboard")} onClick={() => setSidebarOpen(false)}>🏠 Dashboard</Link>
            <Link to="/events" className={linkClass("/events")} onClick={() => setSidebarOpen(false)}>📅 Events</Link>
            <Link to="/students" className={linkClass("/students")} onClick={() => setSidebarOpen(false)}>👥 Students</Link>
            <Link to="/checkin" className={linkClass("/checkin")} onClick={() => setSidebarOpen(false)}> Check-in</Link>
            <Link to="/report" className={linkClass("/report")} onClick={() => setSidebarOpen(false)}>📊 Report</Link>
            <Link to="/settings" className={linkClass("/settings")} onClick={() => setSidebarOpen(false)}>⚙️ Settings</Link>
          </div>
        </div>

        {/* Bottom buttons */}
        {user && (
          <div className="space-y-3 pt-6">
            <button
              onClick={() => {
                alert("Account Section");
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              👤 Account
            </button>
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashNav;
