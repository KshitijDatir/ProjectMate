import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "./authApi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && token) navigate("/home", { replace: true });
  }, [token, loading, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await registerUser(form);
      login(data.token);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Join ProjectMate" subtitle="Create an account to get started">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text)' }}>Sign Up</h2>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Full name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              '--tw-ring-color': 'var(--primary)'
            }}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
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
            name="password"
            required
            value={form.password}
            onChange={handleChange}
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            style={{ accentColor: 'var(--primary)' }}
          />
          <label htmlFor="terms" className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            I agree to the{" "}
            <a href="/terms" className="hologram-link" style={{ color: 'var(--primary)' }}>
              Terms & Conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full hologram-btn py-3 rounded-md font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        {/* Social login - simple text buttons (no icons) */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
              Or register with
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
          Already have an account?{" "}
          <Link to="/login" className="hologram-link font-medium" style={{ color: 'var(--primary)' }}>
            Log in
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

export default Register;