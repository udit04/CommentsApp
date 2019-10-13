
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const login_routes = require('../server/controllers/login')
const comment_routes = require('../server/controllers/comment')

const API_PORT = 3001;
const app = express();
app.use(cors());

const dbRoute = 'mongodb://udit:udit1234@ds333248.mlab.com:33248/comment_udit';

mongoose.connect(dbRoute, { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api',login_routes)
app.use('/api', comment_routes);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));