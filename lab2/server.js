import express, { request } from 'express';
import { insert, read, readAll, isRead } from './dbAccessor.js';


let server;
const app = express();
app.use(express.json());


app.use((request, response, next) => {
    console.log(`Visiting route ${request.path}`);
    next();
});

app.all("/messages", async (request, response) => {
    if (request.method == "POST") {
        console.log(typeof (request.body.message));
        console.log(request.body);
        if (typeof(request.body.message) != typeof("")){
            response.status(400).send("Body is not formated correctly ");
            return;
        }
        if (request.body.message.length > 240 || request.body.message.length == 0) {
            response.status(400).send("Incorrect format for post");
        }
        try {
            insert("John Doe", request.body.message);
            response.status(200).send();
        }
        catch (error) {
            console.log(error);
            response.status(500).send("Database on fire");
        }
    }
    else if (request.method == "GET") {
        try {
            let posts = await readAll();
            response.status(200).send(posts);
        }
        catch (error) {
            console.log(error);
            response.status(500).send("Database on fire");
        }
    }
    else {
        response.status(405).send();
    }
});


app.all("/messages/:id", async (request, response) => {
    if (request.params.id.length != 24) {
        response.status(400).send("400 Invalid Parameter");
    }
    else if (request.method == "PATCH") {
        try {
            await isRead(request.params.id);
            response.status(200).send();
        }
        catch (error) {
            console.log(error);
            response.status(500).send("Database on fire");
        }
    }
    else if (request.method == "GET") {
        try {
            let post = await read(request.params.id);
            response.status(200).send(post);
        }
        catch (error) {
            console.log(error);
            response.status(500).send("Database on fire");
        }
    }
    else {
        response.status(405).send("405 Invalid Method");
    }
});

app.all("*", async (request, response) => {
    response.status(404).send("404 Not Found");
});

function startServer(port) {
    server = app.listen(port, () => {
        console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
    });

    return server;
}

export { startServer }