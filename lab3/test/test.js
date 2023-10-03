import superagent from "superagent";
import assert from "assert";
import { startServer } from "../server.js";
import { closeDatabaseConnection, connectToDatabase } from "../mongoUtils.js";


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
    server = startServer(port);
    done();
});

describe("HTTP-call test", () => {

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

        let id = responseGet.body[0]["id"];

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

        let id = responseGet.body[0]["id"];

        let responseGetOne = await handleError(superagent
            .get(`localhost:${port}/messages/${id}`));
        assert.equal(responseGetOne.status, 200);
    });
});

describe("Error code test", () => {
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

        let id = responseGet.body[0]["id"];

        let response = await handleError(superagent
            .post(`localhost:${port}/messages/${id}`));
        assert.equal(response.status, 405);
    });

    it("Use wrong parameter", async () => {
        let response = await handleError(superagent
            .get(`localhost:${port}/messages/abc`));
        assert.equal(response.status, 400);
    });
    it("Make too long post", async () => {
        let response = await handleError(superagent
            .post(`localhost:${port}/messages`)
            .send({ message: "i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls" }));
        assert.equal(response.status, 400);
    });
});

describe("Open database twice", () => {
    it("no crash when database connect twice", () => {
        connectToDatabase(); // c8 cringe
    })
});


after((done) => {
    closeDatabaseConnection();
    server.close(() => done());
});
