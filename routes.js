var router = require('express').Router();

const store = require('./store');

router.post('/createUser', (req, res) => {
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

module.exports = router;