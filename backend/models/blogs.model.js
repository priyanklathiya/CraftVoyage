const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const blogSchema = new Schema({
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    image: { type: String },
    title: { type: String, required: true },
    description: { type: String, trim: true },
    articleBody: { type: String, trim: true },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const info = mongoose.model("blog", blogSchema);  
module.exports = info;