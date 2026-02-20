import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to load projects")
        }

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load requests")
      }

      setRequests(data.requests)
    } catch (err) {
      setRequestsError(err.message)
    } finally {
      setRequestsLoading(false)
    }
  }

  if (projectsLoading) {
    return <p className="text-gray-600">Loading your projects...</p>
  }

  if (projectsError) {
    return <p className="text-red-600">{projectsError}</p>
  }

  if (projects.length === 0) {
    return (
      <p className="text-gray-600">
        You haven’t created any projects yet.
      </p>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>

      {/* ================= PROJECT LIST ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {projects.map((project) => (
          <div
            key={project._id}
            className={`border rounded-lg p-4 hover:bg-gray-50 ${
              selectedProject?._id === project._id
                ? "border-blue-500 bg-blue-50"
                : "bg-white"
            }`}
          >
            {/* Clickable area for selecting project */}
            <div
              onClick={() => loadRequests(project)}
              className="cursor-pointer"
            >
              <h2 className="font-semibold text-gray-900">
                {project.title}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Requests:{" "}
                <span className="font-medium">
                  {project.requestCount}
                </span>
              </p>
            </div>

            {/* Edit Button */}
            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/projects/${project._id}/edit`)
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= REQUEST LIST ================= */}
      {selectedProject && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Requests for {selectedProject.title}
          </h2>

          {requestsLoading && (
            <p className="text-gray-600">Loading requests...</p>
          )}

          {requestsError && (
            <p className="text-red-600">{requestsError}</p>
          )}

          {!requestsLoading && requests.length === 0 && (
            <p className="text-gray-600">
              No requests for this project yet.
            </p>
          )}

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                onClick={() => navigate(`/application/${req._id}`)}
                className="bg-white border rounded-lg p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900">
                  {req.applicantSnapshot.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {req.applicantSnapshot.college} • {req.applicantSnapshot.branch}
                </p>

                <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                  <span className="font-medium">SOP:</span> {req.sop}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Status: {req.status}
                  </span>

                  <span className="text-xs text-blue-600 font-medium">
                    Click to view more →
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
