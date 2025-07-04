import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { client } from '../utils/network';
import { ReqLogin } from '../shared/protocols/user/PtlLogin';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: ReqLogin) => {
        setLoading(true);
        const ret = await client.callApi('user/Login', values);
        setLoading(false);
        if (ret.isSucc) {
            message.success('登录成功');
            navigate('/');
        } else {
            message.error('登录失败，请检查账号密码');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <Card style={{ width: 350 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h2>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
                        <Input autoFocus />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage; 