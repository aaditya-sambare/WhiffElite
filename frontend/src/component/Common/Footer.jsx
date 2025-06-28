import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} WhiffÉlite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
