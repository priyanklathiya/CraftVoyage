import React from 'react';
import { Link } from 'react-router-dom'

function Success() {
  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center">
                <i className="fas fa-check-circle text-success fa-5x mb-4"></i>
                <h2 className="card-title">Payment Successful!</h2>
                <p className="card-text">Thank you for your purchase.</p>
                  <Link className="btn btn-primary" to="/Shop">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='m-5 p-5'></div>
      <div className='m-5 p-5'></div>
    </>
  );
}

export default Success;
