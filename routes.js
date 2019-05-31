var router = require('express').Router();

const { check, validationResult } = require('express-validator/check');
const store = require('./store');

router.post('/createUser', [
    check('username')
        .exists().withMessage('Username is required'),
    check('password')
        .exists().withMessage('Password is required')
        .isLength({min: 5}).withMessage('Password must be atleast 5 chars')
], (req, res) => {
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