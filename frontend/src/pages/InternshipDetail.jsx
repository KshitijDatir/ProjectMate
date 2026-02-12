import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function InternshipDetail() {
  const { id } = useParams()
  const { token } = useAuth()

  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchInternship() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/internships/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          throw new Error("Internship not found")
        }

        const data = await res.json()
        setInternship(data.internship || data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInternship()
  }, [id, token])

  if (loading) return <p className="p-6">Loading internship...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <>
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">{internship.title}</h1>

        <p className="mt-2 text-gray-600">
          {internship.companyName} • {internship.role}
        </p>

        <p className="mt-6 text-gray-700">
          {internship.description}
        </p>

        <div className="mt-6 text-sm text-gray-500">
          Deadline: {new Date(internship.deadline).toLocaleDateString()}
        </div>

        {/* Apply section */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold">
            Apply for this internship
          </h3>

          <a
            href={internship.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Apply Now →
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default InternshipDetail
