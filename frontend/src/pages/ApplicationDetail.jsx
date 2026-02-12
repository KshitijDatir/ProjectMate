import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"

function ApplicationDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [decisionMessage, setDecisionMessage] = useState("")
  const [processing, setProcessing] = useState(false)
  const [actionError, setActionError] = useState("")
  const [actionSuccess, setActionSuccess] = useState("")

  /* ================= FETCH APPLICATION ================= */

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to load application")
        }

        setApplication(data.request)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id, token])

  /* ================= DECISION HANDLER ================= */

  async function handleDecision(decision) {
    try {
      setProcessing(true)
      setActionError("")
      setActionSuccess("")

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${id}/decision`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision,
            message: decisionMessage,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Action failed")
      }

      // Update UI locally
      setApplication((prev) => ({
        ...prev,
        status: decision,
      }))

      setActionSuccess(
        `Application ${decision.toLowerCase()} successfully`
      )
    } catch (err) {
      setActionError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  /* ================= UI STATES ================= */

  if (loading) return <p className="p-6">Loading application...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  const { applicantSnapshot, project, sop, status } = application

  return (
    <>
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Application for {project.title}
        </h1>

        {/* Applicant Info */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Applicant Details
          </h2>

          <p><strong>Name:</strong> {applicantSnapshot.name}</p>
          <p><strong>Email:</strong> {applicantSnapshot.email}</p>
          <p><strong>College:</strong> {applicantSnapshot.college}</p>
          <p><strong>Branch:</strong> {applicantSnapshot.branch}</p>
          <p><strong>Year:</strong> {applicantSnapshot.year}</p>

          <div className="mt-4">
            <strong>Skills:</strong>
            <div className="flex gap-2 flex-wrap mt-2">
              {applicantSnapshot.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {applicantSnapshot.resumeUrl && (
            <div className="mt-4">
              <a
                href={applicantSnapshot.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            </div>
          )}
        </div>

        {/* SOP */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Statement of Purpose
          </h2>
          <p className="text-gray-700">{sop}</p>
        </div>

        {/* Decision Section */}
        {status === "PENDING" && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Make a Decision
            </h2>

            <textarea
              placeholder="Optional message to applicant..."
              value={decisionMessage}
              onChange={(e) => setDecisionMessage(e.target.value)}
              className="w-full border rounded-md p-3 h-24 mb-4"
            />

            <div className="flex gap-4">
              <button
                onClick={() => handleDecision("ACCEPTED")}
                disabled={processing}
                className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {processing ? "Processing..." : "Accept"}
              </button>

              <button
                onClick={() => handleDecision("REJECTED")}
                disabled={processing}
                className="px-6 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {processing ? "Processing..." : "Reject"}
              </button>
            </div>

            {/* Inline Feedback */}
            {actionError && (
              <p className="mt-4 text-red-600 text-sm">
                {actionError}
              </p>
            )}

            {actionSuccess && (
              <p className="mt-4 text-green-600 text-sm">
                {actionSuccess}
              </p>
            )}
          </div>
        )}

        {status !== "PENDING" && (
          <div className="mt-6 text-lg">
            Status: <strong>{status}</strong>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default ApplicationDetail
