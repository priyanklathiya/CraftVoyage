import React from 'react';
import { Link } from 'react-router-dom'

function Cancel() {
  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center">
                <i className="fas fa-times-circle text-danger fa-5x mb-4"></i>
                <h2 className="card-title">Payment Canceled</h2>
                <p className="card-text">Your payment has been canceled.</p>
                <Link className="btn btn-primary" to="/Shop">Go Back to Shopping Page</Link>
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

export default Cancel;