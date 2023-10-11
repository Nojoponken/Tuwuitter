import express, { request, response } from 'express';
import session from 'express-session';
import cookieSession from 'cookie-session';
import Keygrip from 'keygrip';
import { insert, read, readAll, isRead, findUser } from './dbAccessor.mjs';
import cors from 'cors';
import * as path from 'path';
import * as url from 'url';

// const __filename = url.fileURLToPath(import.meta.url);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let server;
let corsConfig = {
    origin: ['http://10.241.32.75:5173', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
};

const app = express();
const oneDay = 86400000;

let userSession;

app.use(express.json());
app.use(express.static('frontend'));
app.use(cors(corsConfig));

// app.use(cookieSession({
//     // secret: 's3cret',
//     // resave: false,
//     // saveUninitialized: true,
//     name: 'session',
//     keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),
//     maxAge: oneDay
// }))

app.use(session({
    secret: 's3cret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // using HTTP (not HTTPS)
        maxAge: oneDay, // expire after one day
    }
}));

app.use((request, response, next) => {
    // console.log(`Visiting route ${request.path}`);
    next();
});

app.all('/', async (request, response) => {
    if (request.session.user) {
        console.log(request.session.user);
        console.log('session found');
        response.status(200);
        response.sendFile(path.join(__dirname, 'frontend/index.html'));
    }
    else {
        response.status(401);
        response.send();
    }
});

app.all('/session', async (request, response) => {
    console.log(request.session.user);
    if (request.session.user) {
        response.status(200);
        response.send({username: request.session.user});
    }   
    else {
        response.redirect(401, '/login');
    }
});

app.all('/login', async (request, response) => {
    if (request.method == 'POST') {
        let account;
        try {
            account = await findUser(request.body.username);
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
            return;
        }


        let USERNAME_CORRECT = true;
        let PASSWORD_CORRECT = true;
        if (!account) {
            USERNAME_CORRECT = false;
        }
        else if (request.body.password != account.password) {
            PASSWORD_CORRECT = false;
        }

        if (USERNAME_CORRECT && PASSWORD_CORRECT) {
            request.session.user = account.username;

            response.status(200);
            response.send();


            // //create token
            // //return token under a token key
            // response.json({ token });

        }
        else {
            response.status(401);
            response.send("Wrong password or the account does not exist (ägd)");
        }
    }
});

app.all('/messages', async (request, response) => {
    if (request.method == 'POST') {
        let contentToPost = request.body.message.trim();
        if (typeof (contentToPost) != typeof ('')) {
            response.status(400).send('Body is not formated correctly ');
            return;
        }
        if (contentToPost.length > 140 || contentToPost.length == 0) {
            response.status(400).send('Incorrect format for post');
            return;
        }
        try {
            let id = await insert(request.body.user, contentToPost);
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