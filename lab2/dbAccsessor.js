import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from "./mongoUtils.js";

console.log("HEllo World!")

let config = {
    host: 'localhost:27017',
    db: 'uwu'
}

let db
connectToDatabase(config, () => {
    // Call the function 'run' as soon as the connection has been established.
    console.log('Connected!')
    db = getDatabaseConnection()
});

async function insert(author, text){
    let doc = { name: author,
                content: text}

    await db.collection('post').insertOne(doc)
    console.log('1 post has been inserted')

}
async function read(){
    // 'findOne' returns an object but we have to wait
    let doc = await db.collection('post').findOne({'name' : {$regex: /Ma/}})
    console.log(`Found: ${JSON.stringify(doc, null, 2)}`) // pretty output
}

export { connectToDatabase, insert, read }