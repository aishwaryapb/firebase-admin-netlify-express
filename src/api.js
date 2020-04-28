require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const serviceAccount = require("../serviceAccountKey.json");
let admin = require("firebase-admin");

const app = express();
const router = express.Router();

const categoriesRouter = require('./routes/categories');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

router.use('/categories', categoriesRouter);

app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);