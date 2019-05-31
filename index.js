const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use('/api', require('./routes'));

const serverPort = 5000;

app.listen(serverPort, () => {
    console.log(`Server running, listening on port ${serverPort}.`);
})