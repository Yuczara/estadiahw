const mongoose = require('mongoose');

const applicationsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
 
});

module.exports = mongoose.model('producto', productoSchema);