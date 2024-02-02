import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Signup(props) {
    const [formErrors, setFormErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [userType, setUserType] = useState('customer');
    
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {

        const currentPath = window.location.pathname;

        const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        // console.log(lastSegment);
        if (lastSegment == "CraftsmanSignUp") {
            setUserType('craftsman');
        } else if (lastSegment == "CustomerSignUp") {
            setUserType('customer');            
        }  else if (lastSegment == "AdminSignUp") {            
            setUserType('admin');
        } 
    }, []);
    

    const isPasswordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[!@#$%^&*]/.test(password);

    const isPasswordMatch = password === retypePassword;
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const newFormErrors = {};
        
        if (!name) {
        newFormErrors.name = 'Please enter your name';
        }

        if (!phone) {
        newFormErrors.phone = 'Please enter your Mobile Number';
        }

        if (!email) {
        newFormErrors.email = 'Please enter your Email';
        }

        if (!/^[a-zA-Z ]*$/.test(name)) {
        newFormErrors.name = 'Name should not contain special characters.';
        }

        if (!/^\d{10}$/.test(phone)) {
        newFormErrors.phone = 'Phone number should contain 10 digits only.';
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
        newFormErrors.email = 'Please enter a valid email address.';
        }

        if (!isPasswordValid || !password) {
        newFormErrors.password =
            'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, and a special character';
        }

        if (!isPasswordMatch || !retypePassword) {
        newFormErrors.retypePassword = 'Password does not match';
        }

        setFormErrors(newFormErrors);

        if (Object.keys(newFormErrors).length > 0) {
        return;
        }
        let userData = {
            name: name,
            phone: phone,
            email: email,
            password: password,
            userType: userType,
        };

        axios
            .post('http://localhost:8080/api/users/signup', userData)            
            .then((response) => {
                window.scrollTo(0, 0);
                if (response.status === 200) {
                if (response.data.status === 1) {
                    setIsSuccess(true);
                    setIsFailed(false);
                    setSuccessMsg(response.data.msg);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setPassword('');
                    setRetypePassword('');
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
                  <div className="tab-pane fade show active" role="tabpanel" aria-labelledby="tab-register">
                      
                      <form onSubmit={handleFormSubmit}>
                          {/* name */}
                          <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="name">Name</label>
                              <input
                                type="text"
                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                placeholder="First and last name"
                                />
                              {formErrors.name && (
                                  <div className="invalid-feedback text-danger">{formErrors.name}</div>
                              )}
                              
                          </div>
                          {/* phone number */}
                          <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="phone">Mobile number</label>
                              <input
                                type="text"
                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.currentTarget.value)}
                                placeholder="Mobile number"
                                />
                              {formErrors.phone && (
                                  <div className="invalid-feedback text-danger">{formErrors.phone}</div>
                              )}
                              
                          </div>
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
                          {/* confirm password */}
                          <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="retypePassword">Confirm password</label>
                              <input
                                type="password"
                                className={`form-control ${formErrors.retypePassword ? 'is-invalid' : ''}`}
                                id="retypePassword"
                                name="retypePassword"
                                value={retypePassword}
                                onChange={(e) => setRetypePassword(e.currentTarget.value)}
                                placeholder="Confirm Password"
                                />
                              {formErrors.retypePassword && (
                                  <div className="invalid-feedback text-danger">{formErrors.retypePassword}</div>
                              )}
                              
                          </div>                          
                          <button type="submit" className="btn btn-primary btn-block mb-3">Sign in</button>                          
                      </form>
                  </div>
              </div>
          </div>
          
      </>
  )
}

export default Signup