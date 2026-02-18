const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profil: { type: String, enum: ['adminweb', 'adminsys', 'connected'], default: 'connected' },
    profil_picture: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);