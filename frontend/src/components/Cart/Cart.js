import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  
  return (
    <>
      {isLoggedIn === null && <p>Loading...</p>}
      {isLoggedIn === true && (
        <>
          <div className='container'>
            {cartData && cartData.length > 0 ? (
              <>
                {cartData.map((item, index) => (
                  <div className="card mb-3" key={index} >
                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <img src={`http://localhost:8080/${item.image}`} alt={item.title}  className="card-img" />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">( Artist - {item.artist} )</p>
                          <p className="card-text"><b>${item.price}</b></p>
                          <button className='btn btn-danger' onClick={() => handleRemoveFromCart(item.productId )}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                                    
                    
                ))}
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