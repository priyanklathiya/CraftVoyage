import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const contentContainerStyle = {
  display: 'flex',
  maxWidth: '80%',
  width: '100%',
  marginTop: '20px',
};

const imageContainerStyle = {
  flex: '0 0 50%',
};

const imageStyle = {
  width: '80%',
  maxHeight: '800px',
  objectFit: 'fill',
  borderRadius: '8px',
};

const detailsContainerStyle = {
  flex: '0 0 50%',
  textAlign: 'left',
  padding: '0 20px',
};

const selectStyle = {
  marginTop: '10px',
  padding: '8px',
  width: '100%',
};

const buttonContainerStyle = {
  marginTop: '20px',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
};

function ProductDetails() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userId, setUserId] = useState('');
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [addToCartError, setAddToCartError] = useState('');

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const location = useLocation();
  const productId = new URLSearchParams(location.search).get('id');

    
  useEffect(() => {
    axios.get("http://localhost:8080/auth/userSession")
      .then((response) => {
        if (response.data) {
          if (response.data.valid === true) {
            // if session is true
            // console.log(response.data);
// {valid: true, userType: 'customer', userId: '651dc8bee4e9a51b5866b906'}
            setUserId(response.data.userId);
            setIsLoggedIn(true);
          } else {
            // if session is false
            setIsLoggedIn(false);
          } 
        } else {
          // if session is false
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user session:', error);
        setIsLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    fetchProductData(productId);
  }, [productId]);

  const [productDetails, setProductDetails] = useState(null);

    const fetchProductData = async (productId) => {
        try {
        const response = await axios.post('http://localhost:8080/api/products/getProductByPId', {
            productId: productId,
        });
        // console.log(response.data.product);

        setProductDetails(response.data.product);
        } catch (error) {
        console.error('Error fetching products:', error);
        }
    };
  const handleAddToCart = async () => {
    setAddToCartMessage('');

    if (isLoggedIn === false) {
      // Show the login modal
      // setShowLoginModal(true);
       handleShow()
    } else {
      // Clear the error message if successful
      setAddToCartError('');
      
      try {
        await axios.post('http://localhost:8080/api/cart/addCart', {
          userId: userId,
          cartDetails: [{
            productId: productDetails._id
          }]
        }).then((response) => { 
          if (response.status && response.status === 200) {
            if (response.data.statuscode == 3) {
              setAddToCartMessage("Product already added to cart!");
              return false;
            }
            // data added to cart
            setAddToCartMessage('Product added to cart successfully!');
          
          }
          else {
            // could not add data to cart
            setAddToCartMessage('Error adding product to cart. Please try again later.');
          }
        });
      } catch (error) {
        console.error('Error in inserting record to Cart : ', error);
        setAddToCartMessage('Error adding product to cart. Please try again later.');
      }

        // Set a timer to clear the message after 5 seconds (adjust as needed)
        setTimeout(() => {
          setAddToCartMessage('');
        }, 4000);
    }
  };

  const handleAddToWishlist = () => {
    if (isLoggedIn === false) {
      // Show the login modal
      handleShow();
    }
    };
    
  return (
        <div style={containerStyle}>
      <h2>{productDetails && productDetails.productName}</h2>

      <div style={contentContainerStyle}>
        <div style={imageContainerStyle}>
            <img
              src={productDetails && `http://localhost:8080/${productDetails.image}`}
              alt={productDetails && productDetails.productName}
              style={imageStyle}
            />
        </div>

        <div style={detailsContainerStyle}>
          <h2>{productDetails && productDetails.title}</h2>
          <p><b>Artist: </b> {productDetails && productDetails.artist}</p>
          <p><b>Product Description:</b> {productDetails && productDetails.description}</p>
          <p><b>Price: </b> {productDetails && productDetails.price}</p>
          <p><b>Dimensions:</b> Height: {productDetails && productDetails.dimensions.height}, Width: {productDetails && productDetails.dimensions.width}, Depth: {productDetails && productDetails.dimensions.depth}</p>
          <p>{productDetails && productDetails.additionalInformation}</p>

          {addToCartError && <p style={{ color: 'red' }}>{addToCartError}</p>}

          <div style={buttonContainerStyle}>
            <button className='btn btn-primary m-1' onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className='btn btn-secondary m-1' onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          </div>
          {addToCartMessage && <p style={{ color: addToCartMessage.includes('success') ? 'green' : 'red' }}>{addToCartMessage}</p>}

          

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>You need to be logged in to perform this action. Please log in or sign up.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Link to="/CustomerLogin" className="login-link">
              <Button variant="primary">
                Sign Up/Login
                </Button>
                </Link>  
            </Modal.Footer>
          </Modal>

          
        </div>
      </div>


    </div>
  )
}

export default ProductDetails