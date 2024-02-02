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
            if (response.data.userType == "seller") {
              setUserType(2);
            } else if (response.data.userType == "admin") {
              setUserType(3);              
            } else {
              // customer
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
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Shop</a>
                </li>
                </ul>
                  <ul className="navbar-nav d-flex">
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
                      <li className="nav-item">
                          <Link to="/PendingOrders" className="nav-link">Orders</Link>
                      </li>
                      <li className="nav-item">
                          <Link to="/Cart" className="nav-link">Cart</Link>
                            </li>
                                        {userType != 0 ? (
                                            <a href="#" onClick={logout} className="nav-link">Logout</a>
                                        ) : ""}
                  </ul>
                  
      {/* <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
              </div>
          </div>
            </nav>
                        <main className='container'>
                <Outlet />
                </main>
      </>
  )
}

export default Header