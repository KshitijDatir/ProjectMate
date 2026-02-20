import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./authApi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && token) navigate("/home", { replace: true });
  }, [token, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginUser(email, password);
      login(data.token);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your journey">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text)' }}>Sign In</h2>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              '--tw-ring-color': 'var(--primary)'
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              '--tw-ring-color': 'var(--primary)'
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full hologram-btn py-3 rounded-md font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
              Or sign in with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="py-2 px-4 border rounded-md hologram-btn"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Google
          </button>
          <button
            type="button"
            className="py-2 px-4 border rounded-md hologram-btn"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Apple
          </button>
        </div>

        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{" "}
          <Link to="/register" className="hologram-link font-medium" style={{ color: 'var(--primary)' }}>
            Sign up
          </Link>
        </p>

        <div className="text-center">
          <Link to="/" className="hologram-link text-sm" style={{ color: 'var(--text-muted)' }}>
            ← Back to website
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;