import * as path from "path";
import { ApiCall, HttpServer } from "tsrpc";
import { serviceProto } from "./shared/protocols/serviceProto";
import dotenv from 'dotenv';
dotenv.config();

// Create the Server
const server = new HttpServer(serviceProto, {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    // Remove this to use binary mode (remove from the client too)
    json: true,
    // Disable CORS since nginx handles it
    cors: '',
});

// Initialize before server start
async function init() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)
};

// Entry function
async function main() {
    await init();
    await server.start();
};
main();