import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-3xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to build something amazing?
        </h2>
        
        <p className="text-blue-100 mb-8">
          Start collaborating with students worldwide. It's free to begin.
        </p>

        <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold">
          Create Free Account
        </Link>
        
        <p className="text-blue-200 text-sm mt-4">
          No credit card required • Free for students
        </p>

      </div>
    </section>
  );
}

export default CTA;