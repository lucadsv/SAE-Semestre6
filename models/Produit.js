const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: String,
    prixu: Number,
    origine: String
});

module.exports = mongoose.model('Produit', produitSchema);