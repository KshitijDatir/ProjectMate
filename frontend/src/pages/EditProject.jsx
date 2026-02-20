import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function EditProject() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    requiredSkills: "",
    teamSize: ""
  })

  const [membersCount, setMembersCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  // ==========================
  // FETCH PROJECT
  // ==========================
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to load project")
        }

        setFormData({
          title: data.project.title,
          description: data.project.description,
          details: data.project.details || "",
          requiredSkills: data.project.requiredSkills?.join(", ") || "",
          teamSize: data.project.teamSize
        })

        // 🔥 important
        setMembersCount(data.project.members?.length || 0)

      } catch (err) {
        setError(err.message)
      } finally {
        setFetching(false)
      }
    }

    fetchProject()
  }, [id, token])

  // ==========================
  // HANDLE CHANGE
  // ==========================
  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    const newTeamSize = Number(formData.teamSize)

    if (!formData.title || !formData.description || !newTeamSize) {
      setError("Please fill all required fields")
      return
    }

    if (isNaN(newTeamSize) || newTeamSize < 1) {
      setError("Invalid team size")
      return
    }

    // ❌ Cannot reduce below current members
    if (newTeamSize < membersCount) {
      setError("Team size cannot be smaller than current members")
      return
    }

    // ⚠ Confirm if project will close
    if (newTeamSize === membersCount) {
      const confirmClose = window.confirm(
        "Team size equals current members. This will CLOSE the project. Continue?"
      )
      if (!confirmClose) return
    }

    try {
      setLoading(true)

      const payload = {
        title: formData.title,
        description: formData.description,
        details: formData.details,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map(skill => skill.trim())
          .filter(Boolean),
        teamSize: newTeamSize
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error(
            "This project was modified by someone else. Please refresh and try again."
          )
        }

        throw new Error(data.message || "Update failed")
      }

      // Redirect to my projects page
      navigate("/dashboard")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <p className="p-6">Loading project...</p>
  }

  return (
    <>
      <DashboardNavbar />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Project
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white p-6 rounded-xl border shadow-sm"
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Team Size *
              </label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min={1}
                className="w-full border rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current members: {membersCount}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Project"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default EditProject
