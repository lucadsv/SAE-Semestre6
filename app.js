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

const { connectDB } = require('./config/database');
const app = express();

// Connexion MongoDB
connectDB();

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
    next();
});

// Routes
app.use('/', mainRoutes);
app.use('/profil', profilRoutes);
app.use('/logs', logsRoutes);
app.use('/jeu', jeuRoutes);
app.use('/calculs', calcRoutes);

// Erreur 404
app.use((req, res) => {
    res.status(404).render('error404', { pageTitle: "Page non trouvée" });
});

// Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));