/**
 * 摘除图中的叶子结点
 * @param relations
 */
function preprocess(relations: {[p:string]: any}): {filteredRelations: {[p:string]:any}; leafRelations: {[p:string]:any}} {
    const nodeFreq = {};
    for (let start in relations) {
        if (relations[start].length !== 0) {
            for (let end of relations[start]) {
                if (nodeFreq[end]) {
                    nodeFreq[end]++;
                } else {
                    nodeFreq[end] = 1;
                }
            }
        }
    }
    const leafNodes = [];
    for (let node in nodeFreq) {
        if (nodeFreq[node] === 1 && relations[node].length === 0) {
            leafNodes.push(parseInt(node))
        }
    }
    const filteredRelations = {};
    const leafRelations = {};
    for (let start in relations) {
        if (relations[start].length !== 0) {
            filteredRelations[start] = [];
            for (let end of relations[start]) {
                if (leafNodes.indexOf(end) === -1) {
                    if (filteredRelations[start]) {
                        filteredRelations[start].push(end);
                    } else {
                        filteredRelations[start] = [end];
                    }
                    if (!filteredRelations.hasOwnProperty(end)) {
                        filteredRelations[end] = [];
                    }
                } else {
                    if (leafRelations[start]) {
                        leafRelations[start].push(end);
                    } else {
                        leafRelations[start] = [end];
                    }
                }
            }
        }
    }
    return {
        filteredRelations,
        leafRelations,
    }
}

/**
 * greedy crossing reduce
 * @param relations 
 */
function reduceCrossing(relations: {[p:string]: any}) {
    const sequence = Array.prototype.concat([], Object.keys(relations).map(x => parseInt(x)));
    const degree = {};
    for (let start in relations) {
        if (relations[start].length !== 0) {
            //统计度，交换的时候交换度比较小的节点
            for (let end of relations[start]) {
                if (degree[start]) {
                    degree[start]++;
                } else {
                    degree[start] = 1;
                }
                if (degree[end]) {
                    degree[end] += 0.5;
                } else {
                    degree[end] = 0.5;
                }
            }
        }
    }
    //起始交叉点设置为正无穷
    let prevCrossing = Infinity;
    //计算每条边交叉数量的函数
    let edges = calcCrossing(sequence, relations);
    let maxCrossing = Object.keys(edges).reduce((acc, curr) => acc ? (edges[acc] < edges[curr] ? curr : acc) : curr,'');
    let currCrossing = calcSum(edges);
    //对当前布局进行了保存
    let tmpSequence = [...sequence];
    while (currCrossing < prevCrossing && currCrossing > 0) {
        let start, end;
        // 最大交点数为1 单独考虑
        if (edges[maxCrossing] === 1) {
            const crossing1 = [];
            for (let key in edges) {
                if (edges[key] === 1) {
                    crossing1.push(key.split(',').map(x => parseInt(x)));
                }
            }
            let tmp = Infinity;
            let tmpIndex = -1;
            for (let i = 0; i < crossing1.length; i++) {
                for (let id of crossing1[i]) {
                    if (degree[id] < tmp) {
                        tmpIndex = i;
                        tmp = degree[id];
                    }
                }
            }
            [start, end] = crossing1[tmpIndex];
        } else {
            [start, end] = maxCrossing.split(',').map(x => parseInt(x));
        }
        if (degree[start] < degree[end]) {
            sequence.splice(sequence.indexOf(start), 1);
            sequence.splice(sequence.indexOf(end), 0, start);
        } else {
            sequence.splice(sequence.indexOf(end), 1);
            sequence.splice(sequence.indexOf(start), 0, end);
        }
        edges = calcCrossing(sequence, relations);
        maxCrossing = Object.keys(edges).reduce((acc, curr) => acc ? (edges[acc] < edges[curr] ? curr : acc) : curr,'');
        if (currCrossing < calcSum(edges)) break;
        prevCrossing = currCrossing;
        currCrossing = calcSum(edges);
        tmpSequence = [...sequence];
    }
    return tmpSequence;
}

function calcSum(obj: {[p:string]: number}) {
    let result = 0;
    for (let key in obj) {
        result += obj[key];
    }
    return result;
}

/**
 * 计算给定序列下各边的交点数量
 * @param sequence 
 * @param relations 
 */
function calcCrossing(sequence: number[], relations: {[p: string]: any}): {[p:string]:any} {
    const edges = {};
    for (let start in relations) {
        if (relations[start].length !== 0) {
            for (let end of relations[start]) {
                edges[start + ',' + end] = 0;
            }
        }
    }
    for (let edge in edges) {
        const [u1, v1] = edge.split(',').map(x => parseInt(x));
        const u1Index = sequence.indexOf(u1);
        const v1Index = sequence.indexOf(v1);
        const startIndex = u1Index < v1Index ? u1Index : v1Index;
        const endIndex = u1Index < v1Index ? v1Index : u1Index;
        for (let otherEdge of Object.keys(edges)) {
            if (edge !== otherEdge) {
                const [u2, v2] = otherEdge.split(',').map(x => parseInt(x));
                const u2Index = sequence.indexOf(u2);
                const v2Index = sequence.indexOf(v2);
                if (
                    (whetherInRange(startIndex, endIndex, u2Index) && whetherOutRange(startIndex, endIndex, v2Index))
                    || (whetherOutRange(startIndex, endIndex, u2Index) && whetherInRange(startIndex, endIndex, v2Index))
                ) {
                    edges[edge]++;
                }
            }
        }
    }
    return edges;
}

/**
 * 计算两个圆圆心连线在两个圆上的交点
 */
export function calcLinkSourceTargetBetweenCircles(cx1, cy1, r1, cx2, cy2, r2){
    let x1 = cx1 + r1 * (cx2 - cx1) / Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
    let y1 = cy1 + r1 * (cy2 - cy1) / Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
    let x2 = cx2 - r2 * (cx2 - cx1) / Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
    let y2 = cy2 - r2 * (cy2 - cy1) / Math.sqrt((cx1 - cx2) * (cx1 - cx2) + (cy1 - cy2) * (cy1 - cy2));
    return [{'x': x1, 'y': y1}, {'x': x2, 'y': y2}];
}

/**
 * 判断给定值是否在某个范围内
 * @param start 
 * @param end 
 * @param target 
 */
function whetherInRange(start, end, target): boolean {
    return target < end && target > start;
}

function whetherOutRange(start, end, target): boolean {
    return target > end || target < start;
}

export function calcCircleLayout(
    center: {x: number; y: number;},
    radius: number,
    relations: {[p: string]: any},
    forceId?: undefined | number,
    ) {
        //判断传入的relations是否为空
    if (Object.keys(relations).length === 1 && relations[Object.keys(relations)[0]].length === 0) {
        return {
            sequence: Object.keys(relations),
            nodes: [],
            edges:[],
        }
    }
    //迭代摘出度为1的节点
    // filter stack
    const filterStack = [];
    let {filteredRelations, leafRelations} = preprocess(relations);
    while (true) {
        if (Object.keys(leafRelations).length === 0) {
            break;
        }
        if (Object.keys(filteredRelations).length === 1) {
            filterStack.push(Object.assign({}, leafRelations));
            break;
        }
        filterStack.push(Object.assign({}, leafRelations));
        let tmp = preprocess(filteredRelations);
        filteredRelations = tmp.filteredRelations;
        leafRelations = tmp.leafRelations;
    }
    //对剩余的关系进行交叉边减少
    let sequence = reduceCrossing(filteredRelations);
    console.log(sequence)
    // completing array
    const stateArr = [sequence];
    while (filterStack.length > 0) {
        const sequenceTmp = Array.of(...stateArr[stateArr.length - 1]);
        const leaves = filterStack.pop();
        for (let start in leaves) {
            for (let end of leaves[start]) {
                sequenceTmp.splice(sequenceTmp.indexOf(parseInt(start)) + 1, 0, end);
            }
        }
        stateArr.push(sequenceTmp);
    }
    sequence = stateArr[stateArr.length - 1];
    const degree = {};
    for (let start in relations) {
        if (relations[start].length !== 0) {
            for (let end of relations[start]) {
                if (degree[start]) {
                    degree[start]++;
                } else {
                    degree[start] = 1;
                }
                if (degree[end]) {
                    degree[end] ++;
                } else {
                    degree[end] = 1;
                }
            }
        }
    }
    // 当forceId未定义时，将入度为0，出度最大的点放在第一个
    if (forceId === undefined) {
        // 将入度为0 出度最大的点放在第一个
        const inDegree0 = [];
        for (let start in relations) {
            let flag = true;
            for (let other in relations) {
                if (other !== start) {
                    for (let end of relations[other]) {
                        if (parseInt(start) === end) {
                            flag = false;
                        }
                    }
                }
            }
            if (flag) {
                inDegree0.push(parseInt(start));
            }
        }
        if (inDegree0.length > 0) {
            const initNode = inDegree0.reduce((acc, curr) => acc ? (degree[acc] > degree[curr] ? acc : curr) : curr);
            const initIndex = sequence.indexOf(initNode);
            sequence = sequence.slice(initIndex).concat(sequence.slice(0, initIndex));
        }
    } else {
    // 当forceId定义时，将forceID为-1的点放在第一个
        sequence = sequence.slice(sequence.indexOf(forceId)).concat(sequence.slice(0, sequence.indexOf(forceId)));
    }
    return Object.assign({
        sequence
        },
        calcCircleLayoutWithoutReduceCrossing(
            center,
            radius,
            relations,
            sequence,
            undefined
        ));
}

// 下面这个函数是计算使用d3画图所需要的数据
export function calcCircleLayoutWithoutReduceCrossing(
    //整个圆的圆心，大圆半径，刚处理完得到的序列
    center: {x: number; y: number;},
    radius: number,
    relations: {[p: string]: any},
    sequence: number[],
    focus: number | undefined
): {nodes: any[], edges: any[]} {
   if (focus === undefined) {
       // 得到序列长度，就是有多少个簇
       const count = sequence.length;
       // 簇这个圆的半径
       const r = 0.8 * radius * Math.sin(Math.PI / count) / (1 + Math.sin(Math.PI / count));
       const angle = Math.PI * 2 / count;
       const nodes = [];
       const edges = [];
       const node2position = {};
       for (let i = 0; i < count; i++) {
           //计算出每个簇圆的圆心
           const tmp = {
               r,
               id: sequence[i],
               cx: center.x + (radius - r) * Math.sin(angle * i),
               cy: center.y - (radius - r) * Math.cos(angle * i),
           };
           node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
           nodes.push(tmp);
       }
       for (let start in relations) {
           if (relations[start].length !== 0) {
               for (let end of relations[start]) {
                   const tmp = {
                       start: parseInt(start),
                       end: parseInt(end),
                       path: calcLinkSourceTargetBetweenCircles(
                           node2position[start][0],
                           node2position[start][1],
                           node2position[start][2],
                           node2position[end][0],
                           node2position[end][1],
                           node2position[end][2]),
                   };
                   edges.push(tmp);
               }
           }
       }
       return {
           nodes,
           edges,
       }
   } else {
       const count = sequence.length;
       const r = 0.8 * radius * Math.sin(Math.PI / (count + 1)) / (1 + Math.sin(Math.PI / (count + 1)));
       const R = 1.6 * radius * Math.sin(Math.PI / (count + 1)) / (1 + Math.sin(Math.PI / (count + 1)));
       const angle = Math.PI * 2 / (count + 1);
       const nodes = [];
       const edges = [];
       const node2position = {};
       for (let i = 0; i < count; i++) {
           if (sequence.indexOf(focus) > i) {
               const tmp = {
                   r,
                   id: sequence[i],
                   cx: center.x + (radius - r) * Math.sin(angle * i),
                   cy: center.y - (radius - r) * Math.cos(angle * i),
               };
               node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
               nodes.push(tmp);
           } else if (sequence.indexOf(focus) === i) {
               const tmp = {
                   r: R,
                   id: sequence[i],
                   cx: center.x + (radius - R) * Math.sin(angle * i + angle / 2),
                   cy: center.y - (radius - R) * Math.cos(angle * i + angle / 2),
               };
               node2position[sequence[i]] = [tmp.cx, tmp.cy, R];
               nodes.push(tmp);
           } else {
               const tmp = {
                   r,
                   id: sequence[i],
                   cx: center.x + (radius - r) * Math.sin(angle * i + angle),
                   cy: center.y - (radius - r) * Math.cos(angle * i + angle),
               };
               node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
               nodes.push(tmp);
           }

       }
       for (let start in relations) {
           if (relations[start].length !== 0) {
               for (let end of relations[start]) {
                   const tmp = {
                       start: parseInt(start),
                       end: parseInt(end),
                       path: calcLinkSourceTargetBetweenCircles(
                           node2position[start][0],
                           node2position[start][1],
                           node2position[start][2],
                           node2position[end][0],
                           node2position[end][1],
                           node2position[end][2]),
                   };
                   edges.push(tmp);
               }
           }
       }
       return {
           nodes,
           edges,
       }
   }
}
// 二级焦点，在画布中间画一个大圆，圆心是整个画布的圆心
export function calcCircleLayoutSecondLayer(
    center: {x: number; y: number},
    radius: number,
    relations: {[p:string]:any},
    sequence: number[],
    focus: number,
) {
    const count = sequence.length;
    // 将半径缩小为原来的0.4倍
    // 首先算出外面缩小的每个簇的坐标
    const r = 0.4 * radius * Math.sin(Math.PI / (count + 1)) / (1 + Math.sin(Math.PI / (count + 1)));
    const angle = Math.PI * 2 / (count + 1);
    const nodes = [];
    const edges = [];
    const node2position = {};
    for (let i = 0; i < count; i++) {
        if (sequence.indexOf(focus) > i) {
            const tmp = {
                r,
                id: sequence[i],
                cx: center.x + (radius - r) * Math.sin(angle * i),
                cy: center.y - (radius - r) * Math.cos(angle * i),
            };
            node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
            nodes.push(tmp);
        }
        // 如果是焦点的话，这个是计算大圆的圆心以及半径的 
        else if (sequence.indexOf(focus) === i) {
            const tmp = {
                r: 0.9 * ( radius - 2 * r ),
                id: sequence[i],
                cx: center.x,
                cy: center.y,
            };
            node2position[sequence[i]] = [tmp.cx, tmp.cy, tmp.r];
            nodes.push(tmp);
        } else {
            const tmp = {
                r,
                id: sequence[i],
                cx: center.x + (radius - r) * Math.sin(angle * i + angle),
                cy: center.y - (radius - r) * Math.cos(angle * i + angle),
            };
            node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
            nodes.push(tmp);
        }

    }
    return {
        nodes,
        edges,
    }
}

export function calcCircleLayoutSecondLayer1(
    center: {x: number; y: number},
    radius: number,
    relations: {[p:string]:any},
    sequence: number[],
    focus: number,
) {
    const count = sequence.length;
    // 将半径缩小为原来的0.4倍
    // 首先算出外面缩小的每个簇的坐标
    const r = 0.4 * radius * Math.sin(Math.PI / (count + 1)) / (1 + Math.sin(Math.PI / (count + 1)));
    const angle = Math.PI * 2 / (count + 1);
    const nodes = [];
    let num = count/2;
    const edges = [];
    const node2position = {};

    // 计算上半部分小圆的位置
    for (let i = 0; i < count; i++) {
        // 如果是焦点的话，这个是计算大圆的圆心以及半径的 
        if (sequence.indexOf(focus) === i) {
            
            const tmp = {
                r:  radius ,
                //r: radius,
                id: sequence[i],
                cx: center.x,
                cy: center.y,
            };
            node2position[sequence[i]] = [tmp.cx, tmp.cy, tmp.r];
            nodes.push(tmp);
        } else {
            if(i < num){
                const tmp = {
                    r,
                    id: sequence[i],
                    cx: center.x - radius +  (2*i+1)*r  +   ((2 * radius) / (num*2-0.01)) * (i),
                    cy: center.y - (radius - r),
    
                };
                node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
               // nodes.push(tmp);
            }
            else{
                const tmp = {
                    r,
                    id: sequence[i],
                    cx: center.x - radius +  (2*(i-num-1)+1)*r  +   ((2 * radius) / (num*2-0.01)) * (i-num),  
                    cy: center.y + (radius - r),
                   
                };
                node2position[sequence[i]] = [tmp.cx, tmp.cy, r];
               // nodes.push(tmp);
            }
        }
        
    }
    
    return {
        nodes,
        edges,
    }
}
// 计算选中的簇与其他簇之间的边，这个需要的数据是跨簇的数据
export function calcEdgeWithSelectedNode(
    center: {x: number; y: number},
    radius: number,
    relations: {[p:string]:any},
    nodes: {
       r: number;
       id: number;
       cx: number;
        cy: number;
    }[],
    focus: number,
) {
    const neighbours = [];
    for (let start in relations) {
        if (relations[start].length !== 0) {
            if (relations[start].indexOf(focus) !== -1){
                neighbours.push(parseInt(start));
            }
        }
    }
    const edges = [];
    for (let end of neighbours) {
        const n = nodes.filter(x => x.id === end)[0];
        edges.push(calcLinkSourceTargetBetweenRectAndCircle(
            center.x,
            center.y,
            radius,
            n.cx,
            n.cy,
            n.r,
            false,
        ));
    }
    for (let end of relations[focus]) {
        const n = nodes.filter(x => x.id === end)[0];
        edges.push(calcLinkSourceTargetBetweenRectAndCircle(
            center.x,
            center.y,
            radius,
            n.cx,
            n.cy,
            n.r,
            true,
        ));
    }
    return edges;
}

export function calcLinkSourceTargetBetweenRectAndCircle(
   cx1: number,
   cy1: number,
   r1: number,
   cx2: number,
   cy2: number,
   r2: number,
   direction: boolean
) {
    const width = (r1 - 2 * r2) / 5 * 3;
    const height = (r1 - 2 * r2) / 5 * 4;
    let x1, x2, y1, y2;
    if (cx1 < cx2 && Math.abs((cy1 - cy2)/(cx1 - cx2)) <= 0.8) {
        x1 = cx1 + width;
        y1 = cy1 - (cy1 - cy2) / (cx2 - cx1) * width;
        x2 = cx1 + (cx2 - cx1) / (r1 - r2) * (r1 - 2 * r2);
        y2 = cy1 - (cy1 - cy2) / (r1 - r2) * (r1 - 2 * r2);
    } else if (cx1 > cx2 && Math.abs((cy1 - cy2)/(cx1 - cx2)) <= 0.8) {
        x1 = cx1 - width;
        y1 = cy1 - (cy1 - cy2) / (cx1 - cx2) * width;
        x2 = cx1 - (cx1 - cx2) / (r1 - r2) * (r1 - 2 * r2);
        y2 = cy1 - (cy1 - cy2) / (r1 - r2) * (r1 - 2 * r2);
    } else if (cx1 < cx2 && Math.abs((cy1 - cy2)/(cx1 - cx2)) > 0.8) {
        if (cy1 < cy2) {
            y1 = cy1 + height;
            x1 = cx1 + height / (cy2 - cy1) * (cx2 - cx1);
            x2 = cx1 + (cx2 - cx1) / (r1 - r2) * (r1 -2 * r2);
            y2 = cy1 + (cy2 - cy1) / (r1 - r2) * (r1 -2 * r2);
        } else {
            y1 = cy1 - height;
            x1 = cx1 + height / (cy1 - cy2) * (cx2 - cx1);
            x2 = cx1 + (cx2 - cx1) / (r1 - r2) * (r1 -2 * r2);
            y2 = cy1 - (cy1 - cy2) / (r1 - r2) * (r1 -2 * r2);
        }
    } else if (cx1 > cx2 && Math.abs((cy1 - cy2)/(cx1 - cx2)) > 0.8) {
        if (cy1 < cy2) {
            y1 = cy1 + height;
            x1 = cx1 - height / (cy2 - cy1) * (cx1 - cx2);
            x2 = cx1 - (cx1 - cx2) / (r1 - r2) * (r1 -2 * r2);
            y2 = cy1 + (cy2 - cy1) / (r1 - r2) * (r1 -2 * r2);
        } else {
            y1 = cy1 - height;
            x1 = cx1 - height / (cy1 - cy2) * (cx1 - cx2);
            x2 = cx1 - (cx1 - cx2) / (r1 - r2) * (r1 -2 * r2);
            y2 = cy1 - (cy1 - cy2) / (r1 - r2) * (r1 -2 * r2);
        }
    } else {
        x1 = cx1;
        x2 = cx1;
        if (cy1 < cy2) {
            y1 = cy1 + height;
            y2 = cy1 + r1 - 2 * r2;
        } else {
            y1 = cy1 - height;
            y2 = cy1 - r1 + 2 * r2;
        }
    }
    if (direction) {
        return [{'x': x1, 'y': y1}, {'x': x2, 'y': y2}];
    } else {
        return [{'x': x2, 'y': y2}, {'x': x1, 'y': y1}];
    }

}

export function calcEdgeWithSelectedNodeCrossCom(
    center: {x: number; y: number},
    radius: number,
    focus: number,
    relationCrossCommunity,
    topicId2Community,
    coms
) {
    const edges = [];
    for (let edge of relationCrossCommunity) {
        if (edge[0] === focus) {
            if (edges.filter(x => x.end === topicId2Community[edge[1]]).length > 0) {
                for (let e of edges) {
                    if (e.end === topicId2Community[edge[1]]) {
                        e.topics.push(edge[1]);
                    }
                }
            } else {
                const com = coms.filter(x => x.id === topicId2Community[edge[1]])[0];
                edges.push({
                    start: topicId2Community[focus],
                    end: topicId2Community[edge[1]],
                    topics: [edge[1]],
                    path: calcLinkSourceTargetBetweenCircles(
                        center.x,
                        center.y,
                        radius,
                        com.cx,
                        com.cy,
                        com.r
                    ),
                });
            }
        }
        if (edge[1] === focus) {
            if (edges.filter(x => x.start === topicId2Community[edge[0]]).length > 0) {
                for (let e of edges) {
                    if (e.start === topicId2Community[edge[0]]) {
                        e.topics.push(edge[0]);
                    }
                }
            } else {
                const com = coms.filter(x => x.id === topicId2Community[edge[0]])[0];
                edges.push({
                    start: topicId2Community[edge[0]],
                    end: topicId2Community[focus],
                    topics: [edge[0]],
                    path: calcLinkSourceTargetBetweenCircles(
                        com.cx,
                        com.cy,
                        com.r,
                        center.x,
                        center.y,
                        radius,
                    ),
                });
            }
        }
    }
    return edges;
}

export function calcEdgeWithSelectedComCrossCom(
    id: number,
    communityRelation,
    nodes,
) {
    const relations = [];
    for (let key in communityRelation) {
        if (parseInt(key) === id) {
            for (let com of communityRelation[key]) {
                relations.push([id, com]);
            }
        } else {
            for (let com of communityRelation[key]) {
                if (com === id) {
                    relations.push([parseInt(key), id]);
                }
            }
        }
    }
    const paths = [];
    for (let relation of relations) {
        const start = nodes.filter(x => x.id === relation[0])[0];
        const end = nodes.filter(x => x.id === relation[1])[0];
        paths.push({
            start: relation[0],
            end: relation[1],
            path: calcLinkSourceTargetBetweenCircles(
                start.cx,
                start.cy,
                start.r,
                end.cx,
                end.cy,
                end.r
            ),
        });
    }
    return paths;
}

export function calNodeWithSelectedInComCrossCom(
    id: number,
    communityRelation,
    graph,
) {
    const Incom = [];
    const Outcom = [];
    for (let key in communityRelation) {
        if (parseInt(key) === id) {
            for (let com of communityRelation[key]) {
                Outcom.push([com,graph[com]]);
            }
        } else {
            for (let com of communityRelation[key]) {
                if (com === id) {
                    Incom.push([parseInt(key),graph[parseInt(key)]]);
                }
            }
        }
    }
    return Incom;
}
export function calNodeWithSelectedInTopicCrossCom(
    id1: number,//簇的id
    id2:number,//主题的id
    graph,
    topics,
) {
    const Incom = [];
    const Outcom = [];
    for (let key in graph[id1]) {
        if (parseInt(key) === id2) {
            for (let com of graph[id1][key]) {
                Outcom.push([com,topics[com]]);
            }
        } else {
            for (let com of graph[id1][key]) {
                if (com === id2) {
                    Incom.push([parseInt(key),topics[parseInt(key)]]);
                }
            }
        }
    }
    console.log("InTopic",Incom);
    console.log("OutTopic",Outcom);
    return Incom;
}
export function calNodeWithSelecteOutTopicCrossCom(
    id1: number,//簇的id
    id2:number,//主题的id
    graph,
    topics,
) {
    const Incom = [];
    const Outcom = [];
    for (let key in graph[id1]) {
        if (parseInt(key) === id2) {
            for (let com of graph[id1][key]) {
                Outcom.push([com,topics[com]]);
            }
        } else {
            for (let com of graph[id1][key]) {
                if (com === id2) {
                    Incom.push([parseInt(key),topics[parseInt(key)]]);
                }
            }
        }
    }
   
    return Outcom;
}
export function calNodeWithSelectedOutComCrossCom(
    id: number,
    communityRelation,
    graph,
) {
    
    const Outcom = [];
    for (let key in communityRelation) {
        if (parseInt(key) === id) {
            for (let com of communityRelation[key]) {
                Outcom.push([com,graph[com]]);
            }
        } 
    }
    
    return Outcom;
}