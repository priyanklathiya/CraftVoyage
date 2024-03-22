import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState('');
  const [cartData, setCartData] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await axios.get("http://localhost:8080/auth/userSession");
        if (response.data) {
          if (response.data.valid === true) {
            setUserId(response.data.userId);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        setIsLoggedIn(false);
      }
    }

    fetchUserSession();
  }, []);
  
  
  async function fetchCartData() {
    try {
      const response = await axios.post("http://localhost:8080/api/cart/getCart", {
        userId: userId,
      });

      if (response.status === 200) {
        setCartData(response.data.cartDetails);
      } else {
        console.error('Error fetching cart data:', response.data.message);
        setCartData(null);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setCartData(null);
    }
  }

  useEffect(() => {
      if (isLoggedIn) {
      fetchCartData();
      }
  }, [isLoggedIn, userId]);

  const handleRemoveFromCart = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      removeFromCart(productId);
    }
  };
   
  const removeFromCart = async (productId) => {
      setMessage(null);
      try {
          await axios.post("http://localhost:8080/api/cart/removeFromCart", {
              userId: userId,
              productId: productId
          }).then((response) => {
              if (response.status === 200 && response.data.status === 1) {
                  // Refresh the cart data after successful removal
                  fetchCartData();
                      setMessage({ text: response.data.message, type: 'success' });
                  
                  setTimeout(() => {
                      setMessage(null);
                  }, 4000);
              } else {
                  console.error('Error removing item from cart:', response.data.message);
                  setMessage({ text: response.data.message, type: 'error' });
              }
          });
      } catch (error) {
          console.error('Error removing item from cart:', error);
          setMessage({ text: 'Internal Server Error', type: 'error' });
      }
  };

  const makePayment = async () => {
  try {
    const body = {
      products: cartData,
      userId: userId
    };

    const headers = {
      "Content-Type": "application/json"
    };

    const response = await fetch("http://localhost:8080/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers
    });

    const data = await response.json(); // Await the response.json() promise

    // console.log(data);

    if (!response.ok) {
      throw new Error(data.message + " Please try again");
    }

    if (data.session.url) {
      window.location.href = data.session.url; // Redirect to the payment page
    }
  } catch (error) {
    alert("Error making payment: " + error.message);
  }
};

  
  return (
    <>
      {isLoggedIn === null && <p>Loading...</p>}
      {isLoggedIn === true && (
        <>
          <div className='container'>
            <h2 className='mt-2'>Your Cart</h2>
            <hr />
            {cartData && cartData.length > 0 ? (
              <>
                {cartData.map((item, index) => (
                  <div className='border border-secondary row mb-1  d-flex align-items-center justify-content-center p-1' key={index}>
                    <div className="col-sm-2">
                      <img src={`http://localhost:8080/${item.image}`} alt={item.title} className="card-img" style={{ maxWidth: '150px', width: 'auto', height: 'auto'  }} />
                    </div>
                    <div className="col-sm-4">
                      <span className='h3'>{item.title}  </span> <span className='p-2'>( Artist - {item.artist} )</span>
                    </div>
                    <div className='col-sm-4'><b>${item.price}</b></div>
                    <div className='col-sm-2'> <button className='btn btn-danger' onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                    </div>
                  </div>
                ))}
                <hr className='mt-5'/>
                <div className="row">

                  <div className="col-sm-3 h4">Total Items: {cartData.length}</div>
                  
                  <div className="col-sm-7 h4">Total Amount: ${cartData.reduce((total, item) => total + item.price, 0)}</div>
                  <div className='col-sm-2'><button className='btn btn-success' onClick={makePayment}>Checkout</button></div>
                </div>
                <hr/>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
        </>
      )}
      {isLoggedIn === false && (
        <div className='text-center'>
          <h1 className='text-center display-1'> Cart </h1>
          <p>Please log in to view your cart.</p>
        </div>
      )}
    </>
  )
}

export default Cart