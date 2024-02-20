
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connection string can be found in server.js

mongoose.Promise = global.Promise;

// condition schema
const conditionSchema = new Schema({
    conditionName: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true }, //  (false means it's not available)
});


const info = mongoose.model("condition", conditionSchema);  // collection name - condition
module.exports = info;