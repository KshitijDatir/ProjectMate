import { Link } from "react-router-dom";
import InteractiveCube from "../UI/InteractiveCube";
import { Users, Award, Zap } from 'lucide-react';

function Hero() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ backgroundColor: 'var(--background)' }}>
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ 
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: 'var(--text)' }}>
              Build projects.
              <span className="block mt-2" style={{ color: 'var(--primary)' }}>Find teammates.</span>
              <span className="block mt-2" style={{ color: 'var(--accent)' }}>Launch careers.</span>
            </h1>
            
            <p className="text-xl" style={{ color: 'var(--text-muted)' }}>
              Connect with students, collaborate on projects, and discover internships 
              through our streamlined platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 rounded-lg hologram-btn font-semibold text-lg ripple"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                Start Free
              </Link>
              <button 
                onClick={() => scrollToSection("how-it-works")} 
                className="px-8 py-4 rounded-lg border-2 hologram-btn font-semibold text-lg ripple"
                style={{ borderColor: 'var(--primary)', color: 'var(--text)' }}
              >
                See How It Works
              </button>
            </div>

            {/* Stats without avatars */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users size={20} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold" style={{ color: 'var(--text)' }}>10K+</span> students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={20} style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold" style={{ color: 'var(--text)' }}>500+</span> projects
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={20} style={{ color: 'var(--secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold" style={{ color: 'var(--text)' }}>24/7</span> support
                </span>
              </div>
            </div>
          </div>

          {/* Right - Cube */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80 animate-float">
              <InteractiveCube />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;