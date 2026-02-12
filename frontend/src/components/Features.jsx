import FeatureCard from "./FeatureCard"

function Features() {
  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <FeatureCard
          title="Browse Student Projects"
          description="Explore live projects, view required skills, and apply with a project-specific SOP."
          buttonText="View Projects"
        />

        <FeatureCard
          title="Explore Internships"
          description="Discover peer-shared internship opportunities across domains and companies."
          buttonText="View Internships"
        />

      </div>
    </section>
  )
}

export default Features
