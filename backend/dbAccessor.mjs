import { ObjectId } from "mongodb";

import {
  connectToDatabase,
  closeDatabaseConnection,
  getDatabaseConnection,
} from "./mongoUtils.mjs";

let database;

async function run(config) {
  connectToDatabase(config, () => {
    console.log("Connected!");
    database = getDatabaseConnection();
  });
}

async function stop() {
  closeDatabaseConnection();
}

async function insertPost(author, text, profile) {

  let doc = {
    name: author,
    content: text,
    profile: profile,
    date: new Date().toString().slice(0, 24),
    read: false,
  };
  await database.collection("posts").insertOne(doc);
  return doc._id;
}

async function isRead(idString) {
  let oid = new ObjectId(idString);
  let doc = await database.collection("posts").findOne({ _id: oid });
  doc.read = !doc.read;
  await database.collection("posts").replaceOne({ _id: oid }, doc);
}

async function findProfile(profile) {
  let doc = await database
    .collection("posts")
    .find({ profile: profile })
    .toArray();
  return doc;
}

async function createUser(username, password) {
  let doc = {
    username: username,
    password: password,
    friends: [],
    incoming: [],
    outgoing: [],
  };
  await database.collection("users").insertOne(doc);
}

async function findOneUser(username) {
  let doc = await database.collection("users").findOne({ username: username });
  return doc;
}

async function findUsers(search) {
  let doc = await database
    .collection("users")
    .find({ username: { $regex: new RegExp(search, "i") } })
    .toArray();
  return doc;
}

async function friendRequest(userSending, userReceiving) {
  let SAME = userSending == userReceiving;
  let ALREADY_FRIENDS = await hasFriend(userSending, userReceiving);

  if (SAME || ALREADY_FRIENDS) {
    return false;
  }

  let docSending = await findOneUser(userSending);
  let docReceiving = await findOneUser(userReceiving);

  if (docSending.outgoing.includes(userReceiving)) {
    return false;
  }

  docReceiving.incoming.push(userSending);
  docSending.outgoing.push(userReceiving);

  await database
    .collection("users")
    .replaceOne({ username: userSending }, docSending);
  await database
    .collection("users")
    .replaceOne({ username: userReceiving }, docReceiving);

  return true;
}

async function acceptFriendRequest(userSending, userReceiving) {
  let docSending = await findOneUser(userSending);
  let docReceiving = await findOneUser(userReceiving);

  if (docSending.incoming.includes(userReceiving)) {
    // Remove all possible friend requests
    docReceiving.outgoing.pop(docReceiving.outgoing.indexOf(userSending));
    docSending.outgoing.pop(docReceiving.outgoing.indexOf(userReceiving));
    docReceiving.incoming.pop(docSending.incoming.indexOf(userSending));
    docSending.incoming.pop(docSending.incoming.indexOf(userReceiving));

    docReceiving.friends.push(userSending);
    docSending.friends.push(userReceiving);
  }

  await database
    .collection("users")
    .replaceOne({ username: userSending }, docSending);
  await database
    .collection("users")
    .replaceOne({ username: userReceiving }, docReceiving);
}

async function denyFriendRequest(userSending, userReceiving) {
  let docSending = await findOneUser(userSending);
  let docReceiving = await findOneUser(userReceiving);

  docReceiving.outgoing.pop(docReceiving.outgoing.indexOf(userSending));
  docSending.outgoing.pop(docSending.outgoing.indexOf(userReceiving));
  docReceiving.incoming.pop(docReceiving.incoming.indexOf(userSending));
  docSending.incoming.pop(docSending.incoming.indexOf(userReceiving));

  await database
    .collection("users")
    .replaceOne({ username: userSending }, docSending);
  await database
    .collection("users")
    .replaceOne({ username: userReceiving }, docReceiving);
}

async function unfriend(userSending, userReceiving) {
  let docSending = await findOneUser(userSending);
  let docReceiving = await findOneUser(userReceiving);

  if (!docSending.friends.includes(userReceiving)) {
    return false;
  }

  docReceiving.friends.pop(docReceiving.friends.indexOf(userSending));
  docSending.friends.pop(docSending.friends.indexOf(userReceiving));

  await database
    .collection("users")
    .replaceOne({ username: userSending }, docSending);
  await database
    .collection("users")
    .replaceOne({ username: userReceiving }, docReceiving);

  return true;
}

async function hasFriend(user, friend) {
  let userJSON = await findOneUser(user);

  return userJSON.friends.includes(friend);
}

export {
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
};
