import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from 'lucide-react';

function CTA() {
  return (
    <section className="py-24 relative overflow-hidden ripple" style={{ backgroundColor: 'var(--primary)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
          <Sparkles size={18} className="text-white" />
          <span className="text-white/90 text-sm">Join the community today</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to build something amazing?
        </h2>
        
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Start collaborating with students worldwide. It's free to begin, and you'll get access to hundreds of projects.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/register" 
            className="group inline-flex items-center space-x-3 px-10 py-5 bg-white rounded-xl hologram-btn text-xl font-semibold ripple"
            style={{ color: 'var(--primary)' }}
          >
            <span>Create Free Account</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-5 text-white/90 hover:text-white hologram-link ripple text-lg"
          >
            Learn more
          </button>
        </div>

        <p className="text-white/60 text-sm mt-6">
          No credit card required • Free for students
        </p>
      </div>
    </section>
  );
}

export default CTA;