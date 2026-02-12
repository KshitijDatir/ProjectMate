import { useEffect, useState } from "react"
import DashboardNavbar from "../components/DashboardNavbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"

function Profile() {
  const { token } = useAuth()

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({})
  const [isEditing, setIsEditing] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load profile")
      }

      setUser(data.user)
      setStats(data.stats)

      // Prepare form defaults
      setForm({
        college: data.user.college || "",
        branch: data.user.branch || "",
        year: data.user.year || "",
        skills: data.user.skills?.join(", ") || "",
        contact: data.user.contact || "",
        resumeUrl: data.user.resumeUrl || "",
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            skills: form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setSuccess("Profile updated successfully")
      setIsEditing(false)
      fetchProfile()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading profile...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <>
      <DashboardNavbar />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your personal information
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <StatCard label="Managing Projects" value={stats.managedProjects} />
            <StatCard
              label="Contributed Projects"
              value={stats.contributedProjects}
            />
          </div>

          {/* Profile */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            {isEditing ? (
              <>
                <Input label="College" name="college" value={form.college} onChange={handleChange} />
                <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
                <Input label="Year" name="year" value={form.year} onChange={handleChange} />
                <Input label="Contact" name="contact" value={form.contact} onChange={handleChange} />
                <Input
                  label="Skills (comma separated)"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                />
                <Input
                  label="Resume URL"
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                />

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <ProfileRow label="Name" value={user.name} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="College" value={user.college || "-"} />
                <ProfileRow label="Branch" value={user.branch || "-"} />
                <ProfileRow label="Year" value={user.year || "-"} />
                <ProfileRow label="Contact" value={user.contact || "-"} />
                <ProfileRow
                  label="Skills"
                  value={
                    user.skills?.length
                      ? user.skills.join(", ")
                      : "-"
                  }
                />
                <ProfileRow
                  label="Resume"
                  value={
                    user.resumeUrl ? (
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "-"
                    )
                  }
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default Profile
