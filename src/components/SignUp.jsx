/* eslint-disable no-undef */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import signupImage from "../assets/register.png"; // Import the image

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      const url = "http://localhost:5000/api/users";
      const { data: res } = await axios.post(url, formData);
      // Assuming a successful response contains a message to navigate the user
      console.log(res.message); // Logging the message from the response
      navigate("/login"); // Redirect user to login page
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message); // Set error message based on API response
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row-reverse items-center justify-center w-full max-w-4xl bg-white rounded-xl shadow-lg backdrop-blur-lg bg-opacity-30">
        {/* Image Section */}
        <div className="w-full md:w-1/2 p-6 justify-center hidden md:block">
          <img
            src={signupImage} // Use the imported image here
            alt="Sign Up"
            className="w-full h-auto max-w-xs"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">
            REGISTER
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-600"
              ></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400"
                placeholder="Enter your First Name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-600"></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400"
                placeholder="Enter your Last Name"
                required
              />
            </div>
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

            {error && <div className="text-red-900">{error}</div>}

            <button
              type="submit"
              className="text-white btn btn-primary w-full mt-6"
            >
              Sign Up
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
