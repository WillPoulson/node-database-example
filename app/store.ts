import Knex from 'knex';
import { knexConfig } from './config';
const knex: Knex = Knex(knexConfig);

import { saltHashPassword, comparePassword } from './encryption';

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
    const [user] = await knex('user').where({username: details.username});
    if (!user) {
        throw (new Error('User not found'));
    }
    const passwordMatches = await comparePassword(details.password, user.encrypted_password);
    return passwordMatches ? new Error('Incorrect password') : true;
}