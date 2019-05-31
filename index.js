const express = require('express');
const bodyParser = require('body-parser');

const store = require('./store');

const app = express();
app.use(bodyParser.json());

const apiUrl = '/api';
const serverPort = 5000;

app.route(apiUrl)
    .post('/createUser', (req, res) => {
        store.createUser({
            username: req.body.username,
            password: req.body.password
        }).then(() => {
            res.sendStatus(200);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        })
    })

app.listen(serverPort, () => {
    console.log(`Server running, listening on port ${serverPort}.`);
})