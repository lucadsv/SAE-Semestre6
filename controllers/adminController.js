const User = require('../models/User');
const Log = require('../models/Log');
const { hashPassword } = require('../utils/passwordUtils');

const normalizeCsvRows = (csvData) => {
    return (csvData || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
};

exports.getCreateAccounts = (req, res) => {
    return res.render('create-accounts', {
        pageTitle: 'Creer comptes',
        error: null,
        message: null
    });
};

exports.postCreateAccount = async (req, res) => {
    const login = (req.body.login || '').trim();
    const password = req.body.password || '';

    if (!login || !password) {
        return res.status(400).render('create-accounts', {
            pageTitle: 'Creer comptes',
            error: 'Identifiant et mot de passe requis.',
            message: null
        });
    }

    if (password.length < 8) {
        return res.status(400).render('create-accounts', {
            pageTitle: 'Creer comptes',
            error: 'Le mot de passe doit contenir au moins 8 caracteres.',
            message: null
        });
    }

    try {
        const existing = await User.findOne({ login });
        if (existing) {
            return res.status(409).render('create-accounts', {
                pageTitle: 'Creer comptes',
                error: 'Ce compte existe deja.',
                message: null
            });
        }

        await User.create({
            login,
            password: hashPassword(password),
            profil: 'connected'
        });

        await Log.create({
            ip_address: req.ip,
            login: req.session.username,
            action: `Creation manuelle compte ${login}`
        });

        return res.render('create-accounts', {
            pageTitle: 'Creer comptes',
            error: null,
            message: `Compte ${login} cree avec succes.`
        });
    } catch (err) {
        return res.status(500).render('create-accounts', {
            pageTitle: 'Creer comptes',
            error: 'Erreur interne pendant la creation du compte.',
            message: null
        });
    }
};

exports.postImportCsv = async (req, res) => {
    const rows = normalizeCsvRows(req.body.csvData);

    if (rows.length === 0) {
        return res.status(400).render('create-accounts', {
            pageTitle: 'Creer comptes',
            error: 'Le contenu CSV est vide.',
            message: null
        });
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
        const [rawLogin, rawPassword] = row.split(',').map((value) => (value || '').trim());

        if (!rawLogin || !rawPassword || rawPassword.length < 8) {
            skippedCount += 1;
            continue;
        }

        const exists = await User.findOne({ login: rawLogin });
        if (exists) {
            skippedCount += 1;
            continue;
        }

        await User.create({
            login: rawLogin,
            password: hashPassword(rawPassword),
            profil: 'connected'
        });

        createdCount += 1;
    }

    await Log.create({
        ip_address: req.ip,
        login: req.session.username,
        action: `Import CSV comptes: ${createdCount} crees, ${skippedCount} ignores`
    });

    return res.render('create-accounts', {
        pageTitle: 'Creer comptes',
        error: null,
        message: `Import termine: ${createdCount} compte(s) cree(s), ${skippedCount} ligne(s) ignoree(s).`
    });
};

exports.getManageAccounts = async (req, res) => {
    const users = await User.find().sort({ login: 1 }).lean();
    return res.render('manage-accounts', {
        pageTitle: 'Gerer comptes',
        users,
        error: null
    });
};

exports.postDeleteAccount = async (req, res) => {
    const userId = req.body.userId;

    if (!userId) {
        const users = await User.find().sort({ login: 1 }).lean();
        return res.status(400).render('manage-accounts', {
            pageTitle: 'Gerer comptes',
            users,
            error: 'Identifiant de compte manquant.'
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        const users = await User.find().sort({ login: 1 }).lean();
        return res.status(404).render('manage-accounts', {
            pageTitle: 'Gerer comptes',
            users,
            error: 'Compte introuvable.'
        });
    }

    if (user.login === 'adminweb' || user.login === 'sysadmin') {
        const users = await User.find().sort({ login: 1 }).lean();
        return res.status(403).render('manage-accounts', {
            pageTitle: 'Gerer comptes',
            users,
            error: 'Suppression des comptes systeme interdite.'
        });
    }

    await User.deleteOne({ _id: userId });

    await Log.create({
        ip_address: req.ip,
        login: req.session.username,
        action: `Suppression compte ${user.login}`
    });

    return res.redirect('/admin/manage-accounts');
};
