const knex = require('knex')(require('./knexfile'));

module.exports = {
    createUser ({username, password}) {
        console.log(`Received request to save user ${username} ${password}.`);
        return knex('user').insert({
            username,
            password
        })
    }
}