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
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

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

router.post('/authenticate', [
    check('username')
        .exists().withMessage('Username is required'),
    check('password')
        .exists().withMessage('Password is required')
        .isLength({min: 5}).withMessage('Password must be atleast 5 chars')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    store.authenticate({
        username: req.body.username,
        password: req.body.password
    }).then(() => {
        return res.sendStatus(200);
    }).catch((error) => {
        if(error = 'Incorrect password' || error == 'User not found') {
            return res.send('Incorrect username or password').status(404);
        } else {
            console.log(error);
            return res.sendStatus(500);
        }
    })
})

module.exports = router;