require('dotenv').config();
const express = require('express');
let cors = require('cors')
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
let admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");
const categoriesRouter = require('./routes/categories');
const tasksRouter = require('./routes/tasks');

const app = express();
const router = express.Router();

const allowedOrigin = process.env.ALLOWED_ORIGIN_URL;

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigin === origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

router.use('/categories', categoriesRouter);
router.use('/tasks', tasksRouter);

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);