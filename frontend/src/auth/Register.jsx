import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "./authApi"
import { useAuth } from "../context/AuthContext"

function Register() {
  const { login, token, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 🔒 Redirect if already authenticated
  useEffect(() => {
    if (!loading && token) {
      navigate("/home", { replace: true })
    }
  }, [token, loading, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const data = await registerUser(form)
      // expected: { token }
      login(data.token)
      navigate("/home", { replace: true })
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border rounded-xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-center">
          Create Account
        </h2>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default Register
