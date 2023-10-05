import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from "./mongoUtils.mjs";


let config = {
    host: "localhost:27017",
    db: "uwu"
}

let db;

connectToDatabase(config, () => {
    // Call the function "run" as soon as the connection has been established.
    console.log("Connected!");
    db = getDatabaseConnection();
});

async function nextId(){
    let idDoc = await db
        .collection("id")
        .findOne();
    let id = idDoc.current; 
    idDoc.current += 1;
    db.collection("id").replaceOne({}, idDoc);
    return id;
}

async function insert(author, text){
    let doc = { id: await nextId(), 
                name: author,
                content: text,
                date: new Date().toString().slice(0,24),
                read: false}
    await db.collection("post").insertOne(doc);
    return doc.id;
}

async function isRead(id) {
    let doc = await read(parseInt(id));
    doc.read = !(doc.read);
    await db.collection("post").replaceOne({"id" : parseInt(id)}, doc);
}

async function read(id){
    // "findOne" returns an object but we have to wait
    let doc = await db
        .collection("post")
        .findOne({"id" : parseInt(id)});
    return doc;
}

async function readAll() {
    let doc = await db
        .collection("post")
        .find()
        .toArray();
    return doc;
}


export {insert, read, readAll, isRead }