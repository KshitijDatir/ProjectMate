import { Users, FileText, Briefcase } from 'lucide-react';

function ValueProps() {
  return (
    <section className="py-16 bg-gray-50 " id="features">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why ProjectMate</h2>
          <p className="mt-2 text-gray-600">Everything you need in one place</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Find Teammates</h3>
            <p className="text-gray-600">Connect with students based on skills and interests</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">SOP Applications</h3>
            <p className="text-gray-600">Quality-focused applications with structured workflows</p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Career Hub</h3>
            <p className="text-gray-600">Discover internships and track applications</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ValueProps;