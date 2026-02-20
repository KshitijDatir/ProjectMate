import { Twitter, Linkedin, Github } from 'lucide-react';

function Footer() {
  const socials = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" }
  ];

  return (
    <footer className="py-12" style={{ backgroundColor: 'var(--footer-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'var(--primary)' }}>
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--footer-text)' }}>
                ProjectMate
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--footer-text-muted)' }}>
              Student collaboration platform for projects and career growth.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--footer-text)' }}>Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hologram-link" style={{ color: 'var(--footer-text-muted)' }}>
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hologram-link" style={{ color: 'var(--footer-text-muted)' }}>
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--footer-text)' }}>Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hologram-link" style={{ color: 'var(--footer-text-muted)' }}>
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hologram-link" style={{ color: 'var(--footer-text-muted)' }}>
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="hologram-link" style={{ color: 'var(--footer-text-muted)' }}>
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--footer-text)' }}>Connect</h3>
            <ul className="space-y-2 text-sm">
              {socials.map((social, idx) => (
                <li key={idx}>
                  <a href={social.href} className="hologram-link inline-flex items-center space-x-2" style={{ color: 'var(--footer-text-muted)' }}>
                    <social.icon size={16} />
                    <span>{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm"
             style={{ borderColor: 'var(--border)', color: 'var(--footer-text-muted)' }}>
          © {new Date().getFullYear()} ProjectMate. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;