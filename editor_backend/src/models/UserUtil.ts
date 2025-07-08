import { v4 as uuidv4 } from 'uuid';

const SSO_VALID_TIME = 86400000 * 7;

export class UserUtil {
    static users = [
        {
            uid: 10000,
            username: process.env.ADMIN_USER || 'admin',
            password: process.env.ADMIN_PASS || 'ABCDEF1011admin',
            roles: ['admin']
        }
    ];

    static ssoTokenInfo: {
        [token: string]: { expiredTime: number, uid: number }
    } = {};

    static async createSsoToken(uid: number): Promise<string> {
        const token = uuidv4();
        const expiredTime = Date.now() + SSO_VALID_TIME;
        this.ssoTokenInfo[token] = { uid, expiredTime };
        return token;
    }

    static async destroySsoToken(ssoToken: string): Promise<void> {
        delete this.ssoTokenInfo[ssoToken];
    }

    static async parseSSO(token: string) {
        const info = this.ssoTokenInfo[token];
        if (!info || info.expiredTime < Date.now()) return undefined;
        const user = this.users.find(u => u.uid === info.uid);
        if (!user) return undefined;
        info.expiredTime = Date.now() + SSO_VALID_TIME;
        return {
            uid: user.uid,
            username: user.username,
            roles: user.roles
        };
    }
} 