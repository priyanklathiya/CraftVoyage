
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// category schema
const categorySchema = new Schema({
    categoryName: { type: String, required: true, trim: true },
});


const info = mongoose.model("category", categorySchema);  // collection name - category
module.exports = info;