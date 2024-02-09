
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// Products schema
const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, trim: true },
    year: { type: Number },
    artist: { type: String, required: true },
    style: { type: String },
    image: { type: String },
    quantity: { type: String },
    dimensions: {
        height: { type: String },
        width: { type: String },
        depth: { type: String }
    },
    price: { type: Number, required: true },
    condition: { type: String },
    additionalInformation: { type: String },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: { type: Boolean, default: false }, //  (false means it's not available)
});

const info = mongoose.model("product", productSchema);
module.exports = info;