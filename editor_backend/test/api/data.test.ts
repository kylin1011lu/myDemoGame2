import assert from 'assert';
import { HttpClient, TsrpcError } from 'tsrpc';
import { serviceProto } from '../../src/shared/protocols/serviceProto';

// 1. 先执行 `npm run dev` 启动本地服务
// 2. 再执行 `npm test` 运行单元测试

describe('全量API接口单元测试', function () {
    let client = new HttpClient(serviceProto, {
        server: 'http://127.0.0.1:3000',
        logger: console
    });
    let __ssoToken: string;
    let createdStoryId: number;
    let createdSceneId: string;

    before('登录获取token', async function () {
        const ret = await client.callApi('user/Login', {
            username: 'admin',
            password: 'ABCDEF1011admin'
        });
        assert.strictEqual(ret.isSucc, true);
        __ssoToken = ret.res!.__ssoToken;
        assert.ok(__ssoToken);
    });

    it('story/AddStory', async function () {
        const ret = await client.callApi('story/AddStory', {
            __ssoToken,
            story_title: '测试故事',
            description: '单元测试用',
            story_type: 'test'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, true);
        assert.ok(ret.res!.story);
        createdStoryId = ret.res!.story!.story_id;
    });

    it('story/AddScene', async function () {
        const ret = await client.callApi('story/AddScene', {
            __ssoToken,
            story_id: createdStoryId,
            scene_title: '第一个场景'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, true);
        assert.ok(ret.res!.scene);
        createdSceneId = ret.res!.scene!.scene_id;
    });

    it('story/GetStoryList', async function () {
        const ret = await client.callApi('story/GetStoryList', { __ssoToken });
        assert.strictEqual(ret.isSucc, true);
        assert.ok(Array.isArray(ret.res!.stories));
        assert.ok(ret.res!.stories.find(s => s.story_id === createdStoryId));
    });

    it('story/GetSceneById', async function () {
        const ret = await client.callApi('story/GetSceneById', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: createdSceneId
        });
        assert.strictEqual(ret.isSucc, true);
        assert.ok(ret.res!.scene);
        assert.strictEqual(ret.res!.scene!.scene_id, createdSceneId);
    });

    it('story/UpdateScene', async function () {
        const ret = await client.callApi('story/UpdateScene', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: createdSceneId,
            start_node_id: 'start',
            nodes: [{ id: 'start', text: '开始节点' }]
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, true);
    });

    it('story/UpdateSceneInfo', async function () {
        const ret = await client.callApi('story/UpdateSceneInfo', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: createdSceneId,
            new_scene_id: createdSceneId + '_new',
            scene_title: '新场景标题',
            start_node_id: 'start'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, true);
        createdSceneId = createdSceneId + '_new';
    });

    it('story/UpdateStory', async function () {
        const ret = await client.callApi('story/UpdateStory', {
            __ssoToken,
            story_id: createdStoryId,
            story_title: '新故事标题',
            description: '新描述'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, true);
    });

    it('user/Logout', async function () {
        const ret = await client.callApi('user/Logout', { __ssoToken });
        assert.strictEqual(ret.isSucc, true);
    });

    // 失败用例
    it('story/AddStory: 缺少参数', async function () {
        const ret = await client.callApi('story/AddStory', {
            __ssoToken,
            story_title: '',
            description: '',
            story_type: ''
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, false);
    });

    it('story/AddScene: story_id不存在', async function () {
        const ret = await client.callApi('story/AddScene', {
            __ssoToken,
            story_id: 99999999,
            scene_title: 'xxx'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, false);
    });

    it('story/GetSceneById: 场景不存在', async function () {
        const ret = await client.callApi('story/GetSceneById', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: 'not_exist_scene'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.ok(ret.res!.error);
    });

    it('story/UpdateScene: 场景不存在', async function () {
        const ret = await client.callApi('story/UpdateScene', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: 'not_exist_scene',
            start_node_id: 'start',
            nodes: []
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, false);
    });

    it('story/UpdateSceneInfo: 新scene_id已存在', async function () {
        // 先新建一个scene
        const ret1 = await client.callApi('story/AddScene', {
            __ssoToken,
            story_id: createdStoryId,
            scene_title: '重复id场景'
        });
        assert.strictEqual(ret1.isSucc, true);
        assert.strictEqual(ret1.res!.success, true);
        const existSceneId = ret1.res!.scene!.scene_id;
        // 再用已存在id去改
        const ret2 = await client.callApi('story/UpdateSceneInfo', {
            __ssoToken,
            story_id: createdStoryId,
            scene_id: createdSceneId,
            new_scene_id: existSceneId,
            scene_title: 'xxx',
            start_node_id: 'start'
        });
        assert.strictEqual(ret2.isSucc, true);
        assert.strictEqual(ret2.res!.success, false);
    });

    it('story/UpdateStory: story_id不存在', async function () {
        const ret = await client.callApi('story/UpdateStory', {
            __ssoToken,
            story_id: 99999999,
            story_title: 'xxx'
        });
        assert.strictEqual(ret.isSucc, true);
        assert.strictEqual(ret.res!.success, false);
    });

    it('鉴权校验: token无效', async function () {
        const ret = await client.callApi('story/GetStoryList', { __ssoToken: 'invalid_token' });
        assert.strictEqual(ret.isSucc, false);
    });

    it('user/Login: 密码错误', async function () {
        const ret = await client.callApi('user/Login', {
            username: 'admin',
            password: 'wrongpass'
        });
        assert.strictEqual(ret.isSucc, false);
    });
});