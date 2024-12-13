/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import loginImage from "../assets/login.png"; // Import the image

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/auth"; // Ensure this is your correct login endpoint
      const { data: res } = await axios.post(url, formData);

      // Assuming the response data contains a token under res.data.token
      if (res && res.data) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", formData.email);
        window.location = "/";
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message); // Set error message from the API response
      } else {
        setError("Something went wrong. Please try again later."); // Default error message
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-xl shadow-lg backdrop-blur-lg bg-opacity-30">
        <div className="w-full md:w-1/2 p-6 flex justify-center">
          <img
            src={loginImage} // Use the imported image here
            alt="Todo List"
            className="w-full h-auto max-w-xs"
          />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">
            LOGIN
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-600"></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-600"></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="text-red-900">{error}</div>}{" "}
            {/* Display error message */}
            <button
              type="submit"
              className="text-white btn btn-primary w-full mt-6"
            >
              Log In
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
