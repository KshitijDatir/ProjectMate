import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Briefcase,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

function InternshipDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInternship() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/internships/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Internship not found");
        const data = await res.json();
        setInternship(data.internship || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInternship();
  }, [id, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center" style={{ color: 'var(--accent)' }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );

  return (
    <>
      <DashboardNavbar />

      <main className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="mb-6 flex items-center gap-2 hologram-link"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back
          </button>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div
                className="p-6 rounded-xl border hologram-btn"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                  {internship.title}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <Building2 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>{internship.companyName}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Briefcase className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>{internship.role}</span>
                </div>
              </div>

              {/* Description Card */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  About the internship
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {internship.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Details Card */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Deadline</p>
                      <p style={{ color: 'var(--text)' }}>
                        {new Date(internship.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {internship.location && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Location</p>
                        <p style={{ color: 'var(--text)' }}>{internship.location}</p>
                      </div>
                    </div>
                  )}

                  {internship.salary && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Salary</p>
                        <p style={{ color: 'var(--text)' }}>{internship.salary}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Card */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Apply
                </h2>
                <a
                  href={internship.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-lg hologram-btn flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </a>
                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                  You'll be redirected to the application page
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default InternshipDetail;