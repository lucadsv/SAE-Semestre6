const User = require('../models/User');
const Log = require('../models/Log');
const { hashPassword } = require('../utils/passwordUtils');

exports.getProfil = async (req, res) => {
    const user = await User.findById(req.session.userId).lean();
    res.render('profil', {
        pageTitle: "Profil",
        user,
        error: null,
        message: null
    });
};

exports.postUpdateProfil = async (req, res) => {
    const user = await User.findById(req.session.userId);

    if (!user) {
        return res.status(404).render('profil', {
            pageTitle: "Profil",
            user: null,
            error: 'Utilisateur introuvable.',
            message: null
        });
    }

    const newLogin = (req.body.login || '').trim();
    const newPassword = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';
    const isSystemUser = user.login === 'adminweb' || user.login === 'sysadmin';

    if (isSystemUser) {
        return res.status(403).render('profil', {
            pageTitle: "Profil",
            user: user.toObject(),
            error: 'Modification interdite pour les comptes systeme.',
            message: null
        });
    }

    if (!newLogin) {
        return res.status(400).render('profil', {
            pageTitle: "Profil",
            user: user.toObject(),
            error: 'Identifiant invalide.',
            message: null
        });
    }

    const existing = await User.findOne({ login: newLogin, _id: { $ne: user._id } });
    if (existing) {
        return res.status(409).render('profil', {
            pageTitle: "Profil",
            user: user.toObject(),
            error: 'Cet identifiant est deja pris.',
            message: null
        });
    }

    if (newPassword) {
        if (newPassword.length < 8) {
            return res.status(400).render('profil', {
                pageTitle: "Profil",
                user: user.toObject(),
                error: 'Le mot de passe doit contenir au moins 8 caracteres.',
                message: null
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).render('profil', {
                pageTitle: "Profil",
                user: user.toObject(),
                error: 'Les mots de passe ne correspondent pas.',
                message: null
            });
        }

        user.password = hashPassword(newPassword);
    }

    const oldLogin = user.login;
    user.login = newLogin;
    await user.save();

    req.session.username = user.login;

    await Log.create({
        ip_address: req.ip,
        login: req.session.username,
        action: `Mise a jour profil: ${oldLogin} -> ${user.login}`
    });

    return res.render('profil', {
        pageTitle: "Profil",
        user: user.toObject(),
        error: null,
        message: 'Profil mis a jour avec succes.'
    });
};

exports.postDeleteProfil = async (req, res) => {
    const user = await User.findById(req.session.userId);

    if (!user) {
        return res.redirect('/login');
    }

    if (user.login === 'adminweb' || user.login === 'sysadmin') {
        return res.status(403).render('profil', {
            pageTitle: "Profil",
            user: user.toObject(),
            error: 'Suppression interdite pour les comptes systeme.',
            message: null
        });
    }

    const deletedLogin = user.login;
    await User.deleteOne({ _id: user._id });

    await Log.create({
        ip_address: req.ip,
        login: deletedLogin,
        action: 'Suppression de son propre compte'
    });

    req.session.destroy(() => {
        res.redirect('/login');
    });

    return undefined;
};
