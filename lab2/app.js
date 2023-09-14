require('./mongoUtils.js')

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
    run()
});
