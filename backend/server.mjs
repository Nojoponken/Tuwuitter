import express, { request, response } from "express";
import session from "express-session";
import {
  run,
  stop,
  insertPost,
  findProfile,
  isRead,
  createUser,
  findOneUser,
  findUsers,
  friendRequest,
  denyFriendRequest,
  acceptFriendRequest,
  unfriend,
  hasFriend,
} from "./dbAccessor.mjs";
import cors from "cors";
import bcrypt from "bcryptjs-react";
import * as path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

let server;
let corsConfig = {
  origin: [
    "http://10.241.34.97:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
};

const app = express();
const oneDay = 86400000;

app.use(express.json());
app.use(express.static("frontend"));
app.use(cors(corsConfig));

app.use(
  session({
    secret: "s3cret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // using HTTP (not HTTPS)
      maxAge: oneDay, // expire after one day
    },
  }),
);

app.use((request, response, next) => {
  next();
});

app.all("/session", async (request, response) => {
  if (request.method == "GET") {
    let user = await findOneUser(request.session.user);
    if (!user) {
      response.status(401).send();
      return;
    }

    delete user["password"];
    delete user["_id"];

    response.status(200).send(user);
  } else {
    response.status(405).send();
  }
});

app.all("/signup", async (request, response) => {
  if (request.method == "POST") {
    let username = request.body.username.trim();

    if (await findOneUser(username)) {
      response.status(400);
      response.send("Username taken");
      return;
    }

    if (
      (username.length != 0 && username.length <= 16) ||
      username == "aleksandrauskaite"
    ) {
      try {
        await createUser(username, request.body.password);
      } catch (error) {
        console.log(error);
        response.status(500).send("Database on fire");
        return;
      }
      response.status(200);
      response.send();
    } else {
      response.status(400);
      response.send("Username cannot be 0 or more than 16 characters");
    }
  } else {
    response.status(405).send();
  }
});

app.all("/login", async (request, response) => {
  if (request.method == "POST") {
    let account;
    try {
      account = await findOneUser(request.body.username.trim());
    } catch (error) {
      console.log(error);
      response.status(500).send("Database on fire");
      return;
    }

    if (!account) {
      response.status(401);
      response.send();
      return;
    }

    let PASSWORD_CORRECT = bcrypt.compareSync(
      request.body.password,
      account.password,
    );

    if (PASSWORD_CORRECT) {
      request.session.user = account.username;
      response.status(200);
      response.send();
    } else {
      response.status(401);
      response.send("Wrong password or the account does not exist (ägd)");
    }
  } else {
    response.status(405).send();
  }
});

app.all("/logout", async (request, response) => {
  if (request.method == "POST") {
    request.session.destroy();
    response.status(200);
    response.send();
  } else {
    response.status(405).send();
  }
});

app.all("/users", async (request, response) => {
  if (request.method == "POST") {
    let users = await findUsers(request.body.search);
    response.status(200).send(users);
  } else {
    response.status(405).send();
  }
});

app.all("/request", async (request, response) => {
  if (request.method == "POST") {
    if (!request.session.user) {
      response.status(401).send();
      return;
    }

    let result = await friendRequest(request.session.user, request.body.target);

    if (!result) {
      response.status(500).send();
    }

    response.status(200).send();
  } else {
    response.status(405).send();
  }
});

app.all("/request/accept", async (request, response) => {
  if (request.method == "POST") {
    if (!request.session.user) {
      response.status(401).send();
      return;
    }
    await acceptFriendRequest(request.session.user, request.body.target);
    response.status(200).send();
  } else {
    response.status(405).send();
  }
});

app.all("/request/deny", async (request, response) => {
  if (request.method == "POST") {
    if (!request.session.user) {
      response.status(401).send();
      return;
    }
    await denyFriendRequest(request.session.user, request.body.target);
    response.status(200).send();
  } else {
    response.status(405).send();
  }
});

app.all("/friend/:user", async (request, response) => {
  if (request.method == "GET") {
    // GET all da friends
    let user = await findOneUser(request.params.user);
    if (!user) {
      response.status(404).send();
      return;
    }
    response.status(200).send(user.friends);
  } else {
    response.status(405).send();
  }
});

app.all("/request/unfriend", async (request, response) => {
  if (request.method == "POST") {
    if (!request.session.user) {
      response.status(401).send();
      return;
    }
    let success = await unfriend(request.session.user, request.body.target);
    if (success) {
      response.status(200).send();
    } else {
      response.status(500).send();
    }
  } else {
    response.status(405).send();
  }
});

// For making posts
app.all("/posts", async (request, response) => {
  if (request.method == "POST") {
    // Declare variables for relevant information
    let author = request.session.user;
    let profile = request.body.profile;
    let content = request.body.message.trim();

    //* Checks for if the request is valid

    // Is the user authorized to make the post
    let LOGGED_IN = author != null;
    let IS_FRIENDS = await hasFriend(profile, author);

    // Everyone can post on their own profile
    if (author == profile) {
      IS_FRIENDS = true;
    }

    if (!LOGGED_IN || !IS_FRIENDS) {
      response.status(401).send();
      return;
    }

    // Content is valid for a post
    let CORRECT_TYPE = typeof content === "string";
    let CORRECT_LENGTH = content.length <= 140 && content.length != 0;

    if (!CORRECT_TYPE || !CORRECT_LENGTH) {
      response.status(400).send("Incorrect format for post");
      return;
    }

    try {
      let id = await insertPost(author, content, profile);
      response.status(200).send(id.toString());
    } catch (error) {
      console.log(error);
      response.status(500).send("Database on fire");
    }
  } else {
    response.status(405).send();
  }
});

// For getting posts
app.all("/posts/:profile", async (request, response) => {
  if (request.method == "GET") {
    let posts = await findProfile(request.params.profile);
    response.status(200).send(posts);
  } else {
    response.status(405).send();
  }
});

app.all("/read/:id", async (request, response) => {
  if (request.method == "PATCH") {
    // Declare variables
    let id = parseInt(request.params.id);

    // Check for valid id
    if (!id) {
      response.status(400).send("400 Invalid Parameter");
      return;
    }

    try {
      await isRead(request.params.id);
      response.status(200).send();
    } catch (error) {
      console.log(error);
      response.status(500).send("Database on fire");
    }
  } else {
    response.status(405).send("405 Invalid Method");
  }
});
app.all("*", async (request, response) => {
  response.status(404).send("404 Not Found");
});

function startServer(port, config) {
  server = app.listen(port, () => {
    console.log(`APP IS RUNNING, VISIT http://localhost:${port}`);
  });

  run(config);

  return server;
}

function closeServer() {
  stop();
}

export { startServer, closeServer };
