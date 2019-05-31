const knex = require('knex')(require('./knexfile'));
const bcrypt = require('bcrypt');

module.exports = {
    saltHashPassword,
    createUser
}

async function createUser ({username, password}) {
    console.log(`Received request to save user ${username} ${password}.`);
    
    const {hash, salt} = await saltHashPassword(password);

    return knex('user').insert({
        salt,
        encrypted_passwor: hash,
        username
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