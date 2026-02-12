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
  Settings,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

function DashboardNavbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
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

  // 🔹 Helpers for navigation
  const goToProjects = () => {
    navigate("/home?tab=projects")
  }

  const goToInternships = () => {
    navigate("/home?tab=internships")
  }

  const isHome = location.pathname === "/home"

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo → Home */}
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

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={navItemClass(location.pathname === "/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            {/* Projects */}
            <button
              onClick={goToProjects}
              className={navItemClass(
                isHome && activeSection === "projects"
              )}
            >
              <Users className="w-4 h-4 mr-2" />
              Projects
            </button>

            {/* Internships */}
            <button
              onClick={goToInternships}
              className={navItemClass(
                isHome && activeSection === "internships"
              )}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Internships
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-t shadow-lg z-40">
            <div className="px-4 py-4 space-y-3">

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>

              <button
                onClick={() => {
                  goToProjects()
                  setIsOpen(false)
                }}
                className="flex items-center w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-5 h-5 mr-3" />
                Projects
              </button>

              <button
                onClick={() => {
                  goToInternships()
                  setIsOpen(false)
                }}
                className="flex items-center w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Briefcase className="w-5 h-5 mr-3" />
                Internships
              </button>

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </Link>

            
              <div className="border-t pt-3 mt-3">
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-10 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  )
}

export default DashboardNavbar
