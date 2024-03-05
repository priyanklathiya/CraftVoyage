const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const cartSchema = new Schema({
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    cartDetails: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product'
        },
    }],
});

const info = mongoose.model("cart", cartSchema);  
module.exports = info;