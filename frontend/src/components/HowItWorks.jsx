import { UserPlus, FileText, Users } from 'lucide-react';

function HowItWorks() {
  const steps = [
    { 
      number: 1, 
      title: "Create Profile",
      desc: "Add your skills and academic background",
      icon: UserPlus
    },
    { 
      number: 2, 
      title: "Apply to Projects",
      desc: "Browse and apply to projects using SOPs",
      icon: FileText
    },
    { 
      number: 3, 
      title: "Collaborate & Grow",
      desc: "Work with your team and track progress",
      icon: Users
    }
  ];

  return (
    <section className="py-24" id="how-it-works" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            How It Works
          </h2>
          <p className="text-xl" style={{ color: 'var(--text-muted)' }}>
            Simple steps to get started
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center hologram-card"
                       style={{ backgroundColor: 'var(--surface)', border: `2px solid var(--primary)` }}>
                    <Icon size={40} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                       style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    {step.number}
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;