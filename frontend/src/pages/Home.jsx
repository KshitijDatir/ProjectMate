import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import ProjectFilters from "../components/ProjectFilters";
import ProjectCard from "../components/ProjectCard";
import InternshipCard from "../components/InternshipCard";
import { fetchProjects } from "../api/projectsApi";
import { fetchInternships } from "../api/internshipsApi";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // Match my skills filter (PROJECTS ONLY)
  const [matchMySkills, setMatchMySkills] = useState(false);
  // UI state
  const [activeSection, setActiveSection] = useState("home");
  // Data
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInternships, setRecentInternships] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  // Applied project IDs (for badge)
  const [appliedProjectIds, setAppliedProjectIds] = useState(new Set());
  // Loading / error
  const [homeLoading, setHomeLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [internshipsLoading, setInternshipsLoading] = useState(false);
  const [homeError, setHomeError] = useState("");
  const [projectsError, setProjectsError] = useState("");
  const [internshipsError, setInternshipsError] = useState("");
  // Filters
  const [projectSearch, setProjectSearch] = useState("");
  const [projectSort, setProjectSort] = useState("newest");
  const [internshipSearch, setInternshipSearch] = useState("");
  const [internshipSort, setInternshipSort] = useState("newest");
  const [searchParams] = useSearchParams();

  // Tab control via URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "projects") setActiveSection("projects");
    else if (tab === "internships") setActiveSection("internships");
    else setActiveSection("home");
  }, [searchParams]);

  // Fetch applied project IDs
  useEffect(() => {
    if (!token) return;
    async function loadApplied() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const ids = new Set(
          (data.requests || []).map((r) => r.project?._id || r.project)
        );
        setAppliedProjectIds(ids);
      } catch {
        // silently ignore
      }
    }
    loadApplied();
  }, [token]);

  // Home data
  useEffect(() => {
    if (activeSection !== "home" || !token) return;
    async function loadHome() {
      setHomeLoading(true);
      setHomeError("");
      try {
        const projectsData = await fetchProjects(token);
        const internshipsData = await fetchInternships(token);
        const allProjects = Array.isArray(projectsData)
          ? projectsData
          : projectsData.projects || [];
        setRecentProjects(allProjects.slice(0, 6));
        setRecentInternships(internshipsData.slice(0, 6));
      } catch (err) {
        setHomeError(err.message);
      } finally {
        setHomeLoading(false);
      }
    }
    loadHome();
  }, [activeSection, token]);

  // Projects data
  useEffect(() => {
    if (activeSection !== "projects") return;
    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");
      try {
        const data = await fetchProjects(token);
        const list = Array.isArray(data) ? data : data.projects || [];
        setProjects(list);
        setFilteredProjects(list);
      } catch (err) {
        setProjectsError(err.message);
      } finally {
        setProjectsLoading(false);
      }
    }
    loadProjects();
  }, [activeSection, token]);

  // Internships data
  useEffect(() => {
    if (activeSection !== "internships") return;
    async function loadInternships() {
      setInternshipsLoading(true);
      setInternshipsError("");
      try {
        const data = await fetchInternships(token);
        setInternships(data);
        setFilteredInternships(data);
      } catch (err) {
        setInternshipsError(err.message);
      } finally {
        setInternshipsLoading(false);
      }
    }
    loadInternships();
  }, [activeSection, token]);

  // Project filter logic
  useEffect(() => {
    if (!projects.length) return;
    let filtered = [...projects];
    if (matchMySkills && user?.skills?.length) {
      const userSkillsLower = user.skills.map(s => s.trim().toLowerCase());
      filtered = filtered.filter(project =>
        project.requiredSkills?.some(skill =>
          userSkillsLower.includes(skill.trim().toLowerCase())
        )
      );
    }
    if (projectSearch) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.description?.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.requiredSkills?.some(skill =>
          skill.toLowerCase().includes(projectSearch.toLowerCase())
        )
      );
    }
    if (projectSort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setFilteredProjects(filtered);
  }, [projects, projectSearch, projectSort, matchMySkills, user]);

  // Internship filter logic
  useEffect(() => {
    if (!internships.length) return;
    let filtered = [...internships];
    if (internshipSearch) {
      filtered = filtered.filter(i =>
        i.title?.toLowerCase().includes(internshipSearch.toLowerCase()) ||
        i.companyName?.toLowerCase().includes(internshipSearch.toLowerCase()) ||
        i.role?.toLowerCase().includes(internshipSearch.toLowerCase())
      );
    }
    if (internshipSort === "newest") {
      filtered.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    setFilteredInternships(filtered);
  }, [internships, internshipSearch, internshipSort]);

  return (
    <>
      <DashboardNavbar activeSection={activeSection} />

      <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* HOME DASHBOARD */}
          {activeSection === "home" && (
            <div className="space-y-12">
              {/* Welcome Card */}
              <div
                className="border rounded-xl p-6 shadow-sm flex items-center justify-between"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    Welcome to ProjectMate
                  </h1>
                  <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
                    Connect with students, collaborate on projects, and discover internship opportunities.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate("/create-internship?from=home")}
                    className="px-4 py-2 rounded-md border-2 hologram-btn font-medium"
                    style={{ borderColor: 'var(--primary)', color: 'var(--text)' }}
                  >
                    Create Project
                  </button>

                  <button
                    onClick={() => navigate("/create-internship?from=home")}
                    className="px-4 py-2 rounded-md border-2 hologram-btn font-medium"
                    style={{ borderColor: 'var(--primary)', color: 'var(--text)' }}
                  >
                    Create Internship
                  </button>
                </div>
              </div>

              {/* Recent Projects */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    Explore Projects
                  </h2>
                  <button
                    onClick={() => setActiveSection("projects")}
                    className="hologram-link font-medium"
                    style={{ color: 'var(--primary)' }}
                  >
                    View all →
                  </button>
                </div>

                {homeLoading ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
                ) : homeError ? (
                  <p style={{ color: 'var(--accent)' }}>{homeError}</p>
                ) : recentProjects.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No projects available yet.</p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProjects.map(project => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        hasApplied={appliedProjectIds.has(project._id)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Internships */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    Explore Internships
                  </h2>
                  <button
                    onClick={() => setActiveSection("internships")}
                    className="hologram-link font-medium"
                    style={{ color: 'var(--primary)' }}
                  >
                    View all →
                  </button>
                </div>

                {homeLoading ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading internships...</p>
                ) : homeError ? (
                  <p style={{ color: 'var(--accent)' }}>{homeError}</p>
                ) : recentInternships.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No internships available yet.</p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentInternships.map(internship => (
                      <InternshipCard key={internship._id} internship={internship} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {activeSection === "projects" && (
            <>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>All Projects</h1>

              <ProjectFilters
                scope="projects"
                searchQuery={projectSearch}
                onSearchChange={setProjectSearch}
                sortBy={projectSort}
                onSortChange={setProjectSort}
                matchMySkills={matchMySkills}
                onToggleMatchMySkills={() => setMatchMySkills(prev => !prev)}
              />

              {matchMySkills && (
                <p className="text-sm mb-4" style={{ color: 'var(--primary)' }}>
                  Showing projects matching your skills
                </p>
              )}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    hasApplied={appliedProjectIds.has(project._id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* INTERNSHIPS SECTION */}
          {activeSection === "internships" && (
            <>
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>All Internships</h1>

              <ProjectFilters
                scope="internships"
                searchQuery={internshipSearch}
                onSearchChange={setInternshipSearch}
                sortBy={internshipSort}
                onSortChange={setInternshipSort}
              />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInternships.map(i => (
                  <InternshipCard key={i._id} internship={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Home;