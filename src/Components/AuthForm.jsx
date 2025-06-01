import React, { useState } from "react";
import Logo from "../../public/logo.png";
import { useNavigate } from "react-router-dom";
export default function AuthForm({ formType, onAuthSuccess ,onNewToken}) {
  const [isSignup, setIsSignup] = useState(formType === "signUp");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate=useNavigate();

  const formFields = [
    ...(isSignup
      ? [{ label: "Username", name: "username", type: "text" }]
      : []),
    {
      label: "Email",
      type: "email",
      name: "email",
    },
    {
      label: "Password",
      type: "password",
      name: "password",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "http://localhost:5125/api/auth/signup"
      : "http://localhost:5125/api/auth/login";
    const formValues = isSignup
      ? {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      console.log(data);
      onAuthSuccess(data.userId);
      onNewToken(data.token);
      localStorage.setItem("jwt-token", data.token);
      navigate("/chat");
      
    } catch (err) {
      console.log(err);
    }

    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8  rounded-2xl shadow-[0_2px_5px_rgba(0,0,0,0.4)] w-full max-w-md">
        <div className="flex justify-center">
          <img src={Logo} className="w-1/5" />
        </div>
        <h2 className="text-1xl font-semibold text-center mb-6">
          {isSignup
            ? "Get ready to challenge the ordinary."
            : "Time to level up your thinking!"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
            
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-600">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
          ))}
          
          {!isSignup && (
            <div className="text-sm text-right text-gray-700 hover:text-gray-800 hover:font-semibold cursor-pointer">
              Forgot Password?
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-700 text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-700">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setFormData({
                username: "",
                email: "",
                password: "",
              });
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
