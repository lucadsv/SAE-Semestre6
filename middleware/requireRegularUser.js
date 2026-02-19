module.exports = (req, res, next) => {
    if (req.session.username === 'adminweb' || req.session.username === 'sysadmin') {
        return res.status(403).render('error403', { pageTitle: 'Acces refuse' });
    }

    return next();
};
