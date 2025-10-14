import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/Utils/api";
import Input from "../components/Inputs/Input";
import { MdPerson, MdLock, MdPhotoCamera } from "react-icons/md";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  
  // Error states
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Loads user data when component mounts, constructs full image URLs
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/auth/getUser");
        setUser(data);
        setFullName(data.fullName || "");
        // Construct full URL for profile image
        const fullImageUrl = data.profileImageURL ? 
          `http://localhost:8000${data.profileImageURL}` : "";
        setPreviewImage(fullImageUrl);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Validates all the form fields, ensures passwords match, checks required fields
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updates user name via API, shows success message, notifies other components 
  const handleNameUpdate = async () => {
    if (!validateForm()) return;
    
    setUpdating(true);
    try {
      const { data } = await api.put("http://localhost:8000/api/v1/profile/name", { fullName });
      setUser(data.user);
      setSuccessMessage("Name updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: data.user }));
    } catch (error) {
      setErrors({ name: error.response?.data?.message || "Failed to update name" });
    } finally {
      setUpdating(false);
    }
  };

  // Updates password with current password verification, clears form fields
  const handlePasswordUpdate = async () => {
    if (!validateForm()) return;
    
    setUpdating(true);
    try {
      await api.put("http://localhost:8000/api/v1/profile/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ password: error.response?.data?.message || "Failed to update password" });
    } finally {
      setUpdating(false);
    }
  };

  // Handles file upload, constructs full image URLs, notifies other components
  const handleImageUpload = async () => {
    if (!profilePicture) return;
    
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("picture", profilePicture);
      
      const { data } = await api.put("http://localhost:8000/api/v1/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setUser(data.user);
      // Construct full URL for profile image
      const fullImageUrl = data.user.profileImageURL ? 
        `http://localhost:8000${data.user.profileImageURL}` : "";
      setPreviewImage(fullImageUrl);
      setProfilePicture(null);
      setSuccessMessage("Profile picture updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Debug: Log the profile image URL
      console.log("Profile image URL:", data.user.profileImageURL);
      console.log("Full image URL:", fullImageUrl);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: data.user }));
    } catch (error) {
      setErrors({ picture: error.response?.data?.message || "Failed to update profile picture" });
    } finally {
      setUpdating(false);
    }
  };

  //Image preview handler, Creates preview of selected image before upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-72 md:pt-8 pt-20 p-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Profile</h1>
          <p className="text-gray-500">Update your account information</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <MdPhotoCamera className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Profile Picture</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={previewImage || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjMwIiBmaWxsPSIjNjY2NjY2Ij5VU0VSPC90ZXh0Pjwvc3ZnPg=="}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
              />
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WEBP. Max 5MB.</p>
              {errors.picture && <p className="text-red-500 text-sm mt-1">{errors.picture}</p>}
              
              {profilePicture && (
                <button
                  onClick={handleImageUpload}
                  disabled={updating}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Uploading..." : "Upload Picture"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <MdPerson className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            
            <button
              onClick={handleNameUpdate}
              disabled={updating || !fullName.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Name"}
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <MdLock className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              label="Current Password"
              placeholder="Enter current password"
              type="password"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
            
            <Input
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label="New Password"
              placeholder="Enter new password"
              type="password"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
            
            <Input
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm New Password"
              placeholder="Confirm new password"
              type="password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            
            <button
              onClick={handlePasswordUpdate}
              disabled={updating || !currentPassword || !newPassword || !confirmPassword}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
