import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App.jsx";
// at the top of index.js
import reportWebVitals from './reportWebVitals.js';

// import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";
import { BrowserRouter } from 'react-router-dom';
// import ProductProvider from "./components/ProductContext/Product.context";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    </BrowserRouter>
    {/* <ProductProvider> */}
    <App />
  {/* </ProductProvider> */}
  </React.StrictMode>
);


reportWebVitals();
