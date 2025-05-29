import React from "react";
import { FaTools } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white border border-red-200 shadow-lg rounded-xl p-8 max-w-md text-center">
        <div className="flex flex-col items-center gap-3">
          <FaTools className="text-4xl text-red-500 animate-pulse" />
          <h1 className="text-2xl font-bold text-red-600">Under Maintenance</h1>
          <p className="text-gray-600 text-sm">
            We're currently working on this page. Please check back later!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
