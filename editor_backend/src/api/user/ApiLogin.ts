import { ApiCall } from "tsrpc";
import { UserUtil } from "../../models/UserUtil";
import { ReqLogin, ResLogin } from "../../shared/protocols/user/PtlLogin";
import { logger } from "../../utils/logger";


export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {
    const { username } = call.req;
    try {
        let user = UserUtil.users.find(v => v.username === username && v.password === call.req.password);
        if (!user) {
            logger.warn(`登录失败: 用户名=${username}, IP=${call.conn?.ip || 'unknown'}`);
            call.error('Error username or password');
            return;
        }

        let sso = await UserUtil.createSsoToken(user.uid);
        logger.info(`登录成功: 用户名=${username}, IP=${call.conn?.ip || 'unknown'}`);
        call.succ({
            __ssoToken: sso,
            user: user
        })
    } catch (err) {
        logger.error(`登录异常: 用户名=${username}, IP=${call.conn?.ip || 'unknown'}, 错误=${err instanceof Error ? err.message : String(err)}`);
        call.error('Internal server error');
    }
}