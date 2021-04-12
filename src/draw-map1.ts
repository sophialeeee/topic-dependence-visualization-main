// import * as d3 from 'd3';
// import axios from 'axios';
// import { presetPalettes } from '@ant-design/colors';
// import { drawTree } from 'facet-tree-visualization';

// import {
//     calcCircleLayout,
//     calcCircleLayoutSecondLayer,
//     calcCircleLayoutWithoutReduceCrossing,
//     calcEdgeWithSelectedNode, calcEdgeWithSelectedNodeCrossCom,
//     calcEdgeWithSelectedComCrossCom,
//     calcLinkSourceTargetBetweenCircles
// } from "./circle-layout";

// const colors = [];
// for (let key in presetPalettes) {
//     colors.push(presetPalettes[key].slice(0, 10));
// }

// export interface MapData {
//     topics: {[p:string]: string},
//     resultRelations: {[p:string]: number[]};
//     graph: {[p: string]: {
//         [p:string]: number[]
//     }};
//     topicId2Community: {[p:string]: number};
//     relationCrossCommunity: [number, number][];
//     communityRelation: {[p: string]: number[]}
// }

// //画线的代码，用来生成d3画线需要的数据
// export const link: any = d3.line()
//     // @ts-ignore
//     .x(function (d) { return d.x })
//     // @ts-ignore
//     .y(function (d) { return d.y })
//     .curve(d3.curveCatmullRom.alpha(0.5));

// export async function drawMap(
//     mapData: MapData,//后端返回的数据
//     svg: HTMLElement,//画整张图需要的svg
//     treeSvg: HTMLElement,//画分面树需要的svg,是通过css设置浮在上面的，其宽高是根据主题个数计算的
//     domainName: string,
//     learningPath: number[] = [],//这个是后期用到的，也不用传
//     clickTopic,//点击主题时的回调函数
//     clickFacet,//点击分面时的回调函数
// ) {
//     let {
//         topics,
//         graph,
//         topicId2Community,
//         relationCrossCommunity,
//         communityRelation,
//     } = mapData;
//     console.log("mapData",mapData);
//     let layer = 0;
//     const canvas = d3.select(svg);//整个认知关系的画布
//     //用来显示画簇的认知关系，鼠标附上去会显示簇
//     const divTooltip = d3.select('body').append('div')
//         .style('position', 'absolute')
//         .style('opacity', 0)
//         .style('text-align', 'center')
//         .style('font-size', '6px')
//         .style('background-color', '#ffffb8')
//         .style('padding', '1px 3px')
//         .style('top', 0);
//     //用来画箭头，设置箭头模板，是用Id来控制的
//     const defs = canvas.append("defs");
//     const arrow = defs.append("marker")
//         .attr("id", "arrow")
//         .attr("markerUnits", "strokeWidth")
//         .attr("markerWidth", "6")
//         .attr("markerHeight", "6")
//         .attr("viewBox", "0 0 12 12")
//         .attr("refX", "6")
//         .attr("refY", "6")
//         .attr("orient", "auto");
//     const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
//     arrow.append("path")
//         .attr("d", arrow_path)
//         .attr("fill", '#873800');
//     for (let i = 0; i < colors.length; i++) {
//         const arrowMarker = defs.append("marker")
//             .attr("id", "arrow" + i)
//             .attr("markerUnits", "strokeWidth")
//             .attr("markerWidth", "8")
//             .attr("markerHeight", "8")
//             .attr("viewBox", "0 0 12 12")
//             .attr("refX", "6")
//             .attr("refY", "6")
//             .attr("orient", "auto");
//         const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
//         arrowMarker.append("path")
//             .attr("d", arrow_path)
//             .attr("fill", colors[i][9]);
//     }
    
//     for (let key in graph) {
//         graph[key] = completeObj(graph[key]);
//     }
//     // 补全键名，键名是所有的topic_id
//     communityRelation = completeObj(communityRelation);
//     const radius = svg.clientHeight < svg.clientWidth ? svg.clientHeight / 2 - 24 : svg.clientWidth / 2 - 24;
    
//     // 处理只有一个簇的情况
//     if(communityRelation === {}){

//        const nodes0 = {r:radius,id:0,cx:radius,cy:radius}
//        const edges0 = {}
//        const sequence0 = [0]
//         //globalSequence是簇之间的序列关系
//     const globalSequence0 = sequence0;
//     const sequences0 = {};
//     //zoom是用来控制在第几层焦点
//     const zoom = {
//         com: undefined,
//         topicId: undefined,
//     };
//     // 绘制知识簇
//     canvas.append('g')
//         .attr('id', 'com')
//         .selectAll('circle')
//         .append('circle')
//         .attr('r', radius)
//         .attr('cx',radius)
//         .attr('cy', radius)
//         .attr('id', d => 'com' + 0)
//         .attr('fill', (d, i) => colors[i % colors.length][1]);
//     let nodePositions = {};
//     // 绘制簇内信息
       
//     const tmp = calcCircleLayout(
//             { x: radius, y: radius },
//             radius,
//             graph[0],
//             0
//         );
//         for (let node of tmp.nodes) {
//             nodePositions[node.id] = node;
//         }
//         sequences0[0] = tmp.sequence;
//         canvas.append('g')
//             .attr('id', 0 + 'edges')
//             .selectAll('path')
//             .data(tmp.edges)
//             .enter()
//             .append('path')
//             .attr('d', d => link(d.path))
//             .attr('stroke', colors[globalSequence0.indexOf(0) % colors.length][8])
//             .attr('stroke-width', 2)
//             .attr('fill', 'none')
//             .attr('marker-end', 'url(#arrow' + globalSequence0.indexOf(0) + ')')
//             .style('visibility', learningPath.length !== 0 ? 'hidden' : 'visible');
//         canvas.append('g')
//             .attr('id', 0 + 'nodes')
//             .selectAll('circle')
//             .data(tmp.nodes)
//             .enter()
//             .append('circle')
//             .attr('r', d => d.r)
//             .attr('cx', d => d.cx)
//             .attr('cy', d => d.cy)
//             .attr('id', d => d.id)
//             .attr('fill', colors[globalSequence0.indexOf(0) % colors.length][6]);
//         canvas.append('g')
//             .attr('id', 0 + 'text')
//             .selectAll('text')
//             .data(tmp.nodes)
//             .enter()
//             .append('text')
//             .attr('font-size', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                 if (tmp > 24) {
//                     return 24;
//                 } else {
//                     return tmp;
//                 }
//             })
//             .attr('x', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                 if (tmp > 24) {
//                     return d.cx - 12 * judgementStringLengthWithChinese(topics[d.id]);
//                 } else {
//                     return d.cx - tmp / 2 * judgementStringLengthWithChinese(topics[d.id]);
//                 }
//             })
//             .attr('y', d => d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]))
//             .text(d => topics[d.id])
//             .attr('fill', '#ffffff')
//             .attr('cursor', 'pointer');
    
    
//     // 绘制认知路径
//     if (learningPath.length !== 0) {
//         let paths = [];
//         for (let i = 0; i < learningPath.length - 1; i++) {
//             paths.push([learningPath[i], learningPath[i + 1]]);
//         }
//         canvas.append('g')
//             .attr('id', 'learningPaths')
//             .selectAll('path')
//             .data(paths)
//             .enter()
//             .append('path')
//             .attr('d', d => {
//                 return link(calcLinkSourceTargetBetweenCircles(
//                     nodePositions[d[0]].cx,
//                     nodePositions[d[0]].cy,
//                     nodePositions[d[0]].r,
//                     nodePositions[d[1]].cx,
//                     nodePositions[d[1]].cy,
//                     nodePositions[d[1]].r,
//                 ))
//             })
//             .attr('stroke', '#873800')
//             .attr('stroke-width', 2)
//             .attr('fill', 'none')
//             .style('cursor', 'pointer')
//             .attr('marker-end', 'url(#arrow)');
//     }
//     // 交互
   
//     // 获取到每个簇的节点，这个获取的是一整个簇的g元素
//     const nElement = document.getElementById(0 + 'nodes');
//         // 给这个元素加上两个监听
//     d3.select(nElement)
//       .selectAll('circle')
//       .on('click', (d: any) => clickNode(d, 0));
//     const tElement = document.getElementById(0 + 'text');
//     d3.select(tElement)
//             .selectAll('text')
//             .on('click', (d: any) => clickNode(d, 0));
    
//     // 下面这个是点击整个大圆时的交互
//     canvas.select('#com')
//         .selectAll('circle')
//         .on('click', d => clickCom(d));
//     //点击簇名时的交互
//     canvas.select('#comText')
//         .selectAll('text')
//         .on('click', d => clickCom(d));
    
//     }
//     // 画外面的大圆
 
//     //整张大圆的圆心、半径、簇和簇之间认知关系的数据
//     //判断有没有起始簇，入度为0的点只有一个的话就不需要加上开始，如果有多个入度为0的点则需要加上一个开始节点？？不是这个意思
//     //使得入度为0的点放在每一个圆的12.方向
//     //得到sequence,点的数据和边的数据
//     else{
       
//         const {nodes, edges, sequence } = calcCircleLayout(
//             { x: radius, y: radius },
//             radius,
//             communityRelation,
//             topicId2Community[-1] !== undefined ? topicId2Community[-1] : undefined
//         );
//         //globalSequence是簇之间的序列关系
//     const globalSequence = sequence;
//     const sequences = {};
//     //zoom是用来控制在第几层焦点
//     const zoom = {
//         com: undefined,
//         topicId: undefined,
//     };

//     // 绘制簇间认知关系，簇之间的认知关系都绘制在同一个g元素中
//     canvas.append('g')
//         .attr('id', 'com2com')
//         .selectAll('path')
//         .data(edges)//簇之间的边
//         .enter()
//         .append('path')
//         .attr('d', d => link(d.path))//起始和终止节点
//         .attr('stroke', '#873800')
//         .attr('stroke-width', 4)
//         .attr('fill', 'none')
//         .style('cursor', 'pointer')//鼠标移上去是指针的样子
//         .style('visibility', learningPath.length !== 0 ? 'hidden' : 'visible')//簇之间的认知关系是否显示
//         .on('mouseover', d => {
//             //一个交互，鼠标移上去会显示跨簇的认知关系
//             let topic = '';
//             for (let edge of relationCrossCommunity) {
//                 if (topicId2Community[edge[0]] === d.start && topicId2Community[edge[1]] === d.end) {
//                     topic += topics[edge[0]] + '->' + topics[edge[1]] + '\n';
//                 }
//             }
//             divTooltip.transition()
//                 .duration(200)
//                 .style("opacity", .9);
//             divTooltip.html(topic.trim())
//                 .style("left", (d3.event.pageX) + "px")
//                 .style("top", (d3.event.pageY - 28) + "px");
//         })
//         .on("mouseout", function (d) {
//             divTooltip.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//                 //移出去之后，透明度变成0了
//         })
//         //加上箭头模板
//         .attr('marker-end', 'url(#arrow)');
//     // 绘制知识簇
//     canvas.append('g')
//         .attr('id', 'com')
//         .selectAll('circle')
//         .data(nodes)
//         .enter()
//         .append('circle')
//         .attr('r', d => d.r)
//         .attr('cx', d => d.cx)
//         .attr('cy', d => d.cy)
//         .attr('id', d => 'com' + d.id)
//         .attr('fill', (d, i) => colors[i % colors.length][1]);
//     let nodePositions = {};
//     // 绘制簇内信息
//     for (let com of nodes) {
//         console.log("graph[com.id]",graph[com.id])
//         // 计算簇内布局
//         const tmp = calcCircleLayout(
//             { x: com.cx, y: com.cy },
//             com.r,
//             graph[com.id],
//             com.id === topicId2Community[-1] ? -1 : undefined
//         );
//         for (let node of tmp.nodes) {
//             nodePositions[node.id] = node;
//         }
//         sequences[com.id] = tmp.sequence;
//         canvas.append('g')
//             .attr('id', com.id + 'edges')
//             .selectAll('path')
//             .data(tmp.edges)
//             .enter()
//             .append('path')
//             .attr('d', d => link(d.path))
//             .attr('stroke', colors[globalSequence.indexOf(com.id) % colors.length][8])
//             .attr('stroke-width', 2)
//             .attr('fill', 'none')
//             .attr('marker-end', 'url(#arrow' + globalSequence.indexOf(com.id) + ')')
//             .style('visibility', learningPath.length !== 0 ? 'hidden' : 'visible');
//         canvas.append('g')
//             .attr('id', com.id + 'nodes')
//             .selectAll('circle')
//             .data(tmp.nodes)
//             .enter()
//             .append('circle')
//             .attr('r', d => d.r)
//             .attr('cx', d => d.cx)
//             .attr('cy', d => d.cy)
//             .attr('id', d => d.id)
//             .attr('fill', colors[globalSequence.indexOf(com.id) % colors.length][6]);
//         canvas.append('g')
//             .attr('id', com.id + 'text')
//             .selectAll('text')
//             .data(tmp.nodes)
//             .enter()
//             .append('text')
//             .attr('font-size', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                 if (tmp > 24) {
//                     return 24;
//                 } else {
//                     return tmp;
//                 }
//             })
//             .attr('x', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                 if (tmp > 24) {
//                     return d.cx - 12 * judgementStringLengthWithChinese(topics[d.id]);
//                 } else {
//                     return d.cx - tmp / 2 * judgementStringLengthWithChinese(topics[d.id]);
//                 }
//             })
//             .attr('y', d => d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]))
//             .text(d => topics[d.id])
//             .attr('fill', '#ffffff')
//             .attr('cursor', 'pointer');
//     }
//     canvas.append('g')
//         .attr('id', 'comText')
//         .selectAll('text')
//         .data(nodes)
//         .enter()
//         .append('text')
//         .attr('font-size', 14)
//         .attr('x', d => d.cx - 14 * judgementStringLengthWithChinese(topics[sequences[d.id][0]]) / 2)
//         .attr('y', (d, i) => {
//             if (nodes[i].cy < radius) return d.cy - d.r - 24;
//             return d.cy + d.r + 24;
//         })
//         .text(d => topics[sequences[d.id][0]])
//         .attr('fill', '#000000')
//         .attr('cursor', 'pointer');
//     // 绘制认知路径
//     if (learningPath.length !== 0) {
//         let paths = [];
//         for (let i = 0; i < learningPath.length - 1; i++) {
//             paths.push([learningPath[i], learningPath[i + 1]]);
//         }
//         canvas.append('g')
//             .attr('id', 'learningPaths')
//             .selectAll('path')
//             .data(paths)
//             .enter()
//             .append('path')
//             .attr('d', d => {
//                 return link(calcLinkSourceTargetBetweenCircles(
//                     nodePositions[d[0]].cx,
//                     nodePositions[d[0]].cy,
//                     nodePositions[d[0]].r,
//                     nodePositions[d[1]].cx,
//                     nodePositions[d[1]].cy,
//                     nodePositions[d[1]].r,
//                 ))
//             })
//             .attr('stroke', '#873800')
//             .attr('stroke-width', 2)
//             .attr('fill', 'none')
//             .style('cursor', 'pointer')
//             .attr('marker-end', 'url(#arrow)');
//     }
//     // 交互
//     for (let com of nodes) {
//         // 获取到每个簇的节点，这个获取的是一整个簇的g元素
//         const nElement = document.getElementById(com.id + 'nodes');
//         // 给这个元素加上两个监听
//         d3.select(nElement)
//             .selectAll('circle')
//             .on('click', (d: any) => clickNode(d, com));
//         const tElement = document.getElementById(com.id + 'text');
//         d3.select(tElement)
//             .selectAll('text')
//             .on('click', (d: any) => clickNode(d, com));
//     }
//     // 下面这个是点击整个大圆时的交互
//     canvas.select('#com')
//         .selectAll('circle')
//         .on('click', d => clickCom(d));
//     //点击簇名时的交互
//     canvas.select('#comText')
//         .selectAll('text')
//         .on('click', d => clickCom(d));
//     // 点击簇时的交互逻辑
//     }
//     function clickCom(d: any) {
//         // 每次交互时的一个初始化操作
//         // 把特殊情况的边删掉
//         // 把画簇的svg隐藏起来
//         d3.select('#edgeWithTopicInCom').remove();
//         d3.select('#edgeWithTopicCrossCom').remove();
//         d3.select('#comPaths').remove();
//         d3.select('#inComPaths').remove();
//         d3.select('#learningPaths')
//             .selectAll('path')
//             .style('visibility', 'hidden');
//         treeSvg.style.visibility = 'hidden';
//         // 判断在哪一层
//         // 第0层是知识簇的一级状态
//         switch (layer) {
//             case 0:
//                 comFirst(d.id);
//                 layer = 1;
//                 break;
//             case 1:
//                 // 一级焦点下，点击相同簇会进入第二层
//                 if (zoom.com === d.id) {
//                     layer = 2;
//                     comSecond(d.id);
//                 } else {
//                     //点击其他还是回到一级焦点
//                     comFirst(d.id);
//                 }
//                 break;
//             case 2:
//                 comFirst(d.id);
//                 layer = 1;
//                 break;
//             case 3:
//                 if (zoom.com === d.id) {
//                     comSecond(d.id);
//                     layer = 2;
//                 } else {
//                     comFirst(d.id);
//                     layer = 1;
//                 }
//                 break;
//         }
//         zoom.com = d.id;
//     }
    
    

//     /**
//      * 知识簇第一种形态
//      * id: 选中知识簇id
//      */
//     function comFirst(id) {
//         // 传入的是那个知识簇的id
//         // 调用函数计算每个簇的圆心和半径
//         const { nodes, edges } = calcCircleLayoutWithoutReduceCrossing(
//             { x: radius, y: radius },
//             radius,
//             communityRelation,
//             globalSequence,
//             id// focus id,对这个簇分比其他簇更大的圆心角
//         );
//         // 使用d3画知识簇
//         canvas.select('#com')
//             .selectAll('circle')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('r', d => d.r)
//             .attr('cx', d => d.cx)
//             .attr('cy', d => d.cy)
//             .attr('display', 'inline');
//         canvas.select('#com2com')
//             .selectAll('path')
//             .data(edges)
//             .transition()
//             .delay(300)
//             .attr('d', d => link(d.path))
//             .attr('display', 'inline')
//             .style('visibility', learningPath.length !== 0 ? 'hidden' : 'visible');
//         canvas.select('#comText')
//             .selectAll('text')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('x', d => d.cx - 14 * judgementStringLengthWithChinese(topics[sequences[d.id][0]]) / 2)
//             .attr('y', (d, i) => {
//                 if (nodes[i].cy < radius) return d.cy - d.r - 24;
//                 return d.cy + d.r + 24;
//             })
//             .attr('font-size', 14)
//             .attr('display', 'inline');
//         for (let com of nodes) {
//             const tmp = calcCircleLayoutWithoutReduceCrossing(
//                 { x: com.cx, y: com.cy },
//                 com.r,
//                 graph[com.id],
//                 sequences[com.id],
//                 undefined
//             );
//             for (let node of tmp.nodes) {
//                 nodePositions[node.id] = node;
//             }
//             const nodeElement = document.getElementById(com.id + 'nodes');
//             d3.select(nodeElement)
//                 .selectAll('circle')
//                 .data(tmp.nodes)
//                 .transition()
//                 .delay(300)
//                 .attr('r', d => d.r)
//                 .attr('cx', d => d.cx)
//                 .attr('cy', d => d.cy)
//                 .attr('id', d => d.id)
//                 .attr('display', 'inline');
//             const edgeElement = document.getElementById(com.id + 'edges');
//             d3.select(edgeElement)
//                 .selectAll('path')
//                 .data(tmp.edges)
//                 .transition()
//                 .delay(300)
//                 .attr('d', d => link(d.path))
//                 .attr('stroke-width', 2)
//                 .attr('fill', 'none')
//                 .attr('display', 'inline')
//                 .style('visibility', learningPath.length !== 0 ? 'hidden' : 'visible');
//             const textElement = document.getElementById(com.id + 'text');
//             d3.select(textElement)
//                 .selectAll('text')
//                 .data(tmp.nodes)
//                 .transition()
//                 .delay(300)
//                 .attr('font-size', d => {
//                     const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                     if (tmp > 24) {
//                         return 24;
//                     } else {
//                         return tmp;
//                     }
//                 })
//                 .attr('x', d => {
//                     const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                     return d.cx - judgementStringLengthWithChinese(topics[d.id]) * (tmp > 24 ? 12 : tmp / 2);
//                 })
//                 .attr('y', d => {
//                     const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                     if (tmp > 24) {
//                         return d.cy + 12;
//                     } else {
//                         return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]);
//                     }
//                 })
//                 .text(d => topics[d.id])
//                 .attr('fill', '#ffffff')
//                 .attr('display', 'inline');
//         }
//         // 绘制认知路径
//         if (learningPath.length !== 0) {
//             let paths = [];
//             for (let i = 0; i < learningPath.length - 1; i++) {
//                 paths.push([learningPath[i], learningPath[i + 1]]);
//             }
//             canvas.select('#learningPaths')
//                 .selectAll('path')
//                 .data(paths)
//                 .transition()
//                 .delay(300)
//                 .style('visibility', 'visible')
//                 .attr('d', d => {
//                     return link(calcLinkSourceTargetBetweenCircles(
//                         nodePositions[d[0]].cx,
//                         nodePositions[d[0]].cy,
//                         nodePositions[d[0]].r,
//                         nodePositions[d[1]].cx,
//                         nodePositions[d[1]].cy,
//                         nodePositions[d[1]].r,
//                     ))
//                 });
//         }
//     }

//     /**
//      * 知识簇第二种形态
//      * @param id
//      */
//     function comSecond(id) {
//         const { nodes, edges } = calcCircleLayoutSecondLayer(
//             { x: radius, y: radius },
//             radius,
//             communityRelation,
//             globalSequence,
//             id
//         );
//         // 这个是计算比较特殊的边，即这个选中的簇与其他簇之间的边
//         const paths = calcEdgeWithSelectedComCrossCom(
//             id,
//             communityRelation,
//             nodes
//         );
//         canvas.select('#com')
//             .selectAll('circle')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('r', d => d.r)
//             .attr('cx', d => d.cx)
//             .attr('cy', d => d.cy);
//         // 显示与二级焦点知识簇相关的簇间认知关系
//         canvas.select('#com2com')
//             .selectAll('path')
//             .attr('display', 'none');
//         canvas.select('#com2com')
//             .selectAll('path')
//             .data(paths)
//             .attr('d', d => link(d.path))
//             .attr('display', 'inline');
//         canvas.select('#comText')
//             .selectAll('text')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('x', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                 return d.cx - judgementStringLengthWithChinese(topics[sequences[d.id][0]]) * (tmp > 24 ? 12 : tmp / 2);
//             })
//             .attr('y', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                 if (tmp > 24) {
//                     return d.cy + 12;
//                 }
//                 return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//             })
//             .attr('font-size', d => {
//                 if (d.id === id) {
//                     return 0;
//                 } else {
//                     const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                     if (tmp > 24) {
//                         return 24;
//                     }
//                     return tmp;
//                 }
//             });
//         // 保存二级焦点知识簇内节点坐标
//         let nodeInCom = {};
//         for (let com of nodes) {
//             if (com.id !== id) {
//                 const nodeElement = document.getElementById(com.id + 'nodes');
//                 d3.select(nodeElement)
//                     .selectAll('circle')
//                     .attr('display', 'none');
//                 const edgeElement = document.getElementById(com.id + 'edges');
//                 d3.select(edgeElement)
//                     .selectAll('path')
//                     .attr('display', 'none');
//                 const textElement = document.getElementById(com.id + 'text');
//                 d3.select(textElement)
//                     .selectAll('text')
//                     .attr('display', 'none');
//             } else {
//                 const tmp = calcCircleLayoutWithoutReduceCrossing(
//                     { x: com.cx, y: com.cy },
//                     com.r,
//                     graph[com.id],
//                     sequences[com.id],
//                     undefined
//                 );
//                 for (let node of tmp.nodes) {
//                     nodeInCom[node.id] = node;
//                 }
//                 const nodeElement = document.getElementById(com.id + 'nodes');
//                 d3.select(nodeElement)
//                     .selectAll('circle')
//                     .data(tmp.nodes)
//                     .transition()
//                     .delay(300)
//                     .attr('r', d => d.r)
//                     .attr('cx', d => d.cx)
//                     .attr('cy', d => d.cy)
//                     .attr('id', d => d.id)
//                     .attr('display', 'inline');
//                 const edgeElement = document.getElementById(com.id + 'edges');
//                 d3.select(edgeElement)
//                     .selectAll('path')
//                     .data(tmp.edges)
//                     .transition()
//                     .delay(300)
//                     .attr('d', d => link(d.path))
//                     .attr('stroke-width', 2)
//                     .attr('fill', 'none')
//                     .attr('display', 'inline');
//                 const textElement = document.getElementById(com.id + 'text');
//                 d3.select(textElement)
//                     .selectAll('text')
//                     .data(tmp.nodes)
//                     .transition()
//                     .delay(300)
//                     .attr('font-size', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         if (tmp > 24) {
//                             return 24;
//                         } else {
//                             return tmp;
//                         }
//                     })
//                     .attr('x', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         return d.cx - judgementStringLengthWithChinese(topics[d.id]) * (tmp > 24 ? 12 : tmp / 2);
//                     })
//                     .attr('y', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         if (tmp > 24) {
//                             return d.cy + 12;
//                         } else {
//                             return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]);
//                         }
//                     })
//                     .text(d => topics[d.id])
//                     .attr('fill', '#ffffff')
//                     .attr('display', 'inline');
//             }
//         }
//         // 绘制认知路径
//         if (learningPath.length !== 0) {
//             let path2com = learningPath.map(x => topicId2Community[x]);
//             let comPaths = [];
//             for (let i = 0; i < path2com.length - 1; i++) {
//                 comPaths.push([path2com[i], path2com[i + 1]]);
//             }
//             comPaths = comPaths.filter(x => x[0] !== x[1]);
//             canvas.select('#learningPaths')
//                 .style('visibility', 'hidden');
//             canvas.append('g')
//                 .attr('id', 'comPaths')
//                 .selectAll('path')
//                 .data(comPaths)
//                 .enter()
//                 .append('path')
//                 .transition()
//                 .delay(300)
//                 .attr('d', d => {
//                     return link(
//                         calcLinkSourceTargetBetweenCircles(
//                             nodes.filter(com => com.id === d[0])[0].cx,
//                             nodes.filter(com => com.id === d[0])[0].cy,
//                             nodes.filter(com => com.id === d[0])[0].r,
//                             nodes.filter(com => com.id === d[1])[0].cx,
//                             nodes.filter(com => com.id === d[1])[0].cy,
//                             nodes.filter(com => com.id === d[1])[0].r,
//                         )
//                     )
//                 })
//                 .attr('stroke', '#873800')
//                 .attr('stroke-width', 2)
//                 .attr('fill', 'none')
//                 .style('cursor', 'pointer')
//                 .attr('marker-end', 'url(#arrow)');
//             // 绘制簇内认知路径
//             let paths = [];
//             for (let i = 0; i < learningPath.length - 1; i++) {
//                 if (Object.keys(nodeInCom).map(x => parseInt(x)).indexOf(learningPath[i]) !== -1 && Object.keys(nodeInCom).map(x => parseInt(x)).indexOf(learningPath[i + 1]) !== -1) {
//                     paths.push([learningPath[i], learningPath[i + 1]]);
//                 }
//             }
//             canvas.append('g')
//                 .attr('id', 'inComPaths')
//                 .selectAll('path')
//                 .data(paths)
//                 .enter()
//                 .append('path')
//                 .transition()
//                 .delay(300)
//                 .attr('d', d => {
//                     return link(calcLinkSourceTargetBetweenCircles(
//                         nodeInCom[d[0]].cx,
//                         nodeInCom[d[0]].cy,
//                         nodeInCom[d[0]].r,
//                         nodeInCom[d[1]].cx,
//                         nodeInCom[d[1]].cy,
//                         nodeInCom[d[1]].r,
//                     ))
//                 })
//                 .attr('stroke', '#873800')
//                 .attr('stroke-width', 2)
//                 .attr('fill', 'none')
//                 .style('cursor', 'pointer')
//                 .attr('marker-end', 'url(#arrow)');
//         }
//     }

//     function clickNode(d: any, com) {
//         d3.select('#edgeWithTopicInCom').remove();
//         d3.select('#edgeWithTopicCrossCom').remove();
//         d3.select('#comPaths').remove();
//         d3.select('#inComPaths').remove();
//         treeSvg.style.visibility = 'hidden';
//         zoom.topicId = d.id;
//         zoom.com = com.id;
//         if (d.id === -1) {
//             // 默认状态下点击知识主题直接进入第二层
//             comSecond(com.id);
//             layer = 2;
//             return;
//         }
//         switch (layer) {
//             case 0:
//                 comSecond(com.id);
//                 layer = 2;
//                 break;
//             case 1:
//                 comSecond(com.id);
//                 layer = 2;
//                 break;
//             case 2:
//                 nodeFirst(d.id, com);
//                 layer = 3;
//                 break;
//             case 3:
//                 nodeFirst(d.id, com);
//                 break;
//         }
//         clickTopic(d.id, topics[d.id]);
//     }

//     /**
//      * 知识主题第一种形态
//      * @param id
//      * @param com
//      */
//     function nodeFirst(id, c) {
//         const { nodes, edges } = calcCircleLayoutSecondLayer(
//             { x: radius, y: radius },
//             radius,
//             communityRelation,
//             globalSequence,
//             c.id
//         );
//         canvas.select('#com')
//             .selectAll('circle')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('r', d => d.r)
//             .attr('cx', d => d.cx)
//             .attr('cy', d => d.cy);
//         canvas.select('#com2com')
//             .selectAll('path')
//             .attr('display', 'none');
//         canvas.select('#comText')
//             .selectAll('text')
//             .data(nodes)
//             .transition()
//             .delay(300)
//             .attr('x', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                 return d.cx - judgementStringLengthWithChinese(topics[sequences[d.id][0]]) * (tmp > 24 ? 12 : tmp / 2);
//             })
//             .attr('y', d => {
//                 const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                 if (tmp > 24) {
//                     return d.cy + 12;
//                 } else {
//                     return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                 }
//             })
//             .attr('font-size', d => {
//                 if (d.id === c.id) {
//                     return 0;
//                 } else {
//                     const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
//                     if (tmp > 24) {
//                         return 24;
//                     } else {
//                         return tmp;
//                     }
//                 }
//             });
//         for (let com of nodes) {
//             if (com.id !== c.id) {
//                 const nodeElement = document.getElementById(com.id + 'nodes');
//                 d3.select(nodeElement)
//                     .selectAll('circle')
//                     .attr('display', 'none');
//                 const edgeElement = document.getElementById(com.id + 'edges');
//                 d3.select(edgeElement)
//                     .selectAll('path')
//                     .attr('display', 'none');
//                 const textElement = document.getElementById(com.id + 'text');
//                 d3.select(textElement)
//                     .selectAll('text')
//                     .attr('display', 'none');
//             } else {
//                 const tmp = calcCircleLayoutSecondLayer(
//                     { x: com.cx, y: com.cy },
//                     com.r,
//                     graph[com.id],
//                     sequences[com.id],
//                     id
//                 );
//                 const nodeElement = document.getElementById(com.id + 'nodes');
//                 d3.select(nodeElement)
//                     .selectAll('circle')
//                     .data(tmp.nodes)
//                     .attr('r', d => d.r)
//                     .attr('cx', d => d.cx)
//                     .attr('cy', d => d.cy)
//                     .attr('id', d => d.id)
//                     .attr('display', d => d.id === id ? 'none' : 'inline');
//                 const edgeElement = document.getElementById(com.id + 'edges');
//                 d3.select(edgeElement)
//                     .selectAll('path')
//                     .attr('display', 'none');
//                 const textElement = document.getElementById(com.id + 'text');
//                 d3.select(textElement)
//                     .selectAll('text')
//                     .data(tmp.nodes)
//                     .attr('font-size', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         if (tmp > 24) {
//                             return 24;
//                         } else {
//                             return tmp;
//                         }
//                     })
//                     .attr('x', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         return d.cx - judgementStringLengthWithChinese(topics[d.id]) * (tmp > 24 ? 12 : tmp / 2);
//                     })
//                     .attr('y', d => {
//                         const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
//                         if (tmp > 24) {
//                             return d.cy + 12;
//                         } else {
//                             return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]);
//                         }
//                     })
//                     .text(d => topics[d.id])
//                     .attr('fill', '#ffffff')
//                     .attr('display', d => d.id === id ? 'none' : 'inline');

//                 const count = sequences[com.id].length;
//                 const r = 0.4 * com.r * Math.sin(Math.PI / (count + 1)) / (1 + Math.sin(Math.PI / (count + 1)));
//                 treeSvg.style.width = (2 * com.r - 4 * r) / 5 * 3 + 'px';
//                 treeSvg.style.height = (2 * com.r - 4 * r) / 5 * 4 + 'px';
//                 treeSvg.style.left = (svg.clientWidth / 2 - (com.r - 2 * r) / 5 * 3 - 24) + 'px';
//                 treeSvg.style.top = (svg.clientHeight / 2 - (com.r - 2 * r) / 5 * 4 - 24) + 'px';
//                 treeSvg.style.visibility = 'visible';
//                 if (id !== -1 && topics[id]) {
//                     axios.post('http://yotta.xjtushilei.com:8083/topic/getCompleteTopicByTopicName?topicName=' + encodeURIComponent(topics[id]) + '&hasFragment=emptyAssembleContent').then(res => {
//                         drawTree(treeSvg, res.data.data, clickFacet);
//                     }).catch(err => console.log(err))
//                 }
//                 const es = calcEdgeWithSelectedNode(
//                     { x: com.cx, y: com.cy },
//                     com.r,
//                     graph[com.id],
//                     tmp.nodes,
//                     id,
//                 );
//                 // 焦点知识主题相关认知关系
//                 canvas.append('g')
//                     .attr('id', 'edgeWithTopicInCom')
//                     .selectAll('path')
//                     .data(es)
//                     .enter()
//                     .append('path')
//                     .attr('d', d => link(d))
//                     .attr('stroke', '#873800')
//                     .attr('stroke-width', 2)
//                     .attr('fill', 'none')
//                     .attr('marker-end', 'url(#arrow)');
//                 const edgeCrossCom = calcEdgeWithSelectedNodeCrossCom(
//                     { x: com.cx, y: com.cy },
//                     com.r,
//                     id,
//                     relationCrossCommunity,
//                     topicId2Community,
//                     nodes
//                 );
//                 canvas.append('g')
//                     .attr('id', 'edgeWithTopicCrossCom')
//                     .selectAll('path')
//                     .data(edgeCrossCom)
//                     .enter()
//                     .append('path')
//                     .attr('d', d => link(d.path))
//                     .attr('stroke', '#873800')
//                     .attr('stroke-width', 4)
//                     .attr('fill', 'none')
//                     .style('cursor', 'pointer')
//                     .on('mouseover', d => {
//                         let topic = '';
//                         for (let topicId of d.topics) {
//                             topic += topics[topicId] + ' ';
//                         }
//                         divTooltip.transition()
//                             .duration(200)
//                             .style("opacity", .9);
//                         divTooltip.html(topic.trim())
//                             .style("left", (d3.event.pageX) + "px")
//                             .style("top", (d3.event.pageY - 28) + "px");
//                     })
//                     .on("mouseout", function (d) {
//                         divTooltip.transition()
//                             .duration(500)
//                             .style("opacity", 0);
//                     })
//                     .on('click', d => {
//                         divTooltip.transition()
//                             .duration(500)
//                             .style("opacity", 0);

//                         if (com.id === d.start) {
//                             zoom.com = d.end;
//                             clickCom({ id: d.end });
//                         } else {
//                             zoom.com = d.start;
//                             clickCom({ id: d.start });
//                         }
//                     })
//                     .attr('marker-end', 'url(#arrow)');

//             }
//         }

//     }

//     function clickRelation() {

//     }

//     function clickCanvas() {

//     }
// }

// export function judgementStringLengthWithChinese(str: string): number {
//     let result = 0;
//     for (let i = 0; i < str.length; i++) {
//         if (/[a-z0-9\*\\\|\(\)\&\^\%\$\#\@\!\,\.\?\<\>\/]/.test(str[i])) {
//             result += 0.5;
//         } else {
//             result += 1;
//         }
//     }
//     return result;
// }

// export function completeObj(obj) {
//     let ids = new Set();
//     for (let key in obj) {
//         ids.add(parseInt(key));
//         for (let end of obj[key]) {
//             ids.add(parseInt(end));
//         }
//     }
//     let _ids = <number[]>Array.from(ids);
//     for (let key of _ids) {
//         if (!obj[key]) {
//             obj[key] = [];
//         }
//     }
//     return obj;
// }
