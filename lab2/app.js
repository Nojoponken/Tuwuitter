import express from 'express';
import {insert, read, readAll } from './dbAccsessor.js';



const app = express();
app.use(express.json());



app.use((request, response, next) => {
    console.log(`Visiting route ${request.path}`);
    next();
});

app.post("/messages", (request, response) => {
    console.log(`this is the request => ${request.body.message}`);
    insert("John Doe", request.body.message);
    response.status(200);
    response.send();
});

app.get("/messages", (request, response) => {
    //console.log(`this is the request => ${request.headers.location}`);
    let posts = readAll();
    response.status(200);
    response.send(posts);
});

const port = 3000;
app.listen(port, () => {
    console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
});
