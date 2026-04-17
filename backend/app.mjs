import "dotenv/config";

import { startServer } from "./server.mjs";

let config = {
  host: process.env.MONGO_URL,
  database: process.env.MONGO_DB,
  auth: process.env.MONGO_AUTH
};

startServer(process.env.PORT, config);
