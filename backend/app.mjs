import { startServer } from './server.mjs';

let config = {
    host: 'localhost:27017',
    database: 'uwu'
}

startServer(8000, config);
