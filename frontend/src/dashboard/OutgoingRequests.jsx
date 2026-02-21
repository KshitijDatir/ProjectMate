import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Edit, CheckCircle, Clock, XCircle, Eye } from "lucide-react"

function OutgoingRequests() {
  const { token } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editedSop, setEditedSop] = useState("")
  const [requestErrors, setRequestErrors] = useState({})
  const [savingMap, setSavingMap] = useState({})

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/requests/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load requests")
        const order = { PENDING: 0, ACCEPTED: 1, REJECTED: 2 }
        const sorted = data.requests.sort((a, b) => order[a.status] - order[b.status])
        setRequests(sorted)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [token])

  const startEdit = (req) => {
    setEditingId(req._id)
    setEditedSop(req.sop)
    setRequestErrors(prev => ({ ...prev, [req._id]: "" }))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditedSop("")
  }

  const saveEdit = async (req) => {
    try {
      setSavingMap(prev => ({ ...prev, [req._id]: true }))
      setRequestErrors(prev => ({ ...prev, [req._id]: "" }))
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/requests/${req._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sop: editedSop, __v: req.__v }),
        }
      )
      const data = await res.json()
      if (res.status === 409) {
        setRequestErrors(prev => ({ ...prev, [req._id]: "This request was updated or decided. Please refresh." }))
        return
      }
      if (!res.ok) throw new Error(data.message || "Failed to update SOP")
      setRequests(prev => prev.map(r => r._id === req._id ? data.request : r))
      setEditingId(null)
      setEditedSop("")
    } catch (err) {
      setRequestErrors(prev => ({ ...prev, [req._id]: err.message }))
    } finally {
      setSavingMap(prev => ({ ...prev, [req._id]: false }))
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock size={16} style={{ color: 'var(--accent)' }} />;
      case 'ACCEPTED': return <CheckCircle size={16} style={{ color: 'var(--primary)' }} />;
      case 'REJECTED': return <XCircle size={16} style={{ color: 'var(--text-muted)' }} />;
      default: return null;
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading your requests...</p>
  if (error) return <p style={{ color: 'var(--accent)' }}>{error}</p>
  if (requests.length === 0) return (
    <div className="text-center py-12">
      <Edit size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
      <p style={{ color: 'var(--text-muted)' }}>You haven’t applied to any projects yet.</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>My Requests</h1>
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border rounded-lg p-5 request-card"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{req.project.title}</h2>
              <div className="flex items-center gap-2">
                {getStatusIcon(req.status)}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: req.status === 'PENDING' ? 'var(--accent)' : req.status === 'ACCEPTED' ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                >
                  {req.status}
                </span>
              </div>
            </div>

            <div className="mt-3 sop-preview">
              {editingId === req._id ? (
                <div>
                  <textarea
                    value={editedSop}
                    onChange={(e) => setEditedSop(e.target.value)}
                    className="w-full border rounded p-3 text-sm"
                    rows={4}
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                  {requestErrors[req._id] && (
                    <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>{requestErrors[req._id]}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => saveEdit(req)}
                      disabled={savingMap[req._id]}
                      className="px-4 py-2 rounded-md hologram-btn text-sm disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                    >
                      {savingMap[req._id] ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-md hologram-btn text-sm"
                      style={{ border: `1px solid var(--border)`, color: 'var(--text)'}}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Your SOP:</span> {req.sop}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              {req.status === "PENDING" && editingId !== req._id && (
                <button
                  onClick={() => startEdit(req)}
                  className="edit-sop-btn hologram-btn px-3 py-1 rounded-md text-sm flex items-center gap-1"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <Edit size={14} />
                  Edit SOP
                </button>
              )}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Applied on {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutgoingRequests