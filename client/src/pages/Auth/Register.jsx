import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";
import { ImSpinner3 } from "react-icons/im";
import useAuthStore from "../../store/useAuthStore";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleChange = (e) => {
    setError("")
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    if (form.password.length < 6) {
      setError("Password Should greate then 6 character.");
      return;
    }

    try {
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – Form */}
      <div className="flex-2 relative flex items-center justify-center bg-gray-100 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 p-2 rounded-full border"
          aria-label="Back to Home"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Create Your OpenPin Account
          </h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 flex items-center bg-gray-50 rounded-lg border border-gray-300 ">
                <FiUser className="text-gray-400 ml-3" />
                <input
                  name="name"
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="Your full name"
                  autoComplete="false"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 flex items-center bg-gray-50 rounded-lg border border-gray-300">
                <FiAtSign className="text-gray-400 ml-3" />
                <input
                  name="email"
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="you@example.com"
                  autoComplete="false"
                />
              </div>
            </div>

            {/* Password with toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative flex items-center bg-gray-50 rounded-lg border border-gray-300">
                <FiLock className="text-gray-400 ml-3 z-10" />
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent overflow-hidden px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 right-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className=" cursor-pointer w-full flex justify-center py-3  bg-[#00db8d] hover:bg-[#00cb6f] active:translate-y-1 shadow-md active:shadow-xl rounded-lg text-white font-semibold transition"
            >
              {isLoading ? (
                <ImSpinner3 size={20} className="animate-spin duration-[5s]" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#00db8d] hover:underline font-[500]"
            >
              Sign in here
            </Link>
          </p>
          <div className="text-center text-gray-500 text-xs">
            <p>Supported by ESP32, ESP8266, Arduino...</p>
            <p>Wi‑Fi + MQTT + Cloud = 🔧</p>
          </div>
        </div>
      </div>

      {/* Right – Illustration */}
      <div className="flex-3 hidden md:flex bg-[#000d2a] items-center justify-center">
        <div className="h-full flex-1 text-center flex justify-center items-center text-white ">
          <div className="min-h-3/5 w-full px-5 flex flex-col items-start ml-6">
            <h1 className="font-[800] text-2xl">OpenPin cloude is here</h1>
            <p className="text-left my-6 mb-20">
              Open source project for everyone. join today to make the worl
              easy.
            </p>
            <Link to={"/"} className="py-2 border-b-2 text-left">
              See the documentation {"->"}
            </Link>
          </div>
        </div>
        <div className="h-full flex-2 flex justify-center items-center">
          <img
            src="/images/login-image-1.png"
            alt="Welcome illustration"
            className="w-[90%] object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
