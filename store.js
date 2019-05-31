const knex = require('knex')(require('./knexfile'));
const bcrypt = require('bcrypt');

module.exports = {
    saltHashPassword,
    createUser,
    authenticate
}

async function createUser ({username, password}) {
    console.log(`Received request to save user ${username} ${password}.`);
    
    const {hash, salt} = await saltHashPassword(password);

    return knex('user').insert({
        salt,
        encrypted_password: hash,
        username
    })
}

async function authenticate ({username, password}) {
    console.log(`Authenticating ${username}`);
    const [user] = await knex('user').where({username});

    if (!user) {
        throw (new Error('User not found'));
    }

    console.log(user);
    console.log(user.encrypted_password);

    const match = await comparePassword(password, user.encrypted_password);

    if (!match) {
        throw (new Error('Incorrect password'));
    }

    return match;
}

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