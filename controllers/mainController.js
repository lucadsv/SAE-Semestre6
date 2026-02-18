exports.getAccueil = (req, res) => {
    res.render('accueil', { pageTitle: "Accueil" });
};

exports.getConnexion = (req, res) => {
    res.render('connexion', { pageTitle: "Connexion" });
};