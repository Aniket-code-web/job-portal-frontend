import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false); // avatar dropdown
  const dropdownRef = useRef();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false); // ⭐ NEW

  const initial = user?.sub?.charAt(0).toUpperCase();

  // 🔔 fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/my");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  // close dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
      if (!notifRef.current?.contains(e.target)) setNotifOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-white shadow">
        
        {/* LEFT */}
        <div className="flex items-center gap-6">
          
          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="text-xl font-extrabold">
            JobPortal
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="font-semibold text-gray-600 hover:text-black">
              Jobs
            </Link>

            {user?.role === "JOB_SEEKER" && (
              <Link to="/dashboard" className="font-semibold text-gray-600 hover:text-black">
                Dashboard
              </Link>
            )}

            {user?.role === "RECRUITER" && (
              <Link to="/recruiter/dashboard" className="font-semibold text-gray-600 hover:text-black">
                Dashboard
              </Link>
            )}

            <Link to="/saved-jobs" className="font-semibold text-gray-600 hover:text-black">
              Saved Jobs
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600">Login</Link>
              <Link to="/register" className="px-4 py-2 text-white bg-blue-600 rounded">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* 🔔 NOTIFICATIONS */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative text-xl"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 w-80 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    <div className="p-3 font-semibold border-b">Notifications</div>

                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={async () => {
                            if (!n.readStatus) {
                              await api.put(`/notifications/${n.id}/read`);
                              setNotifications(prev =>
                                prev.map(item =>
                                  item.id === n.id ? { ...item, readStatus: true } : item
                                )
                              );
                            }
                          }}
                          className={`p-3 text-sm border-b cursor-pointer ${
                            !n.readStatus ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-gray-50"
                          }`}
                        >
                          {n.message}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* USER INFO */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{user.sub}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>

              {/* AVATAR */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-600 rounded-full"
                >
                  {initial}
                </button>

                {open && (
                  <div className="absolute right-0 w-40 py-2 mt-2 bg-white border rounded-lg shadow-lg">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-4">
          <Link to="/jobs" onClick={() => setSidebarOpen(false)}>Jobs</Link>

          {user?.role === "JOB_SEEKER" && (
            <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          )}

          {user?.role === "RECRUITER" && (
            <Link to="/recruiter/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          )}

          <Link to="/saved-jobs" onClick={() => setSidebarOpen(false)}>Saved Jobs</Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;