import { HttpClient } from 'tsrpc-browser';
import { serviceProto } from '../shared/protocols/serviceProto';

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

// 根据环境自动切换server地址
const getServerUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://127.0.0.1:3000';
  }
  // 生产环境可根据实际情况配置
  return window.location.origin;
};

let client: HttpClient<any> | null = null;

export function getApiClient() {
  if (!client) {
    client = new HttpClient(serviceProto, {
      server: getServerUrl()
    });
  }
  return client;
} 