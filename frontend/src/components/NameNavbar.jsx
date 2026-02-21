import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function NameNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, toggleScheme, toggleMode } = useTheme();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{ backgroundColor: 'var(--navbar-bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo – visible on all screens */}
        <Link to="/" className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            ProjectMate
          </span>
        </Link>

        {/* Desktop Navigation (unchanged) */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("features")}
            className="hologram-link px-3 py-1 rounded-md"
            style={{ color: 'var(--text)' }}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hologram-link px-3 py-1 rounded-md"
            style={{ color: 'var(--text)' }}
          >
            How it works
          </button>

          {/* Theme Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMode}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
              aria-label="Toggle light/dark mode"
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={toggleScheme}
              className="p-2 rounded-full hologram-btn"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
              aria-label="Toggle color scheme"
            >
              <Palette size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="hologram-link px-3 py-1 rounded-md"
              style={{ color: 'var(--text)' }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg hologram-btn font-medium"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        {/* Mobile toggle and theme controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hologram-btn"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
            aria-label="Toggle light/dark mode"
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={toggleScheme}
            className="p-2 rounded-full hologram-btn"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
            aria-label="Toggle color scheme"
          >
            <Palette size={18} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md"
            style={{ color: 'var(--text)' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu – now using custom .mobile-nav-item */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col" style={{ backgroundColor: 'var(--surface)' }}>
            <button
              onClick={() => scrollToSection("features")}
              className="mobile-nav-item"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="mobile-nav-item"
            >
              How it works
            </button>
            {/* Auth links */}
            <div className="border-t" style={{ borderColor: 'var(--border)' }}>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mobile-nav-item"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="mobile-nav-item"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NameNavbar;