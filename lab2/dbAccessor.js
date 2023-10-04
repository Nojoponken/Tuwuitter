import { ObjectId } from "mongodb";
import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from "./mongoUtils.js";


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

async function insert(author, text){
    let doc = { name: author,
                content: text,
                date: new Date(),
                read: false}
    await db.collection("post").insertOne(doc);
}

async function isRead(id) {
    let doc = await read(id);
    doc.read = !(doc.read);
    await db.collection("post").replaceOne({"_id" : new ObjectId(id)}, doc);
}

async function read(id){
    // "findOne" returns an object but we have to wait
    let doc = await db
        .collection("post")
        .findOne({"_id" : new ObjectId(id)});
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