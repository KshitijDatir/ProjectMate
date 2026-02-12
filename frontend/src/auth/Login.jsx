import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "./authApi"
import { useAuth } from "../context/AuthContext"

function Login() {
  const { login, token, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 🔒 Redirect if already authenticated
  useEffect(() => {
    if (!loading && token) {
      navigate("/home", { replace: true })
    }
  }, [token, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const data = await loginUser(email, password)
      // expected: { token }
      login(data.token)
      navigate("/home", { replace: true })
    } catch (err) {
      setError(err.message || "Login failed")
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
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Sign in to ProjectMate
        </h1>

        <p className="mt-2 text-sm text-gray-600 text-center">
          Welcome back. Please enter your details.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
