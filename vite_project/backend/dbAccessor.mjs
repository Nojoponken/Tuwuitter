import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from './mongoUtils.mjs';


let config = {
    host: 'localhost:27017',
    db: 'uwu'
}

let db;

connectToDatabase(config, () => {
    // Call the function 'run' as soon as the connection has been established.
    console.log('Connected!');
    db = getDatabaseConnection();
});

async function nextId() {
    let idDoc = await db
        .collection('id')
        .findOne();
    let id = idDoc.current;
    idDoc.current += 1;
    db.collection('id').replaceOne({}, idDoc);
    return id;
}

async function insert(author, text, profile) {
    let doc = {
        'id': await nextId(),
        'name': author,
        'content': text,
        'profile': profile,
        'date': new Date().toString().slice(0, 24),
        'read': false
    }
    await db.collection('posts').insertOne(doc);
    return doc.id;
}

async function isRead(id) {
    let doc = await read(parseInt(id));
    doc.read = !(doc.read);
    await db.collection('posts').replaceOne({ 'id': parseInt(id) }, doc);
}

async function read(id) {
    // 'findOne' returns an object but we have to wait
    let doc = await db
        .collection('posts')
        .findOne({ 'id': parseInt(id) });
    return doc;
}

async function readAll() {
    let doc = await db
        .collection('posts')
        .find()
        .toArray();
    return doc;
}

async function readProfile(profile) {
    let doc = await db
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
    await db.collection('users').insertOne(doc);
}

async function findUser(username) {
    let doc = await db
        .collection('users')
        .findOne({ 'username': username });
    return doc;
}

async function getUsers(search) {
    let doc = await db
        .collection('users')
        .find({ 'username': { $regex: new RegExp(search, 'i') } })
        .toArray();
    return doc;
}

async function friendRequest(userSending, userToFriend) {
    if (userSending == userToFriend) {
        return;
    }

    let docSending = await db
        .collection('users')
        .findOne({ 'username': userSending });

    let docToFriend = await db
        .collection('users')
        .findOne({ 'username': userToFriend });

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

    await db.collection('users').replaceOne({ 'username': userSending }, docSending);
    await db.collection('users').replaceOne({ 'username': userToFriend }, docToFriend);
}

// function getToken

export { insert, read, readAll, readProfile, isRead, createUser, findUser, getUsers, friendRequest}