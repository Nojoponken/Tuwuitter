import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from "./mongoUtils.js";

console.log("HEllo World!");

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
                content: text}

    await db.collection("post").insertOne(doc);
    console.log("1 post has been inserted");

}
async function read(id){
    // "findOne" returns an object but we have to wait
    let doc = await db.collection("post").findOne({"name" : "milo"});
    console.log(`Found: ${JSON.stringify(doc, null, 2)}`); // pretty output
}

async function readAll() {
    let doc = await db.collection("post")
    .find().toArray();
    //console.log(await db.collection("post").find({name : "jim"}));
    //console.log(`Found: ${JSON.stringify(doc, null, 2)}`);
    console.log(doc);
    return doc;
}


export { connectToDatabase, insert, read, readAll }