import { ServiceProto } from 'tsrpc-proto';
import { ReqGetSceneById, ResGetSceneById } from './PtlGetSceneById';
import { ReqGetStoryList, ResGetStoryList } from './PtlGetStoryList';

export interface ServiceType {
    api: {
        "GetSceneById": {
            req: ReqGetSceneById,
            res: ResGetSceneById
        },
        "GetStoryList": {
            req: ReqGetStoryList,
            res: ResGetStoryList
        }
    },
    msg: {

    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 5,
    "services": [
        {
            "id": 3,
            "name": "GetSceneById",
            "type": "api"
        },
        {
            "id": 2,
            "name": "GetStoryList",
            "type": "api"
        }
    ],
    "types": {
        "PtlGetSceneById/ReqGetSceneById": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "story_id",
                    "type": {
                        "type": "String"
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
                                    "type": "String"
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
                                        "type": "String"
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
        }
    }
};