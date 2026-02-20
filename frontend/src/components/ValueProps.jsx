import { Users, FileText, Briefcase } from 'lucide-react';

function ValueProps() {
  const features = [
    {
      icon: Users,
      title: "Find Teammates",
      desc: "Connect with students based on skills and interests",
      color: "var(--primary)"
    },
    {
      icon: FileText,
      title: "SOP Applications",
      desc: "Quality-focused applications with structured workflows",
      color: "var(--secondary)"
    },
    {
      icon: Briefcase,
      title: "Career Hub",
      desc: "Discover internships and track applications",
      color: "var(--accent)"
    }
  ];

  return (
    <section className="py-24" id="features" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Why ProjectMate
          </h2>
          <p className="text-xl" style={{ color: 'var(--text-muted)' }}>
            Everything you need in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group hologram-card p-8 rounded-2xl transition-all duration-300 ${index === 1 ? 'md:-translate-y-5' : ''}`}
              style={{ backgroundColor: 'var(--background)' }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `rgba(var(--${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent'}-rgb), 0.2)` }}
                >
                  <feature.icon
                    size={40}
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ValueProps;