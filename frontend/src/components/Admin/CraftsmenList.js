import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

function CraftsmenList() {
    const [artistData, setArtistData] = useState(null);
    // const [status, setStatus] = useState(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    
    
  async function fetchArtistList() {
        try {
            await axios.post("http://localhost:8080/api/users/getByUserType", {
                    userType: "craftsman",
                })
                .then((response) => {            
                    if (response.status === 200) {   
                        setArtistData(response.data.usersList);                        
                } else {
                    console.error('Error fetching artist list');
                    setArtistData(null);
                }
            });
        } catch (error) {
            console.error('Error fetching Category Data:', error);
            setArtistData(null);
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
          fetchArtistList();
      }

  }, [isLoggedIn]);
        
    const columns = [
        {
            name: 'name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'email',
            selector: (row) => row.email,
        },
        {
            name: 'phone',
            selector: (row) => row.phone,
        },
    ];
    

  return (
          <>
          <div className="container">
              
              <h1>Artists List</h1>
              
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
                

                {artistData && artistData.length > 0 ? (
                    <DataTable columns={columns} data={artistData} pagination fixedHeader />                  
                ) : (                      
                    <p>No data available</p>                      
                )}      

            </div>

      </>
  )
}

export default CraftsmenList