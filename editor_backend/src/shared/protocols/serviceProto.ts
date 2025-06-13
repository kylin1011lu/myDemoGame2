import { ServiceProto } from 'tsrpc-proto';
import { ReqAddScene, ResAddScene } from './PtlAddScene';
import { ReqAddStory, ResAddStory } from './PtlAddStory';
import { ReqGetSceneById, ResGetSceneById } from './PtlGetSceneById';
import { ReqGetStoryList, ResGetStoryList } from './PtlGetStoryList';
import { ReqUpdateScene, ResUpdateScene } from './PtlUpdateScene';
import { ReqUpdateSceneInfo, ResUpdateSceneInfo } from './PtlUpdateSceneInfo';
import { ReqUpdateStory, ResUpdateStory } from './PtlUpdateStory';

export interface ServiceType {
    api: {
        "AddScene": {
            req: ReqAddScene,
            res: ResAddScene
        },
        "AddStory": {
            req: ReqAddStory,
            res: ResAddStory
        },
        "GetSceneById": {
            req: ReqGetSceneById,
            res: ResGetSceneById
        },
        "GetStoryList": {
            req: ReqGetStoryList,
            res: ResGetStoryList
        },
        "UpdateScene": {
            req: ReqUpdateScene,
            res: ResUpdateScene
        },
        "UpdateSceneInfo": {
            req: ReqUpdateSceneInfo,
            res: ResUpdateSceneInfo
        },
        "UpdateStory": {
            req: ReqUpdateStory,
            res: ResUpdateStory
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 6,
    "services": [
        {
            "id": 6,
            "name": "AddScene",
            "type": "api"
        },
        {
            "id": 7,
            "name": "AddStory",
            "type": "api"
        },
        {
            "id": 3,
            "name": "GetSceneById",
            "type": "api"
        },
        {
            "id": 2,
            "name": "GetStoryList",
            "type": "api"
        },
        {
            "id": 4,
            "name": "UpdateScene",
            "type": "api"
        },
        {
            "id": 5,
            "name": "UpdateSceneInfo",
            "type": "api"
        },
        {
            "id": 8,
            "name": "UpdateStory",
            "type": "api"
        }
    ],
    "types": {
        "PtlAddScene/ReqAddScene": {
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
                    "name": "scene_title",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlAddScene/ResAddScene": {
            "type": "Interface",
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
        "PtlAddStory/ReqAddStory": {
            "type": "Interface",
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
        "PtlAddStory/ResAddStory": {
            "type": "Interface",
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
        "PtlGetSceneById/ReqGetSceneById": {
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
                }
            ]
        },
        "PtlGetSceneById/ResGetSceneById": {
            "type": "Interface",
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
        "PtlGetStoryList/ReqGetStoryList": {
            "type": "Interface"
        },
        "PtlGetStoryList/ResGetStoryList": {
            "type": "Interface",
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
                                    "id": 5,
                                    "name": "story_title",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 6,
                                    "name": "description",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 7,
                                    "name": "start_scene_id",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 8,
                                    "name": "story_type",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 9,
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
                                    "id": 2,
                                    "name": "version",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 3,
                                    "name": "created_at",
                                    "type": {
                                        "type": "String"
                                    }
                                },
                                {
                                    "id": 4,
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
        "PtlUpdateScene/ReqUpdateScene": {
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
                }
            ]
        },
        "PtlUpdateScene/ResUpdateScene": {
            "type": "Interface",
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
        "PtlUpdateSceneInfo/ReqUpdateSceneInfo": {
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
        "PtlUpdateSceneInfo/ResUpdateSceneInfo": {
            "type": "Interface",
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
        "PtlUpdateStory/ReqUpdateStory": {
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
        "PtlUpdateStory/ResUpdateStory": {
            "type": "Interface",
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
        }
    }
};