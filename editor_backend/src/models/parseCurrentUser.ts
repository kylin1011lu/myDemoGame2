import { HttpServer } from 'tsrpc';
import { UserUtil } from './UserUtil';
import { BaseRequest } from '../shared/protocols/base';
import { CurrentUser } from '../shared/models/CurrentUser';

export function parseCurrentUser(server: HttpServer) {
    // Auto parse call.currentUser
    server.flows.preApiCallFlow.push(async call => {
        let req = call.req as BaseRequest;
        if (req.__ssoToken) {
            call.currentUser = await UserUtil.parseSSO(req.__ssoToken);
        }
        return call;
    })
}

declare module 'tsrpc' {
    export interface ApiCall {
        currentUser?: CurrentUser;
    }
}