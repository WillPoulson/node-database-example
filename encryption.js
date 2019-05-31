const bcrypt = require('bcrypt');

module.exports = [
    comparePassword,
    saltHashPassword
]

function comparePassword (password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, match) => {
            return err ? reject(err) : resolve(match);
        })
    })
}

function saltHashPassword (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }
    
            bcrypt.hash(password, salt, (err, hash) => {
                return err ? reject(err) : resolve({ hash, salt });
            })
        })
    })   
}