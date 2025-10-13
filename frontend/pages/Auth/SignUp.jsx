import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import api from "../../src/Utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await api.post("/auth/register", {
        fullName: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Registration failed. Please try again."
      });
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">Start tracking your expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Full Name"
            placeholder="John Doe"
            error={errors.name}
          />

          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email}
          />

          <Input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            label="Password"
            placeholder="••••••••"
            type="password"
            error={errors.password}
          />

          <Input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            error={errors.confirmPassword}
          />

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;