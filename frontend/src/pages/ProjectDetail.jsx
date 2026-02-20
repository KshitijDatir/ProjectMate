import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [sop, setSop] = useState("")
  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState("")
  const [success, setSuccess] = useState("")

  // existing application for this project
  const [myRequest, setMyRequest] = useState(null)

  // edit SOP state
  const [editingSop, setEditingSop] = useState(false)
  const [editedSop, setEditedSop] = useState("")
  const [sopSaving, setSopSaving] = useState(false)
  const [sopError, setSopError] = useState("")

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

    // Check if user has already applied to this project
    async function checkApplied() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!res.ok) return
        const data = await res.json()
        const found = (data.requests || []).find(
          (r) => (r.project?._id || r.project) === id
        )
        if (found) setMyRequest(found)
      } catch {
        // non-critical
      }
    }

    checkApplied()
  }, [id, token])

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
      setMyRequest(data.request || { status: "PENDING", sop })
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setApplying(false)
    }
  }

  const handleSaveSop = async () => {
    if (!editedSop.trim()) {
      setSopError("SOP cannot be empty")
      return
    }
    setSopSaving(true)
    setSopError("")
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
      )
      const data = await res.json()
      if (res.status === 409) {
        setSopError("Request was updated externally. Please refresh.")
        return
      }
      if (!res.ok) throw new Error(data.message || "Failed to update SOP")
      setMyRequest(data.request)
      setEditingSop(false)
      setEditedSop("")
    } catch (err) {
      setSopError(err.message)
    } finally {
      setSopSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading project...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  if (!project) return null

  const isOwner = user?._id === project.owner?._id
  const isFull = project.members.length >= project.teamSize

  return (
    <>
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{project.title}</h1>

            {myRequest && (
              <span className="flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">
                ✓ Applied
              </span>
            )}
          </div>

          {project.status === "CLOSED" && (
            <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
              Closed
            </span>
          )}
        </div>

        <p className="mt-4 text-gray-600">{project.description}</p>

        {/* SKILLS */}
        <div className="mt-6">
          <h3 className="font-semibold">Required Skills</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.requiredSkills?.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* TEAM SIZE FIXED */}
        <div className="mt-4 text-sm text-gray-600">
          Team: {project.members.length} / {project.teamSize}
        </div>

        {/* TEAM MEMBERS */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Team Members</h3>

          <div className="mt-4 space-y-3">
            {project.members?.map((member) => (
              <div
                key={member._id}
                onClick={() => navigate(`/users/${member._id}`)}
                className="p-4 border rounded-lg hover:shadow cursor-pointer transition"
              >
                <p className="font-medium">{member.name}</p>

                <div className="flex gap-2 flex-wrap mt-2">
                  {member.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPLY SECTION */}
        {!isOwner && project.status === "OPEN" && !isFull && (
          <div className="mt-10 border-t pt-6">
            {myRequest ? (
              <div>
                <p className="text-sm text-gray-500 mb-3">
                  Status:{" "}
                  <span className={`font-medium ${myRequest.status === "PENDING" ? "text-yellow-600"
                      : myRequest.status === "ACCEPTED" ? "text-green-600"
                        : "text-red-600"
                    }`}>{myRequest.status}</span>
                  {" "}&mdash; You've already applied to this project.
                </p>

                {editingSop ? (
                  <div>
                    <textarea
                      value={editedSop}
                      onChange={(e) => setEditedSop(e.target.value)}
                      className="w-full border rounded-md p-3 h-32 text-sm"
                    />

                    {sopError && (
                      <p className="text-red-600 text-sm mt-2">{sopError}</p>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={handleSaveSop}
                        disabled={sopSaving}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                      >
                        {sopSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => { setEditingSop(false); setSopError("") }}
                        className="px-3 py-1 bg-gray-200 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Your SOP: </span>
                      {myRequest.sop}
                    </p>

                    {myRequest.status === "PENDING" && (
                      <button
                        onClick={() => { setEditingSop(true); setEditedSop(myRequest.sop); setSopError("") }}
                        className="mt-3 text-sm text-blue-600 hover:underline"
                      >
                        Edit SOP
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Apply to this project</h3>

                <textarea
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  placeholder="Why do you want to join this project?"
                  className="mt-3 w-full border rounded-md p-3 h-32"
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
              </>
            )}
          </div>
        )}

        {/* FULL MESSAGE */}
        {isFull && (
          <div className="mt-10 border-t pt-6 text-sm text-red-600">
            This project is full.
          </div>
        )}

      </main>

      <Footer />
    </>
  )
}

export default ProjectDetail
