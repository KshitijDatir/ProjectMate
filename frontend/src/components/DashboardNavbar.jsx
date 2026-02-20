import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Menu,
  X,
  Bell,
  User,
  LayoutDashboard,
  Users,
  Briefcase,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"

function DashboardNavbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { user, logout } = useAuth()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItemClass = (active) =>
    `flex items-center px-3 py-2 rounded-md text-sm ${
      active
        ? "text-blue-600 bg-blue-50 font-medium"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`

  const goToProjects = () => {
    navigate("/home?tab=projects")
  }

  const goToInternships = () => {
    navigate("/home?tab=internships")
  }

  const isHome = location.pathname === "/home"

  // 🔹 Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    setShowNotifications(false)

    if (notification.entityType === "REQUEST") {
      navigate(`/application/${notification.entityId}`)
    } else if (notification.entityType === "PROJECT") {
      navigate(`/projects/${notification.entityId}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden md:inline">
              ProjectMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">

            <Link
              to="/dashboard"
              className={navItemClass(location.pathname === "/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            <button
              onClick={goToProjects}
              className={navItemClass(isHome && activeSection === "projects")}
            >
              <Users className="w-4 h-4 mr-2" />
              Projects
            </button>

            <button
              onClick={goToInternships}
              className={navItemClass(isHome && activeSection === "internships")}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Internships
            </button>

            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50"
              >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-semibold text-sm">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`px-4 py-3 text-sm cursor-pointer border-b hover:bg-gray-50 ${
                          !n.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div>{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="hidden lg:inline text-gray-700">
                  {user?.name}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  My Profile
                </Link>

                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar