import express, { request, response } from 'express';
import session from 'express-session';
import { insert, read, readAll, readProfile, isRead, createUser, findUser, getUsers, friendRequest } from './dbAccessor.mjs';
import cors from 'cors';
import bcrypt from 'bcryptjs-react';
import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let server;
let corsConfig = {
    origin: ['http://10.241.34.15:5173', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8000'],
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
    next();
});

app.all('/', async (request, response) => {
    if (request.session.user) {
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
    let user = await findUser(request.session.user);
    if (!user) {
        response.status(401).send();
        return;
    }
    
    delete user['password'];
    delete user['_id'];

    response.status(200);
    response.send(user);
});

app.all('/signup', async (request, response) => {
    if (request.method == 'POST') {
        let username = request.body.username.trim();

        if (await findUser(username)) {
            response.status(400);
            response.send('Username taken');
            return;
        }

        if (username.length != 0 && username.length <= 16 || username == 'aleksandrauskaite') {
            try {
                await createUser(username, request.body.password);
            }
            catch (error) {
                console.log(error);
                response.status(500).send('Database on fire');
                return;
            }
            response.status(200);
            response.send();
        }
        else {
            response.status(400);
            response.send('Username cannot be 0 or more than 16 characters');
        }
    }
    else {
        response.status(405);
        response.send();
    }
});

app.all('/login', async (request, response) => {
    if (request.method == 'POST') {
        let account;
        try {
            account = await findUser(request.body.username.trim());
        }
        catch (error) {
            console.log(error);
            response.status(500).send('Database on fire');
            return;
        }

        if (!account) {
            response.status(400);
            response.send();
            return;
        }


        let PASSWORD_CORRECT = bcrypt.compareSync(request.body.password, account.password);

        if (PASSWORD_CORRECT) {
            request.session.user = account.username;
            response.status(200);
            response.send();
        }
        else {
            response.status(401);
            response.send('Wrong password or the account does not exist (ägd)');
        }
    }
});

app.all('/logout', async (request, response) => {
    if (request.method == 'POST') {
        request.session.destroy();
        response.status(200);
        response.send();
    }
});

app.all('/users', async (request, response) => {
    if (request.method == 'POST') {
        let users = await getUsers(request.body.search);
        response.status(200).send(users);
    }
});

app.all('/friend', async (request, response) => {
    if (request.method == 'POST') {
        friendRequest(request.session.user, request.body.target);
        response.status(200).send();
    }
});

app.all('/friend/:user', async (request, response) => {
    if (request.method == 'GET') {
        // GET all da friends
        let user = await findUser(request.params.user);

        response.status(200).send(user.friends);
    }
});

app.all('/messages', async (request, response) => {
    if (request.method == 'POST') {
        if (!request.session.user) {
            response.status(401).send();
            return;
        }
        let contentToPost = request.body.message.trim();
        if (typeof (contentToPost) != typeof ('') || contentToPost.length > 140 || contentToPost.length == 0) {
            response.status(400).send('Incorrect format for post');
            return;
        }
        try {
            let id = await insert(request.session.user, contentToPost, request.body.profile);
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

app.all('/messages/:profile', async (request, response) => {
    if (request.method == 'GET') {
        let posts = await readProfile(request.params.profile);
        response.status(200).send(posts);
    }
});

app.all('/read/:id', async (request, response) => {
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