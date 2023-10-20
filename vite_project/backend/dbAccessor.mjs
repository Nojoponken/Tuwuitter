import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from './mongoUtils.mjs';


let config = {
    host: 'localhost:27017',
    database: 'uwu'
}

let database;

connectToDatabase(config, () => {
    console.log('Connected!');
    database = getDatabaseConnection();
});

async function nextId() {
    // Get document containing an id from database
    let idJSON = await database
        .collection('id')
        .findOne();

    // Save the id to return from the function
    let id = idJSON.current;

    // Iterate the id by 1 and replace it in the database
    idJSON.current += 1;
    database.collection('id').replaceOne({}, idJSON);

    return id;
}

async function insertPost(author, text, profile) {
    let doc = {
        'id': await nextId(),
        'name': author,
        'content': text,
        'profile': profile,
        'date': new Date().toString().slice(0, 24),
        'read': false
    }
    await database.collection('posts').insertOne(doc);
    return doc.id;
}

async function isRead(id) {
    let doc = await findPost(parseInt(id));
    doc.read = !(doc.read);
    await database.collection('posts').replaceOne({ 'id': parseInt(id) }, doc);
}

async function findPost(id) {
    // 'findOne' returns an object but we have to wait
    let doc = await database
        .collection('posts')
        .findOne({ 'id': parseInt(id) });
    return doc;
}

async function allPosts() {
    let doc = await database
        .collection('posts')
        .find()
        .toArray();
    return doc;
}

async function findProfile(profile) {
    let doc = await database
        .collection('posts')
        .find({ 'profile': profile })
        .toArray();
    return doc;
}

async function createUser(username, password) {
    let doc = {
        'username': username,
        'password': password,
        'friends': [],
        'incoming': [],
        'outgoing': []
    };
    await database.collection('users').insertOne(doc);
}

async function findOneUser(username) {
    let doc = await database
        .collection('users')
        .findOne({ 'username': username });
    return doc;
}

async function findUsers(search) {
    let doc = await database
        .collection('users')
        .find({ 'username': { $regex: new RegExp(search, 'i') } })
        .toArray();
    return doc;
}

async function friendRequest(userSending, userToFriend) {
    if (userSending == userToFriend) {
        return;
    }

    let docSending = await findOneUser(userSending);

    let docToFriend = await findOneUser(userToFriend);


    if (docToFriend.friends.includes(userSending)) {
        return;
    }

    if (docToFriend.outgoing.includes(userSending)) {
        docToFriend.outgoing.pop(docToFriend.outgoing.indexOf(userSending));
        docSending.incoming.pop(docSending.incoming.indexOf(userToFriend));

        docToFriend.friends.push(userSending);
        docSending.friends.push(userToFriend);
    }
    else {
        docToFriend.incoming.push(userSending);
        docSending.outgoing.push(userToFriend);
    }

    await database.collection('users').replaceOne({ 'username': userSending }, docSending);
    await database.collection('users').replaceOne({ 'username': userToFriend }, docToFriend);
}

async function hasFriend(user, friend) {
    let userJSON = await findOneUser(user);

    return userJSON.friends.includes(friend);
}

// function getToken

export { insertPost, findPost, allPosts, findProfile, isRead, createUser, findOneUser, findUsers, friendRequest, hasFriend }