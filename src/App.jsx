import React, { useState } from "react";
// import products from "./Productdata";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Nav from "./Nav";
import Banner from "./Banner";
import Home from "./Home";
import Product from "./Product";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";
import Shipping from "./Shipping";
import Payment from "./Payment";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

import "./App.css";




function Layout() {

const [selectedBrand,setSelectedBrand]=useState([]);
const [selectedColor,setSelectedColor]=useState([]);
const [selectedPriceRange,setSelectedPriceRange]=useState([]);

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/Login" ||
    location.pathname === "/Register" ||
    location.pathname === "/Payment" ||
    location.pathname === "/AdminLogin" ||
    location.pathname === "/AdminDashboard";

  return (
    <>
      {!hideNavbar && <Nav />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Home />
            </>
          }
        />

        <Route path="/Product" element={<Product selectedBrand={selectedBrand}  
        setSelectedBrand={setSelectedBrand} selectedColor={selectedColor}  
        setSelectedColor={setSelectedColor} selectedPriceRange={selectedPriceRange} setSelectedPriceRange={setSelectedPriceRange} />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />}/>
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Shipping" element={<Shipping />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;