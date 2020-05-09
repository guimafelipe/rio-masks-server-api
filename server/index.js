const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const {PORT} = process.env;

//Middleware

app.use(bodyParser.json());
app.use(cors());

const posts = require('./api/api');

app.use('/api', posts);

// Handle production
if(process.env.NODE_ENV === 'production'){
    // Static folder
    app.use(express.static(__dirname + '/public'));
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
}

const port = PORT || 5000;

app.listen(port, () => console.log(`Server start on port ${port}`));
