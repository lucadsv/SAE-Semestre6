const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
    const logs = await Log.find().sort({ date: -1 }).lean();
    res.render('logs', { pageTitle: "Historique des Logs", logs });
};