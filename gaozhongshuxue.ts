import { MapData } from "./src/draw-map";

export const gaozhongshuxue: MapData = {
  // 主题
  
  
  "topics": {
    "104869": "数据结构",
    "104870": "逻辑结构",
    "104871": "存储过程",
    "104873": "顺序存储",
    "104874": "链式存储",
    "104875": "索引存储",
    "104876": "散列存储",
    "104877": "线性表",
    "104878": "链表",
    "104879": "循环链表",
    "104880": "双链表",
    "104881": "可变长数组",
    "104882": "数组",
    "104883": "朱迪矩阵",
    "104884": "队列",
    "104885": "堆栈",
    "104886": "顺序栈",
    "104887": "链栈",
    "104888": "顺序队列",
    "104889": "链队",
    "104890": "树",
    "104891": "森林",
    "104892": "伸展树",
    "104894": "二叉树",
    "104895": "替罪羊树",
    "104896": "2-3树",
    "104897": "线索二叉树",
    "104898": "二叉查找树",
    "104899": "AVL树",
    "104900": "树旋转",
    "104901": "哈夫曼树",
    "104902": "哈夫曼编码",
    "104903": "遍历",
    "104904": "图",
    "104905": "无向图",
    "104906": "有向图",
    "104907": "平面图 (图论)",
    "104908": "完全图",
    "104909": "佩特森图",
    "104910": "哈密顿图",
    "104911": "连通图",
    "104912": "强连通图",
    "104913": "连通分量",
    "104914": "邻接矩阵",
    "104915": "邻接表",
    "104916": "深度优先遍历",
    "104917": "广度优先遍历",
    "104918": "生成树",
    "104919": "最小生成树",
    "104920": "prim算法",
    "104921": "Kruskal算法",
    "104922": "单源最短路径",
    "104923": "Dijkstra算法",
    "104924": "拓扑排序",
    "104925": "AOV网",
    "104926": "查找",
    "104927": "查找表彪彪彪彪",
    "104928": "平均查找长度",
    "104929": "顺序查找",
    "104930": "折半查找",
    "104931": "分块查找",
    "104932": "B树",
    "104933": "B+树",
    "104934": "哈希表",
    "104935": "散列查找",
    "104936": "完美散列",
    "104937": "哈希函数",
    "104938": "冲突处理",
    "104939": "开放定址法",
    "104940": "链地址法",
    "104941": "红黑树",
    "104944": "内部排序",
    "104946": "插入排序",
    "104947": "Shell排序",
    "104948": "冒泡排序",
    "104949": "快速排序",
    "104950": "选择排序",
    "104951": "堆排序",
    "104952": "归并排序",
    "104953": "基数排序",
    "-1": "(start)"
},
"resultRelations": {
    "104869": [
        104926,
        104871
    ],
    "104871": [
        104944,
        104870,
        104873,
        104876,
        104875,
        104874
    ],
    "104877": [
        104885,
        104878
    ],
    "104878": [
        104880,
        104879
    ],
    "104882": [
        104877,
        104890,
        104883,
        104881
    ],
    "104884": [
        104889,
        104888
    ],
    "104885": [
        104884,
        104887,
        104886
    ],
    "104890": [
        104904,
        104932,
        104896,
        104891,
        104894
    ],
    "104894": [
        104902,
        104898,
        104901,
        104900,
        104897
    ],
    "104898": [
        104899,
        104892,
        104895,
        104941
    ],
    "104903": [
        104917,
        104916
    ],
    "104904": [
        104914,
        104915,
        104905,
        104906,
        104910,
        104903,
        104909
    ],
    "104905": [
        104918,
        104907,
        104913,
        104911,
        104908
    ],
    "104906": [
        104912,
        104922,
        104925
    ],
    "104918": [
        104919
    ],
    "104919": [
        104920,
        104921
    ],
    "104922": [
        104923
    ],
    "104925": [
        104924
    ],
    "104926": [
        104927,
        104934
    ],
    "104927": [
        104935,
        104931,
        104930,
        104929,
        104928
    ],
    "104932": [
        104933
    ],
    "104934": [
        104938,
        104937,
        104936
    ],
    "104938": [
        104940,
        104939
    ],
    "104944": [
        104953,
        104952,
        104951,
        104950,
        104949,
        104948,
        104947,
        104946
    ],
    "-1": [
        104882,
        104869
    ]
},
"graph": {
    "0": {
        "104927": [
            104935,
            104931,
            104930,
            104929,
            104928
        ]
    },
    "1": {
        "104869": [
            104926
        ],
        "104882": [
            104877,
            104890,
            104883,
            104881
        ],
        "104890": [
            104932,
            104896,
            104891
        ],
        "104932": [
            104933
        ],
        "-1": [
            104882,
            104869
        ]
    },
    "2": {
        "104903": [
            104917,
            104916
        ],
        "104904": [
            104914,
            104915,
            104910,
            104903,
            104909
        ]
    },
    "3": {
        "104894": [
            104902,
            104898,
            104901,
            104900,
            104897
        ],
        "104898": [
            104899,
            104892,
            104895,
            104941
        ]
    },
    "4": {
        "104905": [
            104907,
            104913,
            104911,
            104908
        ]
    },
    "5": {
        "104906": [
            104912,
            104922,
            104925
        ],
        "104922": [
            104923
        ],
        "104925": [
            104924
        ]
    },
    "6": {
        "104934": [
            104938,
            104937,
            104936
        ],
        "104938": [
            104940,
            104939
        ]
    },
    "7": {
        "104884": [
            104889,
            104888
        ],
        "104885": [
            104884,
            104887,
            104886
        ]
    },
    "8": {
        "104878": [
            104880,
            104879
        ]
    },
    "9": {
        "104871": [
            104870,
            104873,
            104876,
            104875,
            104874
        ]
    },
    "10": {
        "104944": [
            104953,
            104952,
            104951,
            104950,
            104949,
            104948,
            104947,
            104946
        ]
    },
    "11": {
        "104918": [
            104919
        ],
        "104919": [
            104920,
            104921
        ]
    }
},
"topicId2Community": {
    "104869": 1,
    "104870": 9,
    "104871": 9,
    "104873": 9,
    "104874": 9,
    "104875": 9,
    "104876": 9,
    "104877": 1,
    "104878": 8,
    "104879": 8,
    "104880": 8,
    "104881": 1,
    "104882": 1,
    "104883": 1,
    "104884": 7,
    "104885": 7,
    "104886": 7,
    "104887": 7,
    "104888": 7,
    "104889": 7,
    "104890": 1,
    "104891": 1,
    "104892": 3,
    "104894": 3,
    "104895": 3,
    "104896": 1,
    "104897": 3,
    "104898": 3,
    "104899": 3,
    "104900": 3,
    "104901": 3,
    "104902": 3,
    "104903": 2,
    "104904": 2,
    "104905": 4,
    "104906": 5,
    "104907": 4,
    "104908": 4,
    "104909": 2,
    "104910": 2,
    "104911": 4,
    "104912": 5,
    "104913": 4,
    "104914": 2,
    "104915": 2,
    "104916": 2,
    "104917": 2,
    "104918": 11,
    "104919": 11,
    "104920": 11,
    "104921": 11,
    "104922": 5,
    "104923": 5,
    "104924": 5,
    "104925": 5,
    "104926": 1,
    "104927": 0,
    "104928": 0,
    "104929": 0,
    "104930": 0,
    "104931": 0,
    "104932": 1,
    "104933": 1,
    "104934": 6,
    "104935": 0,
    "104936": 6,
    "104937": 6,
    "104938": 6,
    "104939": 6,
    "104940": 6,
    "104941": 3,
    "104944": 10,
    "104946": 10,
    "104947": 10,
    "104948": 10,
    "104949": 10,
    "104950": 10,
    "104951": 10,
    "104952": 10,
    "104953": 10,
    "-1": 1
},
"relationCrossCommunity": [
    [
        104890,
        104904
    ],
    [
        104890,
        104894
    ],
    [
        104904,
        104905
    ],
    [
        104904,
        104906
    ],
    [
        104926,
        104927
    ],
    [
        104926,
        104934
    ],
    [
        104877,
        104885
    ],
    [
        104877,
        104878
    ],
    [
        104871,
        104944
    ],
    [
        104869,
        104871
    ],
    [
        104905,
        104918
    ]
],
"communityRelation": {
    "1": [
        2,
        3,
        0,
        6,
        7,
        8,
        9
    ],
    "2": [
        4,
        5
    ],
    "4": [
        11
    ],
    "9": [
        10
    ]
}
}