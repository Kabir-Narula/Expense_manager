import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Input = ({ label, value, onChange, placeholder, type, name, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getInputType = () => {
    if (type === 'password') return showPassword ? 'text' : 'password';
    return type;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className={`relative transition-all duration-200 ${
        error ? "border-red-500" : 
        isFocused ? "ring-2 ring-primary/20" : ""
      }`}>
        <input
          name={name}
          type={getInputType()}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
            text-sm placeholder-gray-400 focus:outline-none transition-all
            ${error ? "border-red-500" : "hover:border-gray-400 focus:border-primary"}`}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
          </button>
        )}

        {error && (
          <FaTimesCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <FaTimesCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;