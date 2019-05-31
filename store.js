const knex = require('knex')(require('./knexfile'));
const { saltHashPassword, comparePassword } = require('./encryption');

module.exports = {
    createUser,
    authenticate
}

async function createUser ({username, password}) {
    console.log(`Creating user ${username}.`);
    const {hash, salt} = await saltHashPassword(password);
    return knex('user').insert({
        salt,
        encrypted_password: hash,
        username
    })
}

async function authenticate ({username, password}) {
    console.log(`Authenticating ${username}.`);
    const [user] = await knex('user').where({username});
    if (!user) {
        throw (new Error('User not found'));
    }
    const passwordMatches = await comparePassword(password, user.encrypted_password);
    return passwordMatches ? new Error('Incorrect password') : true;
}