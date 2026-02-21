import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Award,
  Edit3,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sop, setSop] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [success, setSuccess] = useState("");

  const [myRequest, setMyRequest] = useState(null);
  const [editingSop, setEditingSop] = useState(false);
  const [editedSop, setEditedSop] = useState("");
  const [sopSaving, setSopSaving] = useState(false);
  const [sopError, setSopError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setProject(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();

    async function checkApplied() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const found = (data.requests || []).find(
          (r) => (r.project?._id || r.project) === id
        );
        if (found) setMyRequest(found);
      } catch {}
    }

    checkApplied();
  }, [id, token]);

  const handleApply = async () => {
    if (!sop.trim()) {
      setApplyError("Statement of Purpose is required");
      return;
    }
    setApplying(true);
    setApplyError("");
    setSuccess("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/projects/${project._id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sop }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply");
      setSuccess("Application sent successfully");
      setSop("");
      setMyRequest(data.request || { status: "PENDING", sop });
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleSaveSop = async () => {
    if (!editedSop.trim()) {
      setSopError("SOP cannot be empty");
      return;
    }
    setSopSaving(true);
    setSopError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${myRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sop: editedSop, __v: myRequest.__v }),
        }
      );
      const data = await res.json();
      if (res.status === 409) {
        setSopError("Request was updated externally. Please refresh.");
        return;
      }
      if (!res.ok) throw new Error(data.message || "Failed to update SOP");
      setMyRequest(data.request);
      setEditingSop(false);
      setEditedSop("");
    } catch (err) {
      setSopError(err.message);
    } finally {
      setSopSaving(false);
    }
  };

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

  if (!project) return null;

  const isOwner = user?._id === project.owner?._id;
  const isFull = project.members.length >= project.teamSize;

  // Status badge color
  const statusColor =
    project.status === "OPEN"
      ? "var(--primary)"
      : project.status === "CLOSED"
      ? "var(--accent)"
      : "var(--text-muted)";

  return (
    <>
      <DashboardNavbar />

      <main className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 hologram-link"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back
          </button>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content (left column) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Title & Owner */}
              <div
                className="p-6 rounded-xl border hologram-btn"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
                      >
                        {project.owner?.name?.charAt(0) || "U"}
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {project.owner?.name || "Unknown Owner"}
                      </span>
                    </div>
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: `rgba(${project.status === "OPEN" ? "45,212,191" : "194,109,59"}, 0.15)`,
                      color: statusColor,
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  About the project
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {project.description}
                </p>
              </div>

              {/* Team Members */}
              <div
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  Team Members ({project.members.length}/{project.teamSize})
                </h2>

                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div
                      key={member._id}
                      onClick={() => navigate(`/users/${member._id}`)}
                      className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                        style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
                      >
                        {member.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: 'var(--text)' }}>
                          {member.name}
                          {member._id === project.owner?._id && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                              Owner
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.skills?.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded"
                              style={{ backgroundColor: 'var(--secondary)', color: 'var(--text)' }}
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills?.length > 3 && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              +{member.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (right column) */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Metadata Card */}
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
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Created</p>
                      <p style={{ color: 'var(--text)' }}>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Team size</p>
                      <p style={{ color: 'var(--text)' }}>
                        {project.members.length} / {project.teamSize}
                      </p>
                    </div>
                  </div>

                  {project.requiredSkills?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Required skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded"
                            style={{ backgroundColor: 'var(--secondary)', color: 'var(--text)' }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Card */}
              {!isOwner && project.status === "OPEN" && !isFull && (
                <div
                  className="p-6 rounded-xl border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                    {myRequest ? "Your Application" : "Apply to this project"}
                  </h2>

                  {myRequest ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {myRequest.status === "PENDING" && (
                          <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        )}
                        {myRequest.status === "ACCEPTED" && (
                          <CheckCircle className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        )}
                        {myRequest.status === "REJECTED" && (
                          <X className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        )}
                        <span
                          className="font-medium"
                          style={{
                            color:
                              myRequest.status === "PENDING"
                                ? 'var(--accent)'
                                : myRequest.status === "ACCEPTED"
                                ? 'var(--primary)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {myRequest.status}
                        </span>
                      </div>

                      {editingSop ? (
                        <div>
                          <textarea
                            value={editedSop}
                            onChange={(e) => setEditedSop(e.target.value)}
                            rows="4"
                            className="w-full p-3 rounded-lg border text-sm focus:ring-2"
                            style={{
                              backgroundColor: 'var(--background)',
                              borderColor: 'var(--border)',
                              color: 'var(--text)',
                              '--tw-ring-color': 'var(--primary)',
                            }}
                          />
                          {sopError && (
                            <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>
                              {sopError}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={handleSaveSop}
                              disabled={sopSaving}
                              className="flex-1 py-2 rounded-lg hologram-btn text-sm disabled:opacity-50"
                              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                            >
                              {sopSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => { setEditingSop(false); setSopError(""); }}
                              className="px-4 py-2 rounded-lg border hologram-link text-sm"
                              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className="p-4 rounded-lg mb-4"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                          >
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              <span className="font-medium" style={{ color: 'var(--text)' }}>Your SOP:</span>
                            </p>
                            <p className="mt-2 text-sm" style={{ color: 'var(--text)' }}>
                              {myRequest.sop}
                            </p>
                          </div>

                          {myRequest.status === "PENDING" && (
                            <button
                              onClick={() => { setEditingSop(true); setEditedSop(myRequest.sop); }}
                              className="w-full py-2 rounded-lg border hologram-link text-sm flex items-center justify-center gap-2"
                              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit SOP
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={sop}
                        onChange={(e) => setSop(e.target.value)}
                        placeholder="Why do you want to join this project?"
                        rows="4"
                        className="w-full p-3 rounded-lg border text-sm focus:ring-2"
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          color: 'var(--text)',
                          '--tw-ring-color': 'var(--primary)',
                        }}
                      />
                      {applyError && (
                        <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>
                          {applyError}
                        </p>
                      )}
                      {success && (
                        <p className="text-sm mt-2" style={{ color: 'var(--primary)' }}>
                          {success}
                        </p>
                      )}
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full mt-4 py-2 rounded-lg hologram-btn disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                      >
                        <Send className="w-4 h-4" />
                        {applying ? "Applying..." : "Apply"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Project Full Message */}
              {isFull && (
                <div
                  className="p-6 rounded-xl border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <p className="text-center" style={{ color: 'var(--accent)' }}>
                    This project is full.
                  </p>
                </div>
              )}

              {/* Closed Message */}
              {project.status === "CLOSED" && (
                <div
                  className="p-6 rounded-xl border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <p className="text-center" style={{ color: 'var(--accent)' }}>
                    This project is closed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProjectDetail;