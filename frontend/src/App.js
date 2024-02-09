import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home.js';
import AdminLogin from './components/Register/AdminLogin.js';
import AdminSignUp from './components/Register/AdminSignUp.js';
import CraftsmanLogin from './components/Register/CraftsmanLogin.js';
import CraftsmanSignUp from './components/Register/CraftsmanSignUp.js';
import CustomerLogin from './components/Register/CustomerLogin.js';
import CustomerSignUp from './components/Register/CustomerSignUp.js';
import CraftsmanDashboard from './components/Craftsman/CraftsmanDashboard.js';
import AdminDashboard from './components/Admin/AdminDashboard.js';
import AddUpdateProduct from './components/Craftsman/AddUpdateProduct.js';

function App() {

  const HeaderFooterRoute = () => (
    <>
      <Header />
      <Footer />
    </>
  );

  return (
    <>
      <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<HeaderFooterRoute />}>
            <Route index element={<Home />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/AdminSignUp" element={<AdminSignUp />} />
            <Route path="/CraftsmanLogin" element={<CraftsmanLogin />} />
            <Route path="/CraftsmanSignUp" element={<CraftsmanSignUp />} />
            <Route path="/CustomerLogin" element={<CustomerLogin />} />
            <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
            <Route path="/craftsmanDashboard" element={<CraftsmanDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/AddUpdateProduct" element={<AddUpdateProduct />} />
          </Route>
        
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
