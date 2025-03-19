import React from "react";
import CARD_2 from "../../src/assets/images/card2.png";
import { LuTrendingUp } from "react-icons/lu";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-full h-screen md:w-[55%] xl:w-[50%] px-6 sm:px-12 pt-8 pb-12 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <LuTrendingUp className="text-primary" size={24} />
          Expense Tracker
        </h2>
        
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      </div>

      <div className="hidden md:block w-[45%] xl:w-[50%] h-screen bg-gradient-to-br from-purple-50 to-indigo-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <motion.div 
          className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600/30 absolute top-[30%] -right-10"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <motion.div 
          className="w-48 h-48 rounded-[40px] bg-violet-500/80 absolute -bottom-7 -left-5"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8">
          <StatsInfoCard
            icon={<LuTrendingUp size={24} />}
            label="Track Your Financial Health"
            value="430,000"
            color="bg-primary"
          />

          <motion.img
            src={CARD_2}
            className="w-64 xl:w-96 mx-auto shadow-xl rounded-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
};

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-4 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className={`${color} w-14 h-14 flex items-center justify-center rounded-xl text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">${value}</p>
      </div>
    </div>
  );
};

export default AuthLayout;