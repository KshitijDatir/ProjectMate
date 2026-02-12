import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { createProject } from "../api/projectsApi"


function CreateProject() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const from = searchParams.get("from")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    requiredSkills: "",
    teamSize: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.description || !formData.teamSize) {
      setError("Please fill all required fields")
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      details: formData.details,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean),
      teamSize: Number(formData.teamSize)
    }

    try {
      setLoading(true)
      await createProject(token, payload)

      // redirect based on where user came from
      if (from === "dashboard") {
        navigate("/dashboard")
      } else {
        navigate("/home?tab=projects")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardNavbar />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Project
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border shadow-sm">

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

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
                placeholder="Smart Job Tracker"
              />
            </div>

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
                placeholder="React + Node + MongoDB"
              />
            </div>

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
                placeholder="React, Node.js, MongoDB"
              />
            </div>

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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CreateProject
