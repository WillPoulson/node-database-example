import jwt from 'jsonwebtoken';
import * as config from './config';
import { Request, Response } from 'express';
import _ from 'lodash';
import moment from 'moment';

export function generateToken(username: string): string {
    return jwt.sign({username},
        config.secret,
        { expiresIn: 86400000 }
    );
}

export function decodeToken(token: string): Promise<string | object> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            return err ? reject(err) : resolve(decoded);
        })
    })
}

export function validToken(req: AuthRequest, res: Response, next: any) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    decodeToken(token).then((auth : any) => {
        req.auth = {
            username: auth.username,
            expiry: moment(auth.exp).toISOString()
        }
        next()
    }).catch((err) => {
        return res.status(403).json({ error: 'Invalid auth token!' });
    })  
}

export interface AuthRequest extends Request {
    auth?: any;
}

export interface Auth {
    username: string;
    expiry: string;
}
