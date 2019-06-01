import * as Knex from 'knex';

export const secret = 'donttellyourfriends';
export const port = 5000;


export const knexConfig: Knex.Config = {
    client: 'mysql',
    connection: {
        user: 'root',
        password: 'password',
        database: 'example_node_database'
    }
}
  