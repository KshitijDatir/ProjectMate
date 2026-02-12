import NameNavbar from '../components/NameNavbar';
import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      
      
      <NameNavbar />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;