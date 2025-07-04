import * as path from "path";
import { ApiCall, HttpServer } from "tsrpc";
import { serviceProto } from "./shared/protocols/serviceProto";
import dotenv from 'dotenv';
import { parseCurrentUser } from './models/parseCurrentUser';
import { enableAuthentication } from './models/enableAuthentication';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

// Create the Server
const server = new HttpServer(serviceProto, {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    // Remove this to use binary mode (remove from the client too)
    json: true,
    ...(isProd ? { cors: '' } : {})
});

// Initialize before server start
async function init() {
    // Auto implement APIs
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    parseCurrentUser(server);
    enableAuthentication(server);
};

// Entry function
async function main() {
    await init();
    await server.start();
};
main();