const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connecté à MongoDB");
    } catch (err) {
        console.error("Erreur MongoDB :", err.message);
        process.exit(1);
    }
};