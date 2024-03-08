import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

function ViewBlogs() {
    
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');

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
                        window.location.href = '/CraftsmanLogin';
                    }
                } else {
                    setIsLoggedIn(false);
                    window.location.href = '/CraftsmanLogin';
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
                window.location.href = '/CraftsmanLogin';
            }
        }

        fetchUserSession();
        
        }, []);
    
    
    const [blogData, setBlogData] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    async function fetchBlogsData() {
        try {
                await axios.post("http://localhost:8080/api/blogs/getBlogsByUserId", {
                    userId: userId
                })
                .then((response) => {            
                    if (response.status === 200) {   
                        setBlogData(response.data.blog);                     
                } else {
                    console.error('Error fetching blog Details');
                    setBlogData(null);
                }
            });
        } catch (error) {
            console.error('Error fetching blog Data:', error);
            setBlogData(null);
        }
    }

    useEffect(() => {

        if (isLoggedIn) {
            fetchBlogsData();
        }

    }, [isLoggedIn, userId]);

        const columns = [
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
            width: "150px",
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            width: "150px",
        },
        {
            name: 'Image',
            cell: (row) => (
                <img src={`http://localhost:8080/${row.image}`} style={{ width: '140px', height: 'auto' }} alt={ `${row.image}` } />
            ),
            width: "150px",
        },
        {      
            name: 'Edit',
            cell: (row) => (
                <>
                    <Link to="/AddUpdateBlogs" state={{ type: 'update', blogDetails: row }} >Edit</Link>&nbsp;&nbsp;
                    {/* Delete Blog */}
                    <button className='btn btn-danger' onClick={()=> deleteBlog(row._id)}> Delete </button>                    
                </>
            ),
        },
    ];

        async function deleteBlog(id){ 

        
                                    
        await axios.post("http://localhost:8080/api/blogs/removeBlog", {blogId: id })
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                       
                        fetchBlogsData();

                    }
                    else {
                        setIsSuccess(false);
                        setIsFailed(true);
                        setSuccessMsg(response.data.msg);
                    }
                } else {
                    setIsSuccess(false);
                    setIsFailed(true);
                    setSuccessMsg('Something went wrong. Please try again later!');
                    }
            }).catch((err) => { 
                setIsSuccess(false);
                setIsFailed(true);
                setSuccessMsg(err.message);
            })

    }


  return (
            <>
          <div className="container">
              
              <h1>Your Blogs</h1>
              
                <hr />
                
              {isSuccess && (
                  
                <div className="alert alert-success m-3" role="alert">
                    <b>Success!</b><br /> {successMsg}
                </div>
                )}
                
                {isFailed && (
                    <div className="alert alert-danger m-3" role="alert">
                        <b>Failed!</b><br /> {successMsg}
                    </div>
                )}
                

                {blogData && blogData.length > 0 ? (
                    <DataTable columns={columns} data={blogData} pagination fixedHeader />                  
                ) : (                      
                    <p>No data available</p>                      
                )}      

            </div>

      </>
      
  )
}

export default ViewBlogs