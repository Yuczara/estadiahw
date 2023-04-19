const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    english: {
        type: String,
        required: true
    },
    achievements: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('candidates', CandidateSchema);