import { saltHashPassword, comparePassword } from './encryption';
import { generateToken } from './tokens';

import Knex from 'knex';
import { knexConfig } from './config';
const knex: Knex = Knex(knexConfig);


export interface authDetails {
    username: string;
    password: string;
}

export async function createUser (details: authDetails) {
    console.log(`Creating user ${details.username}.`);
    const {hash, salt} = await saltHashPassword(details.password);
    return knex('user').insert({
        salt,
        encrypted_password: hash,
        username: details.username
    })
}

export async function authenticate (details: authDetails) {
    console.log(`Authenticating ${details.username}.`);

    try {
        const user = await getUser(details.username);
        const passwordMatches = await comparePassword(details.password, user.encrypted_password);

        if(!passwordMatches) {
            const incorrectError = new Error('Incorrect password');
            incorrectError.name = 'incorrect-password';
            throw incorrectError;
        }    
    } catch(error) {
        throw error;
    }
    
    return generateToken(details.username);
}

export async function getUser(username: string) {
    const [user] = await knex('user').where({username: username});
    
    if (!user) {
        const notFoundError = new Error('User not found');
        notFoundError.name = 'user-not-found';
        throw notFoundError;
    }

    return user;
}
