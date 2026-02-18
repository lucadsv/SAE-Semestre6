const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    ip_address: String,
    login: String,
    date: { type: Date, default: Date.now },
    action: String
});

module.exports = mongoose.model('Log', logSchema);