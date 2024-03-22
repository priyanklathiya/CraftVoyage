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
import Category from './components/Admin/Category.js';
import AddUpdateCategory from './components/Admin/AddUpdateCategory.js';
import Condition from './components/Admin/Condition.js';
import AddUpdateCondition from './components/Admin/AddUpdateCondition.js';
import CraftsmenList from './components/Admin/CraftsmenList.js';
import Index from './components/Shop/Index.js';
import ProductDetails from './components/Shop/ProductDetails.js';
import Cart from './components/Cart/Cart.js';
import AddUpdateBlogs from './components/Blogs/AddUpdateBlogs.js';
import Blogs from './components/Blogs/Blogs.js';
import ViewBlogs from './components/Blogs/ViewBlogs.js';
import Cancel from './components/Checkout/Cancel.js';
import Success from './components/Checkout/Success.js';
import MyOrders from './components/Orders/MyOrders.js';
import AllOrder from './components/Orders/AllOrder.js';

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
            <Route path="/Category" element={<Category />} />
            <Route path="/AddUpdateCategory" element={<AddUpdateCategory />} />
            <Route path="/Condition" element={<Condition />} />
            <Route path="/AddUpdateCondition" element={<AddUpdateCondition />} />
            <Route path="/CraftsmenList" element={<CraftsmenList />} />
            <Route path="/Shop" element={<Index />} />
            <Route path="/ProductDetails" element={<ProductDetails />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/AddUpdateBlogs" element={<AddUpdateBlogs />} />
            <Route path="/Blogs" element={<Blogs />} />
            <Route path="/ViewBlogs" element={<ViewBlogs />} />
            <Route path="/Success" element={<Success />} />
            <Route path="/Cancel" element={<Cancel />} />
            <Route path="/GetAllOrders" element={<AllOrder />} />
            <Route path="/MyOrders" element={<MyOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
