const ordermodel = require('../models/order.model');


const getOrderHistory = async (req, res) => {    
    try {
        const OrderHistory = await ordermodel.find({ });
        res.status(200).json({ OrderHistory });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getOrderHistoryByUser = async (req, res) => {
    const userId = req.body.userId;
    
    try {
        // Fetch order history
        const OrderHistory = await ordermodel.find({ userId: userId });
        res.status(200).json({ OrderHistory });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getOrderById = async (req, res) => {
    const orderId = req.body.orderId;
    try {
        // Fetch OrderDetails
        const OrderDetails = await ordermodel.find({ _id : orderId });
        res.status(200).json({ OrderDetails });
        
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getOrderHistory, 
    getOrderHistoryByUser,
    getOrderById,
}