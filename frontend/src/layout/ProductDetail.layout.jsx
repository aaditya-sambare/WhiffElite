import React from "react";
import ProductNavbar from "../components/navbar/ProductNavbar.Component";

const DefaultLayoutHoc =
  (Component) =>
  ({ ...props }) => {
    return (
      <div>
        <ProductNavbar/>
        <Component {...props} />
        <div>Footer</div>
      </div>
    );
  };

export default DefaultLayoutHoc;
