import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

function OutgoingRequests() {
  const { token } = useAuth()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editedSop, setEditedSop] = useState("")
  const [requestErrors, setRequestErrors] = useState({})
  const [savingMap, setSavingMap] = useState({})

  /* ================= FETCH ================= */

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

  /* ================= EDIT ================= */

  const startEdit = (req) => {
    setEditingId(req._id)
    setEditedSop(req.sop)
    setRequestErrors((prev) => ({ ...prev, [req._id]: "" }))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditedSop("")
  }

  const saveEdit = async (req) => {
    try {
      setSavingMap((prev) => ({ ...prev, [req._id]: true }))
      setRequestErrors((prev) => ({ ...prev, [req._id]: "" }))

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${req._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sop: editedSop,
            __v: req.__v,
          }),
        }
      )

      const data = await res.json()

      if (res.status === 409) {
        setRequestErrors((prev) => ({
          ...prev,
          [req._id]:
            "This request was updated or decided. Please refresh.",
        }))
        return
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to update SOP")
      }

      setRequests((prev) =>
        prev.map((r) =>
          r._id === req._id ? data.request : r
        )
      )

      setEditingId(null)
      setEditedSop("")
    } catch (err) {
      setRequestErrors((prev) => ({
        ...prev,
        [req._id]: err.message,
      }))
    } finally {
      setSavingMap((prev) => ({ ...prev, [req._id]: false }))
    }
  }

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
            <h2 className="text-lg font-semibold text-gray-900">
              {req.project.title}
            </h2>

            {editingId === req._id ? (
              <div className="mt-3">
                <textarea
                  value={editedSop}
                  onChange={(e) => setEditedSop(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  rows={4}
                />

                {requestErrors[req._id] && (
                  <p className="text-red-600 text-sm mt-2">
                    {requestErrors[req._id]}
                  </p>
                )}

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => saveEdit(req)}
                    disabled={savingMap[req._id]}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    {savingMap[req._id] ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-300 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Your SOP:</span>{" "}
                {req.sop}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
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

              <div className="flex items-center gap-3">
                {req.status === "PENDING" &&
                  editingId !== req._id && (
                    <button
                      onClick={() => startEdit(req)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit SOP
                    </button>
                  )}

                <span className="text-xs text-gray-500">
                  Applied on{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutgoingRequests
