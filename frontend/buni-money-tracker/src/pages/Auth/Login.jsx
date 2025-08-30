import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout";
import { authAPI } from "../../utils/apiPaths";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <div className="ios-fade-in">
          <h3 className="text-display text-3xl font-semibold text-white mb-2">Welcome Back</h3>
          <p className="text-body text-white/70 mb-8">
            Please enter your details to log in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ios-slide-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <label htmlFor="email" className="block text-body text-sm font-medium text-white/90 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-body text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button text-white py-3 px-4 rounded-xl font-medium text-body disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-body text-white/70 mt-8 ios-fade-in" style={{ animationDelay: '0.4s' }}>
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-medium hover:text-white/80 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
