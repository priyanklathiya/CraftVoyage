import React, { useState, useEffect } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

function Condition() {
  
  const [conditionData, setConditionData] = useState(null);
  // const [status, setStatus] = useState(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
    
  async function fetchConditionHistory() {
        try {
                await axios.get("http://localhost:8080/api/condition/getAllCondition")
                .then((response) => {            
                    if (response.status === 200) {   
                        setConditionData(response.data.allCondition);                        
                } else {
                    console.error('Error fetching Condition Details');
                    setConditionData(null);
                }
            });
        } catch (error) {
            console.error('Error fetching Condition Data:', error);
            setConditionData(null);
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
          fetchConditionHistory();
      }

  }, [isLoggedIn]);
  
      const columns = [
        {
            name: 'Condition Name',
            selector: (row) => row.conditionName,
            sortable: true,
        },
        {      
            name: 'Edit',
            cell: (row) => (
                <>
                    <Link to="/AddUpdateCondition" state={{ formtype: 'update', conditionDetails: row }} >Edit</Link>&nbsp;&nbsp;

                    
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

      await axios.post("http://localhost:8080/api/condition/deleteCondition", {conditionId: id, status: status })
          .then((response) => { 
              window.scrollTo(0, 0);
              if (response.status === 200) {
                  if (response.data.status === 1) {
                      
                      fetchConditionHistory();

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
      <h1 className='display-5'>Condition List</h1>
      <hr />
      <Link to="/AddUpdateCondition" className="btn btn-success">
          <i className="fa-solid fa-plus"></i> Add Condition  
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
        
          

        {conditionData && conditionData.length > 0 ? (
          <DataTable columns={columns} data={conditionData} pagination fixedHeader />                  
        ) : (                      
          <p>No data available</p>                      
        )}      
        
      </div>
      
    </>
  )
}

export default Condition