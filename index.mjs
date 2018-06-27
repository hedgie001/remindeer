import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import {orderRoutes} from './routes/orderRoutes';

const app = express();

const router = express.Router();

app.use(express.static(path.resolve('public')));

app.use(bodyParser.json());

app.get("/", function(req, res){
    res.sendFile("/index.html",  {root: __dirname + '/public/'});
});
app.use("/", orderRoutes);

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});