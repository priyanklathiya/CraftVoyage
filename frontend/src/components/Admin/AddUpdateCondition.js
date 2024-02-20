import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom' 

function AddUpdateCondition() {
  
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const [type, setType] = useState('new');
    const [catId, setCatId] = useState('');
    const location = useLocation();
    
    const [conditionName, setConditionName] = useState("");

    useEffect(() => {
        if (location.state) {
            const { formtype, conditionDetails } = location.state;
            setType(formtype);
            setCatId(conditionDetails._id);
            setConditionName(conditionDetails.conditionName);
        }
    }, [location.state]);

    // console.log(catId);

    const history = useNavigate();

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

    const [formErrors, setFormErrors] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const [successMsg, setSuccessMsg] = useState("");

    const formRef = useRef();
//  const HandleSubmitEvent = (e) => { }
    const HandleSubmitEvent = (e) => {
        e.preventDefault();
        let formErrors = {};

        if (type === "update") {
            formErrors = {
                conditionName: !conditionName,
            };
        
        } else {

            formErrors = {
                conditionName: !conditionName,
            };
            
        }
        setIsSuccess(false);
        setIsFailed(false);
        setFormErrors({ ...formErrors });

        if (Object.values(formErrors).some((v) => v)) return;

        const formData = new FormData();
        formData.append("conditionName", conditionName);
            
        if (type === "update") {
                
            //update
            formData.append("conditionId", catId);

            axios.post("http://localhost:8080/api/condition/updateCondition", formData,{headers:{"Content-Type" : "application/json"}})
            .then((response) => { 
                window.scrollTo(0, 0);
                if (response.status === 200) {
                    if (response.data.status === 1) {
                        setIsSuccess(true);
                        setIsFailed(false);
                        setSuccessMsg(response.data.msg);
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
            } else {
            // new
            axios.post("http://localhost:8080/api/condition/addCondition", formData,{headers:{"Content-Type" : "application/json"}})
                .then((response) => { 
                    window.scrollTo(0, 0);
                    if (response.status === 200) {
                        if (response.data.status === 1) {
                            setIsSuccess(true);
                            setIsFailed(false);
                            setSuccessMsg(response.data.msg);
                            setConditionName("");
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
     }
  return (
    <>
      <h1 className='display-5'>AddUpdateCondition</h1>
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

    <form ref={formRef} onSubmit={HandleSubmitEvent} method="post" encType="multipart/form-data">
          <div className="form-group col-sm-6 margin-center">
                <label htmlFor="conditionName">Condition Name: </label><br/>
                <input type="text"
                    className={`form-control ${formErrors && (formErrors?.conditionName ? "is-invalid" : "is-valid")}`}
                    id="conditionName"
                    name="conditionName"
                    value={conditionName}
                    onChange={(e) => {setConditionName(e.currentTarget.value);}}
                    placeholder="Enter condition Name" />
                <div className="invalid-feedback">Please enter correct condition Name</div>
          </div>
          <div className='col-sm-6 margin-center'>
            <button type="submit" className="btn btn-primary mt-2 mb-4">Submit</button>
          </div>
      </form>
    </>
  )
}

export default AddUpdateCondition