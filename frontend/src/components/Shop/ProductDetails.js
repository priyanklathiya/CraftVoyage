import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import billboard3 from "../../images/Renaissance.jpg";

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
  const [sharedProductId, setSharedProductId] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const location = useLocation();
  const productId = new URLSearchParams(location.search).get('id');


  useEffect(() => {
    const fetchUserData = async () => {
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
    };
    fetchUserData();
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

  const handleShareButtonClick = async (productId) => {
    const shareableLink = `http://localhost:3000/ProductDetails?id=${productId}`;
    await navigator.clipboard.writeText(shareableLink);
    setSharedProductId(productId); // Set the shared product ID
    setTimeout(() => {
        setSharedProductId(null); // Reset the shared product ID after some time
    }, 3000); // Reset after 3 seconds
  };
    
  return (
    <>
      
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
              
            <button
                className={`btn ${sharedProductId === productDetails?._id ? 'btn-info' : 'btn-secondary'} m-1`}
                onClick={() => handleShareButtonClick(productDetails?._id)}
                disabled={sharedProductId === productDetails?._id}
              >
              {sharedProductId === productDetails?._id ? "Copied" : "Share"}
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
      
        <div className='container mission-i mt-5'>
          <div className='display-4'>Our Mission</div>
          <hr className="mt-2 mb-4" /> {/* Adjust margins as needed */}
          <div className="row">
            <div className="col-md-6">
              <img className="banner-3-img img-fluid" src={billboard3} alt="Banner-3" />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <p className="lead text-center"> {/* Added text-center class */}
                Our mission is to make art investable.
                CraftVoyage is the only platform that lets you invest in multi-million dollar works of art by artists like Basquiat, Picasso, Banksy, and more.
              </p>
            </div>
          </div>
      </div>
      <div className='p-3'></div>
    </>
  )
}

export default ProductDetails