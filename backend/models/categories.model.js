
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// category schema
const categorySchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true }, //  (false means it's not available)
});


const info = mongoose.model("category", categorySchema);  // collection name - category
module.exports = info;