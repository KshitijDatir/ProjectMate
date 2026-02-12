import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function ProjectDetail() {
  // URL param
  const { id } = useParams()

  // Auth
  const { token } = useAuth()

  // Project state
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Apply (SOP) state
  const [sop, setSop] = useState("")
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch project details
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          throw new Error("Project not found")
        }

        const data = await res.json()
        setProject(data.project)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, token])

  // Apply to project
  const handleApply = async () => {
    if (!sop.trim()) {
      setApplyError("Statement of Purpose is required")
      return
    }

    setApplying(true)
    setApplyError("")
    setSuccess("")

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
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to apply")
      }

      setSuccess("Application sent successfully")
      setSop("")
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setApplying(false)
    }
  }

  // UI states
  if (loading) return <p className="p-6">Loading project...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <>
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Project info */}
        <h1 className="text-3xl font-bold">{project.title}</h1>

        <p className="mt-4 text-gray-600">{project.description}</p>

        <div className="mt-6">
          <h3 className="font-semibold">Required Skills</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {Array.isArray(project.requiredSkills) &&
              project.requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Team: {project.currentTeamSize}/{project.teamSize}
        </div>

        {/* Apply section */}
        {project.status === "OPEN" && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold">Apply to this project</h3>

            <textarea
              value={sop}
              onChange={(e) => setSop(e.target.value)}
              placeholder="Why do you want to join this project?"
              className="mt-3 w-full border rounded-md p-3 h-32 focus:ring-2 focus:ring-blue-500"
            />

            {applyError && (
              <p className="text-red-600 mt-2">{applyError}</p>
            )}
            {success && (
              <p className="text-green-600 mt-2">{success}</p>
            )}

            <button
              onClick={handleApply}
              disabled={applying}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {applying ? "Applying..." : "Apply"}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default ProjectDetail
