import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Blogs() {

  const [blogData, setBlogData] = useState(null);
  const [message, setMessage] = useState(null);
      
  async function fetchCartData() {
    try {
      const response = await axios.get("http://localhost:8080/api/blogs/getAllBlogs");

      if (response.status === 200) {
        setBlogData(response.data.allblogs);
      } else {
        console.error('Error fetching cart data:', response.data.message);
        setBlogData(null);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setBlogData(null);
    }
  }
    
    useEffect(() => {      
        fetchCartData();
    }, []);
    
    
  return (
      <>
          <div className='container'>
          <h1 className='Display-1'>Blogs</h1>
              <hr />
              {blogData && blogData.length > 0 ? (
                <>
                    {blogData.map((item, index) => (
                        <div className="card" style={{width: "18rem"}}>
                            <img src={`http://localhost:8080/${item.image}`} alt={item.title}  className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{item.title} </h5>
                                <p className="card-text">{item.description} </p>
                                <a href="#" className="btn btn-primary">Read Blog</a>
                            </div>
                        </div>
                    ))}
                </>
                ) : (
                    <p>Your cart is empty.</p>
              )}
              
      </div>
          
      </>
  )
}

export default Blogs