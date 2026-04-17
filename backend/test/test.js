import "dotenv/config";

import superagent from "superagent";
import assert from "assert";
import { startServer, closeServer } from "../server.mjs";
import bcrypt from "bcryptjs";

let server;
let agent;

let config = {
  host: process.env.MONGO_TEST_URL,
  database: "test",
};

async function handleError(request, response) {
  try {
    return await request;
  } catch (error) {
    return error;
  }
}

before((done) => {
  server = startServer(port, config);
  agent = superagent.agent();
  done();
});

//JohnDoe and JaneDoe already exicist in 'test' database
describe("Registration", () => {
  it("Register incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/signup`).send({}),
    );
    assert.equal(response.status, 405);
  });

  it("Register taken username", async () => {
    let hashedPassword = bcrypt.hashSync("123", bcrypt.genSaltSync());
    await handleError(
      agent
        .post(`localhost:${port}/signup`)
        .send({ username: "JohnDoe", password: hashedPassword }),
    );

    hashedPassword = bcrypt.hashSync("123", bcrypt.genSaltSync());
    await handleError(
      agent
        .post(`localhost:${port}/signup`)
        .send({ username: "JaneDoe", password: hashedPassword }),
    );

    let response = await handleError(
      agent
        .post(`localhost:${port}/signup`)
        .send({ username: "JohnDoe", password: hashedPassword }),
    );
    assert.equal(response.status, 400);
  });
});

//Authentication and friending testing logout and accept friend request from JaneDoe
describe("Authentication", () => {
  it("Log in incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/login`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Log in incorrect credentials username", async () => {
    let username = "JohnDDDoe";
    let password = "123";
    let response = await handleError(
      agent
        .post(`localhost:${port}/login`)
        .send({ username: username, password: password }),
    );
    assert.equal(response.status, 401);
  });

  it("Log in incorrect credentials password", async () => {
    let username = "JohnDoe";
    let password = "1234";
    let response = await handleError(
      agent
        .post(`localhost:${port}/login`)
        .send({ username: username, password: password }),
    );
    assert.equal(response.status, 401);
  });

  it("Log in to website", async () => {
    let username = "JohnDoe";
    let password = "123";
    let response = await handleError(
      agent
        .post(`localhost:${port}/login`)
        .send({ username: username, password: password }),
    );
    assert.equal(response.status, 200);
  });
});

describe("Friend request", () => {
  it("Make friend request incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/request`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 405);
  });

  it("Make friend request unauthorized", async () => {
    let response = await handleError(
      superagent.post(`localhost:${port}/request`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 401);
  });

  it("Make friend request", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 200);
  });

  it("Make friend request twice", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 500);
  });

  it("Log out incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/logout`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Log out", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/logout`).send(),
    );
    assert.equal(response.status, 200);
  });

  it("Accept friend request", async () => {
    let username = "JaneDoe";
    let password = "123";
    await handleError(
      agent
        .post(`localhost:${port}/login`)
        .send({ username: username, password: password }),
    );

    let response = await handleError(
      agent
        .post(`localhost:${port}/request/accept`)
        .send({ target: "JohnDoe" }),
    );

    assert.equal(response.status, 200);
  });

  it("Accept friend request incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/request/accept`).send(),
    );

    assert.equal(response.status, 405);
  });

  it("Accept friend request unauthorized", async () => {
    let response = await handleError(
      superagent
        .post(`localhost:${port}/request/accept`)
        .send({ target: "JohnDoe" }),
    );

    assert.equal(response.status, 401);
  });

  it("Make friend request when already friends", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 500);
  });
});

describe("Check sessions", () => {
  it("Check session", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/session`).send(),
    );
    assert.equal(response.status, 200);
  });

  it("Check session incorrect method", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/session`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Check session unauthorized", async () => {
    let response = await handleError(
      superagent.get(`localhost:${port}/session`).send(),
    );
    assert.equal(response.status, 401);
  });
});

describe("Posting on friend page", () => {
  it("Make a new post", async () => {
    let response = await handleError(
      agent
        .post(`localhost:${port}/posts`)
        .send({ message: "I am making a post", profile: "JohnDoe" }),
    );

    assert.equal(response.status, 200);
  });

  it("Make a new post unauthorized", async () => {
    let response = await handleError(
      superagent
        .post(`localhost:${port}/posts`)
        .send({ message: "I am making a post", profile: "JohnDoe" }),
    );

    assert.equal(response.status, 401);
  });

  it("Make a new post incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/posts`).send(),
    );

    assert.equal(response.status, 405);
  });

  it("Make too long post", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/posts`).send({
        message:
          "i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls i live in your walls",
        profile: "JaneDoe",
      }),
    );
    assert.equal(response.status, 400);
  });
});

describe("Unfriend", () => {
  it("Remove friend incorrect method", async () => {
    let response = await handleError(
      agent
        .get(`localhost:${port}/request/unfriend`)
        .send({ target: "JohnDoe" }),
    );
    assert.equal(response.status, 405);
  });

  it("Remove friend unauthorized", async () => {
    let response = await handleError(
      superagent
        .post(`localhost:${port}/request/unfriend`)
        .send({ target: "JohnDoe" }),
    );
    assert.equal(response.status, 401);
  });

  it("Remove friend", async () => {
    let response = await handleError(
      agent
        .post(`localhost:${port}/request/unfriend`)
        .send({ target: "JohnDoe" }),
    );
    assert.equal(response.status, 200);
  });

  it("Remove friend twice", async () => {
    let response = await handleError(
      agent
        .post(`localhost:${port}/request/unfriend`)
        .send({ target: "JohnDoe" }),
    );
    assert.equal(response.status, 500);
  });

  it("Make post after unfriend", async () => {
    let response = await handleError(
      agent
        .post(`localhost:${port}/posts`)
        .send({ message: "I am totally making a post", profile: "JohnDoe" }),
    );
    assert.equal(response.status, 401);
  });
});

describe("Find users", () => {
  it("Search for users incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/users`).send({ search: "Doe" }),
    );
    assert.equal(response.status, 405);
  });

  it("Search for users", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/users`).send({ search: "Doe" }),
    );
    assert.equal(response.status, 200);
  });

  it("Search for users friends", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/friend/JaneDoe`).send(),
    );
    assert.equal(response.status, 200);
  });

  it("Search for users friends incorrect method", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/friend/JaneDoe`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Search for users friends not found", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/friend/JaneDDDoe`).send(),
    );
    assert.equal(response.status, 404);
  });
});

describe("Denying friend request", () => {
  it("Make friend request to deny", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request`).send({ target: "JohnDoe" }),
    );
    assert.equal(response.status, 200);
  });

  it("Log out from Jane Doe", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/logout`).send(),
    );
  });

  it("Deny friend request unauthorized", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request/deny`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 401);
  });

  it("Log in to website with John Doe to deny request", async () => {
    let username = "JohnDoe";
    let password = "123";
    let response = await handleError(
      agent
        .post(`localhost:${port}/login`)
        .send({ username: username, password: password }),
    );
    assert.equal(response.status, 200);
  });

  it("Deny friend request incorrect method", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/request/deny`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Deny friend request unauthorized", async () => {
    let response = await handleError(
      superagent
        .post(`localhost:${port}/request/deny`)
        .send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 401);
  });

  it("Deny friend request", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/request/deny`).send({ target: "JaneDoe" }),
    );
    assert.equal(response.status, 200);
  });
});

describe("Getting posts and marking posts read ", () => {
  it("Getting post", async () => {
    let response = await handleError(
      agent.get(`localhost:${port}/posts/JohnDoe`).send(),
    );
    assert.equal(response.status, 200);
  });

  it("Getting post wrong method", async () => {
    let response = await handleError(
      agent.post(`localhost:${port}/posts/JohnDoe`).send(),
    );
    assert.equal(response.status, 405);
  });

  it("Mark post read", async () => {
    //get posts
    let posts = await handleError(
      agent.get(`localhost:${port}/posts/JohnDoe`).send(),
    );
    //get first post id
    let id = posts.body[0].id;
    //mark read
    let response = await handleError(
      agent.patch(`localhost:${port}/read/${id}`).send(),
    );
    assert.equal(response.status, 200);
  });

  it("Mark post read invalid parameter", async () => {
    let response = await handleError(
      agent.patch(`localhost:${port}/read/abc`).send(),
    );
    assert.equal(response.status, 400);
  });

  it("Make post read incorrect method", async () => {
    //get posts
    let posts = await handleError(
      agent.get(`localhost:${port}/posts/JohnDoe`).send(),
    );
    //get first post id
    let id = posts.body[0].id;
    let response = await handleError(
      agent.post(`localhost:${port}/read/${id}`).send(),
    );
    assert.equal(response.status, 405);
  });
});

describe("Not Found", () => {
  it("404", async () => {
    let response = await handleError(
      superagent.get(`localhost:${port}/notapage`).send(),
    );
    assert.equal(response.status, 404);
  });
});

after((done) => {
  closeServer();
  server.close(() => done());
});
