import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import { createInternship } from "../api/internshipsApi"

function CreateInternship() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const from = searchParams.get("from")

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    role: "",
    description: "",
    applicationLink: "",
    deadline: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    // basic validation
    if (
      !formData.title ||
      !formData.companyName ||
      !formData.role ||
      !formData.description ||
      !formData.applicationLink ||
      !formData.deadline
    ) {
      setError("Please fill all required fields")
      return
    }

    const payload = {
      title: formData.title,
      companyName: formData.companyName,
      role: formData.role,
      description: formData.description,
      applicationLink: formData.applicationLink,
      deadline: formData.deadline,
    }

    try {
      setLoading(true)
      await createInternship(token, payload)

      // redirect after success
      if (from === "dashboard") {
        navigate("/dashboard")
      } else {
        navigate("/home?tab=internships")
      }
    } catch (err) {
      setError(err.message || "Failed to create internship")
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
            Create Internship
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Internship Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Software Engineering Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="TechCorp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Backend Intern"
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
                placeholder="Work on Node.js and MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Application Link *
              </label>
              <input
                type="url"
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="https://company.com/apply"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Internship"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CreateInternship
