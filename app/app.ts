import express from 'express';
import bodyParser from 'body-parser';
import * as config from './config';

const app = express();
app.use(bodyParser.json());
app.use('/api', require('./routes'));

app.listen(config.port, () => {
    console.log(`Server running, listening on port ${config.port}.`);
})