import jwt from 'jsonwebtoken';
import * as config from './config';

export function generateToken(username: string): string {
    return jwt.sign({ username },
        config.secret,
        { expiresIn: '24h' }
    );
}

export function verifyToken(token: string): Promise<string | object> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            return err ? reject(err) : resolve(decoded);
        })
    })
}