import express, { request } from 'express';
import { insert, read, readAll, isRead, startDatabaseAccess} from './dbAccessor.js';



const app = express();
app.use(express.json());


app.use((request, response, next) => {
    console.log(`Visiting route ${request.path}`);
    next();
});

app.all("/messages", async (request, response) => {
    if (request.method == "POST") {
        if (request.body.message.length > 240 || request.body.message.length == 0){
            response.status(500).send("Incorrect format for post");
        }
        console.log(`this is the request => ${request.body.message.length}`);
        insert("John Doe", request.body.message);

        response.status(200).send();
    }
    else if (request.method == "GET") {
        let posts = await readAll();

        response.status(200).send(posts);
    }
    else {
        response.status(405).send();
    }
});


app.all("/messages/:id", async (request, response) => {
    if(request.params.id.length != 24){
        response.status(400).send("400 Invalid Parameter");
    }
    else if (request.method == "PATCH") {
        await isRead(request.params.id);
        response.status(200).send();
    }
    else if (request.method == "GET") {
        let post = await read(request.params.id);
        response.status(200).send(post);
    }
    else {
        response.status(405).send("405 Invalid Method");
    }
});

app.all("*", async (request, response) => {
    response.status(404).send("404 Not Found");
});
// app.get('/', (req, res, next) => {
//     let err = new Error('Not found');
//     err.status = 404;
//     return next(err);
// });

function run(port, done){
    // const port = 3000;
    return app.listen(port, () => {
        console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
        done && done();
    });
}

export { run }