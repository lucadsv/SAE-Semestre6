const User = require('../models/User');

exports.getProfil = async (req, res) => {
    const user = await User.findById(req.session.userId).lean();
    res.render('profil', { pageTitle: "Profil", user });
};