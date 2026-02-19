const User = require('../models/User');
const Log = require('../models/Log');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');

exports.getAccueil = (req, res) => {
    res.render('accueil', { pageTitle: 'Accueil' });
};

exports.getConnexion = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/profil');
    }

    const message = req.query.registered === '1'
        ? 'Compte cree avec succes. Vous pouvez vous connecter.'
        : null;

    return res.render('connexion', {
        pageTitle: 'Connexion',
        error: null,
        message
    });
};

exports.getInscription = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/profil');
    }

    return res.render('inscription', {
        pageTitle: 'Inscription',
        error: null
    });
};

exports.postConnexion = async (req, res) => {
    const login = (req.body.login || '').trim();
    const password = req.body.password || '';

    if (!login || !password) {
        return res.status(400).render('connexion', {
            pageTitle: 'Connexion',
            error: 'Identifiant ou mot de passe manquant.',
            message: null
        });
    }

    try {
        const user = await User.findOne({ login });

        if (!user || !verifyPassword(password, user.password)) {
            return res.status(401).render('connexion', {
                pageTitle: 'Connexion',
                error: 'Identifiants invalides.',
                message: null
            });
        }

        if (!user.password.startsWith('scrypt$')) {
            user.password = hashPassword(password);
            await user.save();
        }

        req.session.userId = user._id.toString();
        req.session.username = user.login;
        req.session.profil = user.profil;

        await Log.create({
            ip_address: req.ip,
            login: user.login,
            action: 'Connexion utilisateur'
        });

        return res.redirect('/profil');
    } catch (err) {
        console.error('Erreur de connexion :', err.message);
        return res.status(500).render('connexion', {
            pageTitle: 'Connexion',
            error: 'Erreur interne. Réessayez plus tard.',
            message: null
        });
    }
};

exports.postInscription = async (req, res) => {
    const login = (req.body.login || '').trim();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (!login || !password || !confirmPassword) {
        return res.status(400).render('inscription', {
            pageTitle: 'Inscription',
            error: 'Tous les champs sont obligatoires.'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).render('inscription', {
            pageTitle: 'Inscription',
            error: 'Les mots de passe ne correspondent pas.'
        });
    }

    if (password.length < 8) {
        return res.status(400).render('inscription', {
            pageTitle: 'Inscription',
            error: 'Le mot de passe doit contenir au moins 8 caracteres.'
        });
    }

    try {
        const existingUser = await User.findOne({ login });

        if (existingUser) {
            return res.status(409).render('inscription', {
                pageTitle: 'Inscription',
                error: 'Cet identifiant est deja utilise.'
            });
        }

        await User.create({
            login,
            password: hashPassword(password),
            profil: 'connected'
        });

        await Log.create({
            ip_address: req.ip,
            login,
            action: 'Inscription utilisateur'
        });

        return res.redirect('/login?registered=1');
    } catch (err) {
        console.error('Erreur inscription :', err.message);
        return res.status(500).render('inscription', {
            pageTitle: 'Inscription',
            error: 'Erreur interne. Reessayez plus tard.'
        });
    }
};

exports.getLogout = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const currentUser = req.session.username;

    req.session.destroy(async () => {
        if (currentUser) {
            try {
                await Log.create({
                    ip_address: req.ip,
                    login: currentUser,
                    action: 'Déconnexion utilisateur'
                });
            } catch (err) {
                console.error('Erreur de log déconnexion :', err.message);
            }
        }

        res.redirect('/login');
    });

    return undefined;
};
