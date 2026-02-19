require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const mainRoutes = require('./routes/main');
const profilRoutes = require('./routes/profil');
const logsRoutes = require('./routes/logs');
const jeuRoutes = require('./routes/jeu');
const calcRoutes = require('./routes/calc');
const adminRoutes = require('./routes/admin');
const requireAuth = require('./middleware/requireAuth');
const requireSysadmin = require('./middleware/requireSysadmin');
const requireAdminweb = require('./middleware/requireAdminweb');
const requireRegularUser = require('./middleware/requireRegularUser');

const { connectDB } = require('./config/database');
const { ensureSystemUsers } = require('./services/systemUsers');
const app = express();

// Moteur de rendu
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares globaux
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.username = req.session.username || null;
    res.locals.userRole = req.session.profil || null;
    next();
});

// Routes
app.use('/', mainRoutes);
app.use('/profil', requireAuth, profilRoutes);
app.use('/logs', requireAuth, requireSysadmin, logsRoutes);
app.use('/jeu', requireAuth, requireRegularUser, jeuRoutes);
app.use('/calculs', requireAuth, requireRegularUser, calcRoutes);
app.use('/admin', requireAuth, requireAdminweb, adminRoutes);

// Erreur 404
app.use((req, res) => {
    res.status(404).render('error404', { pageTitle: "Page non trouvée" });
});

// Lancement serveur
const startServer = async () => {
    await connectDB();
    await ensureSystemUsers();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
};

startServer().catch((err) => {
    console.error('Erreur au demarrage :', err.message);
    process.exit(1);
});
