import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  LayoutDashboard,
  Users,
  Briefcase,
  Sun,
  Moon,
  Palette,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";

function DashboardNavbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { mode, toggleMode, toggleScheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = (active) =>
    `flex items-center px-3 py-2 rounded-md text-sm hologram-link ${
      active ? "font-medium" : ""
    }`;

  const goToProjects = () => navigate("/home?tab=projects");
  const goToInternships = () => navigate("/home?tab=internships");

  const isHome = location.pathname === "/home";

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) await markAsRead(notification._id);
    setShowNotifications(false);

    if (notification.entityType === "REQUEST") {
      navigate(`/application/${notification.entityId}`);
    } else if (notification.entityType === "PROJECT") {
      navigate(`/projects/${notification.entityId}`);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{ backgroundColor: "var(--navbar-bg)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--text)" }}>
              ProjectMate
            </span>
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={navItemClass(location.pathname === "/dashboard")}
              style={{
                color: location.pathname === "/dashboard" ? "var(--primary)" : "var(--text)",
                backgroundColor: location.pathname === "/dashboard" ? "var(--secondary)" : "transparent",
              }}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            <button
              onClick={goToProjects}
              className={navItemClass(isHome && activeSection === "projects")}
              style={{
                color: isHome && activeSection === "projects" ? "var(--primary)" : "var(--text)",
                backgroundColor: isHome && activeSection === "projects" ? "var(--secondary)" : "transparent",
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Projects
            </button>

            <button
              onClick={goToInternships}
              className={navItemClass(isHome && activeSection === "internships")}
              style={{
                color: isHome && activeSection === "internships" ? "var(--primary)" : "var(--text)",
                backgroundColor: isHome && activeSection === "internships" ? "var(--secondary)" : "transparent",
              }}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Internships
            </button>

            {/* Theme Toggles */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
              aria-label="Toggle light/dark"
            >
              {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={toggleScheme}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
              aria-label="Toggle color scheme"
            >
              <Palette size={18} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hologram-btn"
                style={{ color: "var(--text)" }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-xs text-white rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs hover:underline"
                        style={{ color: "var(--primary)" }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className="px-4 py-3 text-sm cursor-pointer border-b hover:bg-opacity-50"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor: !n.isRead ? "var(--secondary)" : "transparent",
                          color: "var(--text)",
                        }}
                      >
                        <div>{n.message}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
<div className="relative" ref={profileRef}>
  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="flex items-center space-x-2 px-3 py-2 rounded-md hologram-link"
    style={{ color: "var(--text)" }}
  >
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "var(--secondary)" }}
    >
      <User className="w-4 h-4" style={{ color: "var(--primary)" }} />
    </div>
    <span className="hidden lg:inline">{user?.name}</span>
  </button>

  {showProfileMenu && (
    <div
      className="absolute right-0 mt-2 w-48 border rounded-lg shadow-lg py-2 z-50"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Link
        to="/profile"
        className="dropdown-item primary-item"
        onClick={() => setShowProfileMenu(false)}
      >
        My Profile
      </Link>

      <div className="border-t my-1" style={{ borderColor: "var(--border)" }} />

      <button
        onClick={handleLogout}
        className="dropdown-item accent-item"
      >
        Sign Out
      </button>
    </div>
  )}
</div>
          </div>

          {/* Mobile: Theme toggles + menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
              aria-label="Toggle light/dark mode"
            >
              {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={toggleScheme}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
              aria-label="Toggle color scheme"
            >
              <Palette size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md"
              style={{ color: "var(--text)" }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu – collapsible */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col" style={{ backgroundColor: "var(--surface)" }}>
            <Link
              to="/dashboard"
              className="mobile-nav-item"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => { goToProjects(); setIsOpen(false); }}
              className="mobile-nav-item"
            >
              Projects
            </button>
            <button
              onClick={() => { goToInternships(); setIsOpen(false); }}
              className="mobile-nav-item"
            >
              Internships
            </button>

            <div className="border-t" style={{ borderColor: "var(--border)" }}>
              <Link
                to="/profile"
                className="mobile-nav-item"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-nav-item"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default DashboardNavbar;