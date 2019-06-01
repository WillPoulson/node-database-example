import { Router, Request, Response } from 'express';
import { check, validationResult } from'express-validator/check';
import { validToken, AuthRequest } from './tokens';
import * as store from './store';
import _ from 'lodash';

const router = Router();

router.post('/createUser', [
    check('username')
        .exists().withMessage('Username is required'),
    check('password')
        .exists().withMessage('Password is required')
        .isLength({min: 5}).withMessage('Password must be atleast 5 chars')
], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    store.createUser({
        username: req.body.username,
        password: req.body.password
    }).then(() => {
        res.sendStatus(200);
    }).catch((error: Error) => {
        console.log(error);
        res.sendStatus(500);
    })
});

router.post('/authenticate', [
    check('username')
        .exists().withMessage('Username is required'),
    check('password')
        .exists().withMessage('Password is required')
        .isLength({min: 5}).withMessage('Password must be atleast 5 chars')
], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    store.authenticate({
        username: req.body.username,
        password: req.body.password
    }).then((token) => {
        return res.json({
            token
        }).sendStatus(200);
    }).catch((error: Error) => {
        if(error.name === 'incorrect-password' || error.name === 'user-not-found') {
            return res.send('Incorrect username or password').status(404);
        } else {
            console.log(error);
            return res.sendStatus(500);
        }
    })
});

router.get('/me', [
    validToken
],(req: AuthRequest, res: Response) => {
    store.getUser(req.auth.username).then((user) => {
        user = _.omit(user, ['salt', 'encrypted_password']);
        return res.send(user).sendStatus(200);
    }).catch((error) => {
        if(error.name === 'user-not-found') {
            return res.send('User not found').status(404);
        } else {
            console.log(error);
            return res.sendStatus(500);
        }
    })
});

export = router;