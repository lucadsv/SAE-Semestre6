module.exports = (req, res, next) => {
    if (req.session.username !== 'adminweb') {
        return res.status(403).render('error403', { pageTitle: 'Acces refuse' });
    }

    return next();
};
