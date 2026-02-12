import { useState } from "react"
import { Link } from "react-router-dom"

import "../UI/InteractiveCube.css" // Import the CSS
import InteractiveCube from "../UI/InteractiveCube"

function Hero() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false) // close mobile menu
    }
  }

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content - Minimal */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Build projects.
            <span className="block text-blue-600 mt-2">Find teammates.</span>
            <span className="block mt-2">Launch careers.</span>
          </h1>
          
          <p className="mt-6 text-gray-600">
            Connect with students, collaborate on projects, and discover internships 
            through our streamlined platform.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Free
            </Link>
            <button onClick={() => scrollToSection("how-it-works")} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              See How It Works
            </button>
          </div>
        </div>

        {/* Right - Interactive Cube  */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <InteractiveCube />
          </div>
        </div>

      </div>
      
      {/* Minimal background element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent -z-10"></div>
    </section>
  );
}

export default Hero;