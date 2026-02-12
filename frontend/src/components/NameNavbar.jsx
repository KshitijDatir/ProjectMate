import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

function NameNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false) // close mobile menu
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            ProjectMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-600 hover:text-blue-600"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-600 hover:text-blue-600"
          >
            How it works
          </button>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 px-3 py-1"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-gray-600 hover:text-blue-600"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-gray-600 hover:text-blue-600"
            >
              How it works
            </button>

            <div className="pt-4 border-t space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NameNavbar
