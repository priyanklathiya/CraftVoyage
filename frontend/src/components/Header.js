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
        <main>
          
          <div className="container-fluid">
    <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Menu</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <a href="#" className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </a>
                        <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                            <li className="w-100">
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1 </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Orders</span></a>
                    </li>
                    <li>
                        <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
                            <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Bootstrap</span></a>
                        <ul className="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                            <li className="w-100">
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Products</span> </a>
                            <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                            <li className="w-100">
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 1</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 2</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 3</a>
                            </li>
                            <li>
                                <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 4</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Customers</span> </a>
                    </li>
                </ul>
                <hr />
                <div className="dropdown pb-4">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                        <span className="d-none d-sm-inline mx-1">loser</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="col py-3">
            <h3>Left Sidebar with Submenus</h3>
            <p className="lead">
                An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.</p>
            <ul className="list-unstyled">
                <li><h5>Responsive</h5> shrinks in width, hides text labels and collapses to icons only on mobile</li>
            </ul>
        </div>
    </div>
</div>
                <Outlet />
                </main>
      </>
  )
}

export default Header