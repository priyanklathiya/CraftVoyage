import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
function SignIn(props) {
    const [formErrors, setFormErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
  const validateEmail = (email) => {
    // Regular expression for a valid email address
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const loginEvent = (e) => {
      e.preventDefault();
      
    const formErrors = {
      email: !validateEmail(email),
      password: !password,
    };

    setIsSuccess(false);
    setFormErrors({ ...formErrors });

    if (Object.values(formErrors).some((v) => v)) return;

    let userData = {
      email: email,
      password: password
      }
      


    axios.defaults.withCredentials = true;

    axios.post("http://localhost:8080/api/users/login", userData)
      .then((response) => {
        window.scrollTo(0, 0);
        if (response.status === 200) {
          if (response.data.status === 1) {
            setIsSuccess(true);
            setIsFailed(false);

            setEmail("");
            setPassword("");

            if (response.data.userType == 2) {
              window.location.href = '/craftsmanDashboard';
            } else if (response.data.userType == 3) {
              window.location.href = '/adminDashboard';
            } else {
              window.location.href = '/';
            }
          } else {
            setIsSuccess(false);
            setIsFailed(true);
            setSuccessMsg(response.data.msg);
          }
        } else {
          setIsSuccess(false);
          setIsFailed(true);
          setSuccessMsg('Something went wrong. Please try again later!');
        }
      });
  };
    
  return (
      <>
          <div className='col-sm-5 m-auto'>  
                {isSuccess && (
                    <div className="alert alert-success mt-3" role="alert">
                        <b>Success!</b> {successMsg}
                    </div>
                )}
                {isFailed && (
                    <div className="alert alert-danger mt-3" role="alert">
                        <b>Failed!</b> {successMsg}
                    </div>
              )}    
              <div className="tab-content">                  
                  <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="tab-login">                      
                      <form onSubmit={loginEvent} >                          
                          {/* <div className="form-outline mb-4">                              
                              <input type="email" id="loginName" className="form-control" />                              
                              <label className="form-label" for="loginName">Email or username</label>                              
                          </div>
                        <div className="form-outline mb-4">
                            <input type="password" id="loginPassword" className="form-control" />
                            <label className="form-label" for="loginPassword">Password</label>
                        </div> */}
                        {/* email */}
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                            type="email"
                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            placeholder="Email"
                            />
                            {formErrors.email && (
                                <div className="invalid-feedback text-danger">{formErrors.email}</div>
                            )}
                            
                        </div>

                        {/* password */}
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="password">password</label>
                            <input
                            type="password"
                            className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="password"
                            />
                            {formErrors.password && (
                                <div className="invalid-feedback text-danger">{formErrors.password}</div>
                            )}
                            
                        </div>
                        {/* <div className="row mb-4">
                            <div className="col-md-6 d-flex justify-content-center">
                            <a href="#!">Forgot password?</a>
                            </div>
                        </div> */}

                        <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

                        <div className="text-center">
                            <p>Not a member? 
                                            <Link to={props.link}>Register</Link> </p>
                        </div>
                        </form>
                    </div>

              </div>
          </div>
      </>
  )
}

export default SignIn