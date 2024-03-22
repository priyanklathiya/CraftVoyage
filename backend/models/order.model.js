const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderDetails: [{
        title: {
            type: String,
            required: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: '1'
        },
        price: {
            type: Number,
            required: true
        },
    }],
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentIntent: {
        type: String,
        required: true

    },
    paymentId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
