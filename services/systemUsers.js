const User = require('../models/User');
const { hashPassword } = require('../utils/passwordUtils');

const SYSTEM_USERS = [
    {
        login: 'sysadmin',
        password: 'sysadmin',
        profil: 'adminsys'
    },
    {
        login: 'adminweb',
        password: 'adminweb',
        profil: 'adminweb'
    }
];

const ensureSystemUsers = async () => {
    for (const account of SYSTEM_USERS) {
        await User.findOneAndUpdate(
            { login: account.login },
            {
                login: account.login,
                password: hashPassword(account.password),
                profil: account.profil
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
};

module.exports = {
    ensureSystemUsers
};
