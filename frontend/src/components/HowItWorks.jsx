function HowItWorks() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-600">Simple steps to get started</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Create Profile', 'Apply to Projects', 'Collaborate & Grow'].map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                  {index + 1}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">{step}</h3>
                  <p className="text-gray-600">
                    {index === 0 && 'Add your skills and academic background'}
                    {index === 1 && 'Browse and apply to projects using SOPs'}
                    {index === 2 && 'Work with your team and track progress'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;