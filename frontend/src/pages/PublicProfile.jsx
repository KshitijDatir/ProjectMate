import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function PublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${id}`
        )

        if (!res.ok) {
          throw new Error("Profile not found")
        }

        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) return <p className="p-6">Loading profile...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <>
      {/* NAVBAR */}
      {token ? (
  <DashboardNavbar />
) : (
  <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      {/* Logo (match NameNavbar UI exactly) */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="text-xl font-bold text-gray-900">
          ProjectMate
        </span>
      </div>

      {/* Right Side (custom functionality) */}
      <div className="hidden md:flex items-center space-x-8">

        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-blue-600"
        >
          What is ProjectMate?
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-blue-600 px-3 py-1"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up Free
          </button>
        </div>
      </div>

    </div>
  </nav>
)}


      <main className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Public Viewer Banner */}
        {!token && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
            You are viewing a public developer profile.
          </div>
        )}

        {/* Profile Header */}
        <h1 className="text-3xl font-bold">{user.name}</h1>

        <div className="mt-4 text-gray-600 space-y-1">
          {user.college && (
            <p><strong>College:</strong> {user.college}</p>
          )}
          {user.branch && (
            <p><strong>Branch:</strong> {user.branch}</p>
          )}
          {user.year && (
            <p><strong>Year:</strong> {user.year}</p>
          )}
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold">Skills</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        {user.resumeUrl && (
          <div className="mt-6">
            <a
              href={user.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              View Resume
            </a>
          </div>
        )}

        {/* CTA Section for Public Visitors */}
        {!token && (
          <div className="mt-12 text-center border-t pt-8">
            <h3 className="text-lg font-semibold">
              Want to collaborate with developers like {user.name}?
            </h3>

            <p className="text-gray-600 mt-2">
              Join ProjectMate and build projects together.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Free Account
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default PublicProfile
