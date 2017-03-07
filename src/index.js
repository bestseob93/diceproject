import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';

import mongoose from 'mongoose';

import api from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 1000000 }));

console.log(path.join(__dirname, '../public/'));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api/v1', api);

/* handle error */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: {
            message: 'Something Broke!',
            code: 0
        }
    });
    next();
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongod server');
});


// ENABLE DEBUG WHEN DEV ENVIRONMENT
if(process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    app.use(morgan('tiny')); // server logger
}


mongoose.connect(process.env.DB_URL);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
