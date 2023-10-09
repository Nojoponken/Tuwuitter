import express, { request, response } from 'express';
import { insert, read, readAll, isRead, findUser } from './dbAccessor.mjs';
import cors from 'cors';
import * as path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let server;

let corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
};

const app = express();

const oneDay = 86400000;

app.use(express.json());
app.use(express.static('frontend'));
app.use(cors(corsConfig));

app.use((request, response, next) => {
    console.log(`Visiting route ${request.path}`);
    next();
});

app.all('/', async (request, response) => {
    response.status(200);
    response.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.all('/login', async (request, response) => {
    if (request.method == 'POST') {
        try {
            let account = await findUser(request.name);
            let USERNAME_CORRECT = true;
            if (!account) {
                USERNAME_CORRECT = false;
            }

            let PASSWORD_CORRECT = false;
            if (request.password == account.password) {
                PASSWORD_CORRECT = true;
            }

            if (USERNAME_CORRECT && PASSWORD_CORRECT) {

            }
            else {
                response.send("Wrong password or the account does not exist (ägd)");
            }
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
        }
    }
});

app.all('/messages', async (request, response) => {
    if (request.method == 'POST') {
        if (typeof (request.body.message) != typeof ('')) {
            response.status(400).send('Body is not formated correctly ');
            return;
        }
        if (request.body.message.length > 240 || request.body.message.length == 0) {
            response.status(400).send('Incorrect format for post');
            return;
        }
        try {
            let id = await insert('Jane Doe', request.body.message);
            console
            response.status(200);
            response.send(id.toString());
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
        }
    }
    else if (request.method == 'GET') {
        try {
            let posts = await readAll();
            response.status(200).send(posts);
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
        }
    }
    else {
        response.status(405).send();
    }
});


app.all('/messages/:id', async (request, response) => {
    if (!parseInt(request.params.id)) {
        response.status(400).send('400 Invalid Parameter');
    }
    if (request.method == 'PATCH') {
        try {
            await isRead(request.params.id);
            response.status(200).send();
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
        }
    }
    else if (request.method == 'GET') {
        try {
            let post = await read(request.params.id);
            response.status(200).send(post);
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
        }
    }
    else {
        response.status(405).send('405 Invalid Method');
    }
});

app.all('*', async (request, response) => {
    response.status(404).send('404 Not Found');
});

function startServer(port) {
    server = app.listen(port, () => {
        console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
    });

    return server;
}

export { startServer }