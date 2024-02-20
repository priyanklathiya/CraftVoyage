import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

function Category() {

  const [categoryData, setCategoryData] = useState(null);
  // const [status, setStatus] = useState(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
    
  async function fetchCategoryHistory() {
        try {
                await axios.get("http://localhost:8080/api/category/getAllCategory")
                .then((response) => {            
                    if (response.status === 200) {   
                        setCategoryData(response.data.allCategory);                        
                } else {
                    console.error('Error fetching Category Details');
                    setCategoryData(null);
                }
            });
        } catch (error) {
            console.error('Error fetching Category Data:', error);
            setCategoryData(null);
        }
  }

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
                        window.location.href = '/AdminLogin';
                    }
                } else {
                    setIsLoggedIn(false);
                    window.location.href = '/AdminLogin';
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
                window.location.href = '/AdminLogin';
            }
        }
        fetchUserSession();
    }, []);
  
  useEffect(() => {

      if (isLoggedIn) {
          fetchCategoryHistory();
      }

  }, [isLoggedIn]);
  
      const columns = [
        {
            name: 'Category Name',
            selector: (row) => row.categoryName,
            sortable: true,
        },
        {      
            name: 'Edit',
            cell: (row) => (
                <>
                    <Link to="/AddUpdateCategory" state={{ formtype: 'update', categoryDetails: row }} >Edit</Link>&nbsp;&nbsp;

                    
                </>
            ),
        },
        {      
            name: 'Update Status',
            cell: (row) => (
              <>
                {/* check status of product */}
                {row.status === true ? (
                    <button className='btn btn-danger' onClick={()=> changeStatusEvent(row._id, false)}>Disable</button>
                ): (
                    <button className='btn btn-success' onClick={()=> changeStatusEvent(row._id, true)}>Enable</button> 
                )}
                    
              </>
              
            ),
        },
  ];
  
  async function changeStatusEvent(id, status){ 

      await axios.post("http://localhost:8080/api/category/deleteCategory", {categoryId: id, status: status })
          .then((response) => { 
              window.scrollTo(0, 0);
              if (response.status === 200) {
                  if (response.data.status === 1) {
                      
                      fetchCategoryHistory();

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
      
      <h1 className='display-5'>Category List</h1>
      <hr />      
      <Link to="/AddUpdateCategory" className="btn btn-success">        
        <i className="fa-solid fa-plus"></i> Add Category          
      </Link>  

      <div className="container">
          
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
          

          {categoryData && categoryData.length > 0 ? (
              <DataTable columns={columns} data={categoryData} pagination fixedHeader />                  
          ) : (                      
              <p>No data available</p>                      
          )}      

      </div>

      
    </>
    
  )
}

export default Category