import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

function Header() {
    const [userType, setUserType] = useState(0);
    
  // 0 if not logged in
  // 1 if logged in && customer
  // 2 if logged in && craftsman
  // 3 if logged in && admin

  axios.defaults.withCredentials = true;
    
  useEffect(() => {
    
    axios.get("http://localhost:8080/auth/userSession")
      .then((response) => {
        // setUserSession(!!(response && response.data));
        // console.log(response)
        if (response.data) {
          if (response.data.valid == true) {
            if (response.data.userType == "craftsman") {
              setUserType(2);
            } else if (response.data.userType == "admin") {
              setUserType(3);              
            } else {
              setUserType(1);
            }
          } else {
            setUserType(0);
          } 
        } else {
          setUserType(0);
        }
       })
  }, [])
    
    const logout = () => {

        axios.get('http://localhost:8080/auth/logout')
            .then(response => {
                // console.log(response);
                setUserType(0);  // userType 0 means not logged in
                window.location.href = '/';  // Redirect to home page after successful logout
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
        };

    return (
      <>

    <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
                <Link to="/" className="navbar-brand"> Craft Voyage </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                
                {userType === 0 || userType === 1 ? (

                  <li className="nav-item">
                    {/* <a className="nav-link active" aria-current="page" href="#">Home</a> */}
                    <Link className="nav-link active" to="/">Home</Link>
                  </li>             

                ) : ""}


                {userType === 0 || userType === 1 ? (
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/Shop">Shop</Link>
                  </li>
                ) : ""}

                {userType === 0 || userType === 1 ? (
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/Blogs">Blogs</Link>
                  </li>
                ) : ""}
                              
              </ul>
              
                <ul className="navbar-nav d-flex">
                  
              {userType === 0 ? (
                
                  <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">                              
                        Account
                      </a>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/CraftsmanLogin">Craftsman</Link></li>
                        <li><Link className="dropdown-item" to="/CustomerLogin">Customer</Link></li>
                        <li><Link className="dropdown-item" to="/AdminLogin">Admin</Link></li>
                      </ul>
                          
                  </li>   
                  
              ) : ""}

                {userType === 1 ? (
                  
                    <li className="nav-item">
                      <Link to="/MyOrders" className="nav-link">Orders</Link>                    
                    </li>                  

                ) : ""}
                
                {userType === 0 || userType === 1 ? (
                  
                  <li className="nav-item">
                    <Link to="/Livechat" className="nav-link">Live Chat Support</Link>
                  </li>
                  
                ) : ""}

                {userType === 0 || userType === 1 ? (
                  
                  <li className="nav-item">
                    <Link to="/Cart" className="nav-link">Cart</Link>
                  </li>
                  
                ) : ""}
                
                {userType != 0 ? (                  
                  <a href="#" onClick={logout} className="nav-link">Logout</a>                  
                ) : ""}     
                
              </ul>
            
              </div>
          </div>
            </nav>
        <main>

          {/* artist nav bar */}
          {userType === 2 || userType === 3 ? (

            <div className="container-fluid">
              <div className="row flex-nowrap">
                  <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                          <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                              <span className="fs-5 d-none d-sm-inline">Menu</span>
                          </a>
                          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">

                      {/* for craftman */}


                      {userType === 2 ? (
                          <li className="nav-item">
                                <Link to="/craftsmanDashboard" className="nav-link align-middle px-0">
                                  <i className="fa-solid fa-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>  
                                </Link>  
                          </li>
                      ) : ""}

                      {userType === 2 ? (
                        <li>
                          <Link to="/AddUpdateProduct" state={{ type: 'new' }}  className="nav-link px-0 align-middle">
                            <i className="fa-solid fa-list"></i> <span className="ms-1 d-none d-sm-inline">Add Product</span>
                          </Link>
                        </li>
                      ) : ""}

                      
                      {userType === 2 ? (
                        <li>
                          <Link to="/ViewBlogs" state={{ type: 'new' }}  className="nav-link px-0 align-middle">
                            <i className="fa fa-sticky-note"></i> <span className="ms-1 d-none d-sm-inline">My Blogs</span>
                          </Link>
                        </li>
                      ) : ""}

                      {userType === 2 ? (
                        <li>
                          <Link to="/AddUpdateBlogs" state={{ type: 'new' }}  className="nav-link px-0 align-middle">
                            <i className="fa fa-pencil"></i> <span className="ms-1 d-none d-sm-inline">Add Blog</span>
                          </Link>
                        </li>
                      ) : ""}

                      {/* for admin */}

                      {userType === 3 ? (
                          <li className="nav-item">
                                <Link to="/adminDashboard" className="nav-link align-middle px-0">
                                  <i className="fa-solid fa-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>  
                                </Link>  
                          </li>
                      ) : ""}

                      {userType === 3 ? (
                          <li className="nav-item">
                                <Link to="/Category" className="nav-link align-middle px-0">
                                  <i className="fa-solid fa-list"></i> <span className="ms-1 d-none d-sm-inline">Category</span>  
                                </Link>  
                          </li>
                      ) : ""}

                      {userType === 3 ? (
                          <li className="nav-item">
                                <Link to="/Condition" className="nav-link align-middle px-0">
                                  <i className="fa-solid fa-sliders"></i> <span className="ms-1 d-none d-sm-inline">Condition</span>  
                                </Link>  
                          </li>
                      ) : ""}

                      {userType === 3 ? (
                          <li className="nav-item">
                                <Link to="/CraftsmenList" className="nav-link align-middle px-0">
                                  <i class="fa-brands fa-artstation"></i> <span className="ms-1 d-none d-sm-inline">Craftsmen List</span>  
                                </Link>  
                          </li>
                      ) : ""}
                      {userType === 3 ? (
                          <li className="nav-item">
                                <Link to="/GetAllOrders" className="nav-link align-middle px-0">
                                  <i class="fa fa-shopping-bag" aria-hidden="true"></i>
                                  <span className="ms-1 d-none d-sm-inline">All Orders</span>  
                                </Link>  
                          </li>
                      ) : ""}
                      {/* <li>
                          <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                              <i className="fa-solid fa-gauge"></i> <span className="ms-1 d-none d-sm-inline">Products</span> </a>
                          <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                              <li className="w-100">
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Add Product</span> 1 </a>
                              </li>
                              <li>
                                  <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                              </li>
                          </ul>
                      </li> */}

                    </ul>
                    <hr />
                  </div>
                </div>

                <div className="col py-3">
                  <Outlet />
                </div>
              </div>
            </div>

          ) : ""}
          
          {userType === 0 || userType === 1 ? (
            <Outlet />
          ) : ""}

        </main>
      </>
  )
}

export default Header