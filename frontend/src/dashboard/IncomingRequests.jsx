import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Users, Edit, ChevronRight, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

function IncomingRequests() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState("")
  const [selectedProject, setSelectedProject] = useState(null)
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestsError, setRequestsError] = useState("")

  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/projects/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load projects")
        setProjects(data.projects)
      } catch (err) {
        setProjectsError(err.message)
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchMyProjects()
  }, [token])

  async function loadRequests(project) {
    setSelectedProject(project)
    setRequestsLoading(true)
    setRequestsError("")
    setRequests([])
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/projects/${project._id}/requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to load requests")
      setRequests(data.requests)
    } catch (err) {
      setRequestsError(err.message)
    } finally {
      setRequestsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock size={16} style={{ color: 'var(--accent)' }} />
      case 'ACCEPTED': return <CheckCircle size={16} style={{ color: 'var(--primary)' }} />
      case 'REJECTED': return <XCircle size={16} style={{ color: 'var(--text-muted)' }} />
      default: return null
    }
  }

  if (projectsLoading) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading your projects...</p>
  }
  if (projectsError) {
    return <p style={{ color: 'var(--accent)' }}>{projectsError}</p>
  }
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
        <p style={{ color: 'var(--text-muted)' }}>You haven’t created any projects yet.</p>
        <button
          onClick={() => navigate("/create-project")}
          className="mt-4 px-6 py-2 rounded-lg hologram-btn"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          Create your first project
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>My Projects</h1>

      {/* Project cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {projects.map((project) => (
          <div
            key={project._id}
            className="project-card"
            style={{
              backgroundColor: selectedProject?._id === project._id ? 'var(--secondary)' : 'var(--surface)',
              borderColor: selectedProject?._id === project._id ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <div onClick={() => loadRequests(project)} className="cursor-pointer">
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{project.title}</h2>
              <div className="flex items-center mt-2">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Requests</span>
                <span className="request-count-badge ml-auto">
                  <Users size={14} />
                  {project.requestCount || 0}
                </span>
              </div>
            </div>

            {/* Edit button – full width, hidden until hover */}
            <div className="edit-btn-container">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project._id}/edit`); }}
                className="hologram-btn px-3 py-2 rounded-md text-sm flex items-center gap-1 w-full justify-center"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                <Edit size={14} />
                Edit Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Requests section */}
      {selectedProject && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>Requests for {selectedProject.title}</span>
            <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
              {requests.length} total
            </span>
          </h2>

          {requestsLoading && <p style={{ color: 'var(--text-muted)' }}>Loading requests...</p>}
          {requestsError && <p style={{ color: 'var(--accent)' }}>{requestsError}</p>}
          {!requestsLoading && requests.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No requests for this project yet.</p>
          )}

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                onClick={() => navigate(`/application/${req._id}`)}
                className="request-card"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{req.applicantSnapshot.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {req.applicantSnapshot.college} • {req.applicantSnapshot.branch}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(req.status)}
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: req.status === 'PENDING' ? 'var(--accent)' : req.status === 'ACCEPTED' ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 sop-preview">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--text)' }}>SOP:</span> {req.sop}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/application/${req._id}`); }}
                    className="hologram-link text-sm flex items-center gap-1"
                    style={{ color: 'var(--primary)' }}
                  >
                    <Eye size={16} />
                    View details
                    <ChevronRight size={16} />
                  </button>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IncomingRequests