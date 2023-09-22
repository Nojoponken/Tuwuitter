import express, { request } from 'express';
import { insert, read, readAll, isRead } from './dbAccsessor.js';



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

app.get("/messages/:id", async (request, response) => {
    if (request.params.id.length != 24) {
        response.status(400);
        response.send("Invalid ID");
    }
    else {
        let post = await read(request.params.id);
        response.status(200);
        response.send(post);
    }
});

app.get("/messages", async (request, response) => {
    let posts = await readAll();
    response.status(200);
    response.send(posts);
});

app.patch("/messages/:id", async (request, response) => {
    await isRead(request.params.id);
    response.status(200);
    response.send();
})


const port = 3000;
app.listen(port, () => {
    console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
});
