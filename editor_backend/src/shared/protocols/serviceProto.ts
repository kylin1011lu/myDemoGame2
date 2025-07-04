import { ServiceProto } from 'tsrpc-proto';
import { ReqAddScene, ResAddScene } from './story/PtlAddScene';
import { ReqAddStory, ResAddStory } from './story/PtlAddStory';
import { ReqGetSceneById, ResGetSceneById } from './story/PtlGetSceneById';
import { ReqGetStoryList, ResGetStoryList } from './story/PtlGetStoryList';
import { ReqUpdateScene, ResUpdateScene } from './story/PtlUpdateScene';
import { ReqUpdateSceneInfo, ResUpdateSceneInfo } from './story/PtlUpdateSceneInfo';
import { ReqUpdateStory, ResUpdateStory } from './story/PtlUpdateStory';
import { ReqLogin, ResLogin } from './user/PtlLogin';
import { ReqLogout, ResLogout } from './user/PtlLogout';

export interface ServiceType {
    api: {
        "story/AddScene": {
            req: ReqAddScene,
            res: ResAddScene
        },
        "story/AddStory": {
            req: ReqAddStory,
            res: ResAddStory
        },
        "story/GetSceneById": {
            req: ReqGetSceneById,
            res: ResGetSceneById
        },
        "story/GetStoryList": {
            req: ReqGetStoryList,
            res: ResGetStoryList
        },
        "story/UpdateScene": {
            req: ReqUpdateScene,
            res: ResUpdateScene
        },
        "story/UpdateSceneInfo": {
            req: ReqUpdateSceneInfo,
            res: ResUpdateSceneInfo
        },
        "story/UpdateStory": {
            req: ReqUpdateStory,
            res: ResUpdateStory
        },
        "user/Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "user/Logout": {
            req: ReqLogout,
            res: ResLogout
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 8,
    "services": [
        {
            "id": 10,
            "name": "story/AddScene",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 11,
            "name": "story/AddStory",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 12,
            "name": "story/GetSceneById",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 13,
            "name": "story/GetStoryList",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 14,
            "name": "story/UpdateScene",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 15,
            "name": "story/UpdateSceneInfo",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 16,
            "name": "story/UpdateStory",
            "type": "api",
            "conf": {
                "needLogin": true,
                "needRoles": [
                    "admin"
                ]
            }
        },
        {
            "id": 17,
            "name": "user/Login",
            "type": "api",
            "conf": {}
        },
        {
            "id": 18,
            "name": "user/Logout",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "story/PtlAddScene/ReqAddScene": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "scene_title",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlAddScene/ResAddScene": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "scene",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "scene_id",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 1,
                                "name": "scene_title",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 2,
                                "name": "start_node_id",
                                "type": {
                                    "type": "String"
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlAddStory/ReqAddStory": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_title",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "description",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "story_type",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "story/PtlAddStory/ResAddStory": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "story",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "story_id",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "story_title",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 2,
                                "name": "description",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 3,
                                "name": "start_scene_id",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 4,
                                "name": "story_type",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 5,
                                "name": "scenes",
                                "type": {
                                    "type": "Array",
                                    "elementType": {
                                        "type": "Interface",
                                        "properties": [
                                            {
                                                "id": 0,
                                                "name": "scene_id",
                                                "type": {
                                                    "type": "String"
                                                }
                                            },
                                            {
                                                "id": 1,
                                                "name": "scene_title",
                                                "type": {
                                                    "type": "String"
                                                }
                                            },
                                            {
                                                "id": 2,
                                                "name": "start_node_id",
                                                "type": {
                                                    "type": "String"
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                "id": 6,
                                "name": "version",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 7,
                                "name": "created_at",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 8,
                                "name": "updated_at",
                                "type": {
                                    "type": "String"
                                }
                            }
                        ]
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlGetSceneById/ReqGetSceneById": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "scene_id",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "story/PtlGetSceneById/ResGetSceneById": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "scene",
                    "type": {
                        "type": "Interface",
                        "properties": [
                            {
                                "id": 0,
                                "name": "story_id",
                                "type": {
                                    "type": "Number"
                                }
                            },
                            {
                                "id": 1,
                                "name": "scene_id",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 2,
                                "name": "scene_title",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 3,
                                "name": "start_node_id",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 4,
                                "name": "nodes",
                                "type": {
                                    "type": "Array",
                                    "elementType": {
                                        "type": "Any"
                                    }
                                }
                            },
                            {
                                "id": 5,
                                "name": "created_at",
                                "type": {
                                    "type": "String"
                                }
                            },
                            {
                                "id": 6,
                                "name": "updated_at",
                                "type": {
                                    "type": "String"
                                }
                            }
                        ]
                    },
                    "optional": true
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlGetStoryList/ReqGetStoryList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "story/PtlGetStoryList/ResGetStoryList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "stories",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Interface",
                            "properties": [
                                {
                                    "id": 0,
                                    "name": "story_id",
                                    "type": {
                                        "type": "Number"
                                    }
                                },
                                {
                                    "id": 1,
                                    "name": "story_title",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 2,
                                    "name": "description",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "start_scene_id",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 4,
                                    "name": "story_type",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 5,
                                    "name": "scenes",
                                    "type": {
                                        "type": "Array",
                                        "elementType": {
                                            "type": "Interface",
                                            "properties": [
                                                {
                                                    "id": 0,
                                                    "name": "scene_id",
                                                    "type": {
                                                        "type": "String"
                                                    }
                                                },
                                                {
                                                    "id": 1,
                                                    "name": "scene_title",
                                                    "type": {
                                                        "type": "String"
                                                    }
                                                },
                                                {
                                                    "id": 2,
                                                    "name": "start_node_id",
                                                    "type": {
                                                        "type": "String"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    "id": 6,
                                    "name": "version",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 7,
                                    "name": "created_at",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 8,
                                    "name": "updated_at",
                                    "type": {
                                        "type": "String"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        "story/PtlUpdateScene/ReqUpdateScene": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "scene_id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "start_node_id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "nodes",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Any"
                        }
                    }
                }
            ]
        },
        "story/PtlUpdateScene/ResUpdateScene": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlUpdateSceneInfo/ReqUpdateSceneInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "scene_id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "new_scene_id",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "scene_title",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "start_node_id",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "story/PtlUpdateSceneInfo/ResUpdateSceneInfo": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlUpdateStory/ReqUpdateStory": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "story_title",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                },
                {
                    "id": 2,
                    "name": "description",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "story/PtlUpdateStory/ResUpdateStory": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "success",
                    "type": {
                        "type": "Boolean"
                    }
                },
                {
                    "id": 1,
                    "name": "error",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "user/PtlLogin/ReqLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "password",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "user/PtlLogin/ResLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "__ssoToken",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "user",
                    "type": {
                        "type": "Reference",
                        "target": "../models/CurrentUser/CurrentUser"
                    }
                }
            ]
        },
        "../models/CurrentUser/CurrentUser": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "uid",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "username",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "roles",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "String"
                        }
                    }
                }
            ]
        },
        "user/PtlLogout/ReqLogout": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlLogout/ResLogout": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        }
    }
};