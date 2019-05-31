const bcrypt = require('bcrypt');

module.exports = [
    comparePassword,
    saltHashPassword
]

function comparePassword (password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, match) => {
            if (err) {
                return reject(err);
            }
            return resolve(match);
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
                if(err) {
                    return reject(err);
                }
    
                return resolve({hash, salt});
            })
        })
    })   
}