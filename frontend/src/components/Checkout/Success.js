import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Success() {
    
        useEffect(() => {
        async function fetchPaymentDetails() {
            try {
                const response = await axios.post("http://localhost:8080/successfulPayment");
                // if (response.data) {
                //     if (response.data.valid === true) {
                //         setUserId(response.data.userId);
                //         setIsLoggedIn(true);
                //     } else {
                //         setIsLoggedIn(false);
                //         window.location.href = '/CustomerLogin';
                //     }
                // } else {
                //     setIsLoggedIn(false);
                //     window.location.href = '/CustomerLogin';
                // }
            } catch (error) {
                console.error('Error fetching user session:', error);
            }
        }

        fetchPaymentDetails();
        
        }, []);
    
  return (
    <div>Success</div>
  )
}

export default Success