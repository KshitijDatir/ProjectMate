import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Palette } from 'lucide-react';

function AuthLayout({ children, title, subtitle }) {
  const { mode, toggleMode, toggleScheme } = useTheme();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        {/* Theme toggles - top right */}
        <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
          <button
            onClick={toggleMode}
            className="p-2 rounded-full hologram-btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-label="Toggle light/dark"
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={toggleScheme}
            className="p-2 rounded-full hologram-btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-label="Toggle color scheme"
          >
            <Palette size={18} />
          </button>
        </div>

        {/* Simple gradient overlay instead of complex blob */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
          <Link to="/" className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>P</span>
              </div>
              <span className="text-3xl font-bold">ProjectMate</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-center mb-4">{title}</h1>
          <p className="text-xl text-white/80 text-center max-w-md">{subtitle}</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="w-full max-w-md">
          {/* Mobile theme toggles */}
          <div className="flex justify-end mb-4 lg:hidden">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMode}
                className="p-2 rounded-full hologram-btn"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
              >
                {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={toggleScheme}
                className="p-2 rounded-full hologram-btn"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
              >
                <Palette size={18} />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;