import superagent from "superagent";
import assert from "assert";
import { run } from "../app.js";
import { connectToDatabase , closeDatabaseConnection} from "../mongoUtils.js";
import { read } from "fs";


let server;
let port = 3333;
let api = `http://localhost:${port}`;

async function handleError(request, response) {
    try {
        return await request;
    } catch (error) {
        return error;
    }
}


before((done) => {
    server = run(port, done);

    let config = {
        "port": port,
        "host": "localhost:27017",
        "db":"uwu"
    }

    connectToDatabase(config, done);
});

describe("HTTP-anrop test", () => {

    //start server

    it("Make a new post", async () => {
        let response = await handleError(superagent
            .post(`localhost:${port}/messages`)
            .send({ message: "I am making a post" }));
        assert.equal(response.status, 200);
    });

    it("Get all posts", async () => {
        let response = await handleError(superagent
            .get(`localhost:${port}/messages`));
        assert.equal(response.status, 200);
    });

    it("Mark a post read/unread", async () => {
        let responsePost = await handleError(superagent
            .post(`localhost:${port}/messages`)
            .send({ message: "Making sure there is at least one post to mark" }));
        assert.equal(responsePost.status, 200);

        let responseGet = await handleError(superagent
            .get(`localhost:${port}/messages`));
        assert.equal(responseGet.status, 200);

        let id = responseGet.body[0]["_id"];

        let responsePatch = await handleError(superagent
            .patch(`localhost:${port}/messages/${id}`));
        assert.equal(responsePatch.status, 200);
    });

    it("Get single post", async () => {
        let responsePost = await handleError(superagent
            .post(`localhost:${port}/messages`)
            .send({ message: "Making sure there is at least one post to read" }));
        assert.equal(responsePost.status, 200);

        let responseGet = await handleError(superagent
            .get(`localhost:${port}/messages`));
        assert.equal(responseGet.status, 200);

        let id = responseGet.body[0]["_id"];

        let responseGetOne = await handleError(superagent
            .get(`localhost:${port}/messages/${id}`));
        assert.equal(responseGetOne.status, 200);
    });
});

describe("Fel anrop test", () => {
    it("Call nonexisting site", async () => {
        let response = await handleError(superagent
            .get(`localhost:${port}/cool`));
        assert.equal(response.status, 404);
    });
    it("Call wrong method", async () => {
        let response = await handleError(superagent
            .patch(`localhost:${port}/messages`));
        assert.equal(response.status, 405);
    });
    
    it("Call wrong method id", async () => {
        let responseGet = await handleError(superagent
            .get(`localhost:${port}/messages`));
        assert.equal(responseGet.status, 200);

        let id = responseGet.body[0]["_id"];

        let response = await handleError(superagent
            .post(`localhost:${port}/messages/${id}`));
        assert.equal(response.status, 405);
    });

    it("Use wrong parameter", async () => {
        let response = await handleError(superagent
            .get(`localhost:${port}/messages/123`));
        assert.equal(response.status, 400);
    });
    it("Make too long anrop post", async () => {
        let response = await handleError(superagent
            .post(`localhost:${port}/messages`)
            .send({ message: "i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls" }));
        assert.equal(response.status, 500);
    });

});

after((done) => {
    closeDatabaseConnection();
    server.close(() => done());
});
