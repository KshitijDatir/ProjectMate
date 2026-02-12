import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

function OutgoingRequests() {
  const { token } = useAuth()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch outgoing requests
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to load requests")
        }

        // ✅ sort by status: PENDING → ACCEPTED → REJECTED
        const order = {
          PENDING: 0,
          ACCEPTED: 1,
          REJECTED: 2,
        }

        const sorted = data.requests.sort(
          (a, b) => order[a.status] - order[b.status]
        )

        setRequests(sorted)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [token])

  /* ================= UI STATES ================= */

  if (loading) {
    return <p className="text-gray-600">Loading your requests...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  if (requests.length === 0) {
    return (
      <p className="text-gray-600">
        You haven’t applied to any projects yet.
      </p>
    )
  }

  /* ================= RENDER ================= */

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Requests
      </h1>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white border rounded-lg p-5"
          >
            {/* Project Title */}
            <h2 className="text-lg font-semibold text-gray-900">
              {req.project.title}
            </h2>

            {/* SOP */}
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Your SOP:</span>{" "}
              {req.sop}
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              {/* Status */}
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  req.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "ACCEPTED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>

              {/* Date */}
              <span className="text-xs text-gray-500">
                Applied on{" "}
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutgoingRequests
