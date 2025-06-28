// src/layout/CaptainLayout.jsx
import React from "react";
import CaptainContext from "../context/CapatainContext";

const CaptainLayout = ({ children }) => {
  return (
    <CaptainContext>
      {/* You can add a Captain-specific navbar/header here if needed */}
      {children}
    </CaptainContext>
  );
};

export default CaptainLayout;
