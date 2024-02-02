import React, { useEffect, useState } from 'react'
import axios from 'axios';

function AdminDashboard() {
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
                        window.location.href = '/CustomerLogin';
                    }
                } else {
                    setIsLoggedIn(false);
                    window.location.href = '/CustomerLogin';
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false);
                window.location.href = '/CustomerLogin';
            }
        }

        fetchUserSession();
        
        }, []);
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard