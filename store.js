const knex = require('knex')(require('./knexfile'));
const { saltHashPassword, comparePassword } = require('./encryption');

module.exports = {
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