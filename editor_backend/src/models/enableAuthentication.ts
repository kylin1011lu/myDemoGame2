import { HttpServer } from "tsrpc";
import { BaseConf } from "../shared/protocols/base";

export function enableAuthentication(server: HttpServer) {
    server.flows.preApiCallFlow.push(call => {
        let conf: BaseConf | undefined = call.service.conf;

        // NeedLogin
        if (conf?.needLogin && !call.currentUser) {
            call.error('请先登录', { code: 'NEED_LOGIN' });
            return undefined;
        }

        // NeedRoles
        if (conf?.needRoles?.length && !call.currentUser?.roles.some(v => conf!.needRoles!.indexOf(v) > -1)) {
            call.error('你没有权限执行此操作', { code: 'NO_AUTHORITY' });
            return undefined;
        }

        return call;
    })
}