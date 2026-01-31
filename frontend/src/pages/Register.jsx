import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError(""); // ✅ clear error on typing
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/chat");
    } catch (err) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg">
      <div className="bg-dark-card p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Create Account
        </h2>
        <p className="text-text-secondary mb-6">
          Join the AI Chat community
        </p>

        {error && (
          <div className="bg-red-500/10 text-danger p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm text-text-secondary mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              className="w-full p-3 rounded-lg bg-dark-input border border-dark-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-text-secondary mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-lg bg-dark-input border border-dark-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full p-3 rounded-lg bg-dark-input border border-dark-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
