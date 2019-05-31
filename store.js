module.exports = {
    createUser ({username, password}) {
        console.log(`Received request to save user ${username} ${password}.`);
        return Promise.resolve();
    }
}