const crypto = require('crypto');

const SCRYPT_KEY_LENGTH = 64;

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex');
    return `scrypt$${salt}$${hash}`;
};

const verifyPassword = (password, storedPassword) => {
    if (!storedPassword) {
        return false;
    }

    if (storedPassword.startsWith('scrypt$')) {
        const parts = storedPassword.split('$');

        if (parts.length !== 3) {
            return false;
        }

        try {
            const salt = parts[1];
            const storedHash = parts[2];
            const derivedHash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex');
            const storedBuffer = Buffer.from(storedHash, 'hex');
            const derivedBuffer = Buffer.from(derivedHash, 'hex');

            if (storedBuffer.length !== derivedBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
        } catch (err) {
            return false;
        }
    }

    return storedPassword === password;
};

module.exports = {
    hashPassword,
    verifyPassword
};
