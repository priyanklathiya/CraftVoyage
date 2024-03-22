import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyOrders() {

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [userId, setUserId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [message, setMessage] = useState(null);

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
            }
            } else {
            setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error fetching user session:', error);
            setIsLoggedIn(false);
        }
        }

        fetchUserSession();
    }, []);
    
    async function fetchOrders() {
        try {
        const response = await axios.post("http://localhost:8080/api/orders/getOrderHistoryByUser", {
            userId: userId,
        });

        if (response.status === 200) {
            setOrderData(response.data.OrderHistory);
            console.log(response.data.OrderHistory);
        } else {
            console.error('Error fetching cart data:', response.data.message);
            setOrderData(null);
        }
        } catch (error) {
        console.error('Error fetching cart data:', error);
        setOrderData(null);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
        fetchOrders();
        }
    }, [isLoggedIn, userId]);


    return (
        <>
            <div className="container mt-5">
            <h2 className="mb-4">My Orders</h2>
            {orderData ? (
                orderData.map(order => (
                    <div key={order._id} className="card mb-3">
                        <div className="card-header">
                            <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Order Details</h5>
                            <ul className="list-group list-group-flush">
                                {order.orderDetails.map(product => (
                                    <li key={product._id} className="list-group-item">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <strong>Title:</strong> {product.title}<br />
                                                <strong>Quantity:</strong> {product.quantity}<br />
                                                <strong>Price:</strong> ${product.price / 100}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="card-text mt-3"><strong>Total Amount:</strong> ${order.totalAmount / 100}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
        
        </>
    )
}

export default MyOrders