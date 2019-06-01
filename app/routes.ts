import { Router, Request, Response } from 'express';
import { check, validationResult } from'express-validator/check';
import { validToken, AuthRequest } from './tokens';
import * as store from './store';

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
        if(error.message == 'Incorrect password' || error.message == 'User not found') {
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
    console.log(`Hello`);
    console.log(req.auth);
    return res.json(req.auth).sendStatus(200);
});

export = router;