import { HttpClient } from 'tsrpc-browser';
import { serviceProto } from '../shared/protocols/serviceProto';
import { BaseResponse } from '../shared/protocols/base';

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

// 根据环境自动切换server地址
const getServerUrl = () => {
  if (import.meta.env.MODE === 'development') {
    // return 'http://127.0.0.1:3001';
    return 'https://api.youxiheai.xin'
  }
  // 生产环境可根据实际情况配置
  return 'https://api.youxiheai.xin';
};

// Create Client
export const client = new HttpClient(serviceProto, {
  server: getServerUrl(),
  logger: import.meta.env.MODE === 'development' ? console : undefined
});

// When server return a SSOToken, store it to localStorage
client.flows.postApiReturnFlow.push(v => {
  if (v.return.isSucc) {
      let res = v.return.res as BaseResponse;
      if (res.__ssoToken !== undefined) {
          localStorage.setItem('SSO_TOKEN', res.__ssoToken);
      }
  }
  else if (v.return.err.code === 'NEED_LOGIN') {
      localStorage.removeItem('SSO_TOKEN');
      window.location.href = '/login';
  }
  return v;
});

// Append "__ssoToken" to request automatically
client.flows.preCallApiFlow.push(v => {
  let ssoToken = localStorage.getItem('SSO_TOKEN');
  if (ssoToken) {
      v.req.__ssoToken = ssoToken;
  }
  return v;
})