import * as d3 from 'd3';
import {presetPalettes} from '@ant-design/colors';

import {
    calcCircleLayout,
    calcCircleLayoutSecondLayer1,
    calcCircleLayoutWithoutReduceCrossing,
    calNodeWithSelectedInComCrossCom,
    calNodeWithSelectedOutComCrossCom,
} from "./circle-layout";
import {completeObj, judgementStringLengthWithChinese, link, MapData} from "./draw-map";

const colors = [];
for (let key in presetPalettes) {
    colors.push(presetPalettes[key].slice(0, 10));
}

export function drawTopic(
    id: number,//簇的id
    mapData: MapData,//后端返回的数据
    svg: HTMLElement,//画整张图需要的svg
    clickTopic,
) {
    let {
        topics,
        graph,
        topicId2Community,
        communityRelation,
    } = mapData;

    const canvas = d3.select(svg);

    //用来画箭头，设置箭头模板，是用Id来控制的
    const defs = canvas.append("defs");
    const arrow = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "6")
        .attr("markerHeight", "6")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");
    const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    arrow.append("path")
        .attr("d", arrow_path)
        .attr("fill", '#873800');
    for (let i = 0; i < colors.length; i++) {
        const arrowMarker = defs.append("marker")
            .attr("id", "arrow" + i)
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "8")
            .attr("markerHeight", "8")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "6")
            .attr("refY", "6")
            .attr("orient", "auto");
        const arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
        arrowMarker.append("path")
            .attr("d", arrow_path)
            .attr("fill", colors[i][9]);
    }

    for (let key in graph) {
        graph[key] = completeObj(graph[key]);
    }

    communityRelation = completeObj(communityRelation);

    const radius = svg.clientHeight < svg.clientWidth ? svg.clientHeight / 2 : svg.clientWidth / 2;

    const {nodes, sequence} = calcCircleLayout(
        {x: radius, y: radius},
        radius,
        communityRelation,
        topicId2Community[-1] !== undefined ? topicId2Community[-1] : undefined
    );
    const globalSequence = sequence;
    const sequences = {};
    for (let com of nodes) {
        // 计算簇内布局
        const tmp = calcCircleLayout(
            {x: com.cx, y: com.cy},
            com.r,
            graph[com.id],
            com.id === topicId2Community[-1] ? -1 : undefined
        );

        sequences[com.id] = tmp.sequence;
    }
    // 根据获取到的id画主题
    comSecond(id);

    function comSecond(id) {
        const {nodes, edges} = calcCircleLayoutSecondLayer1(
            {x: radius, y: radius},
            radius,
            communityRelation,
            globalSequence,
            id
        );
        canvas.append('g')
            .attr('id', '#com')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .transition()
            .delay(300)
            .attr('r', d => d.r)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('fill', colors[globalSequence.indexOf(id) % colors.length][1])
            .attr('display', 'inline');
        // 保存二级焦点知识簇内节点坐标
        let nodeInCom = {};
        const com = nodes.filter(node => node.id === id)[0];
        const tmp = calcCircleLayoutWithoutReduceCrossing(
            {x: com.cx, y: com.cy},
            com.r,
            graph[com.id],
            sequences[com.id],
            undefined
        );
        for (let node of tmp.nodes) {
            nodeInCom[node.id] = node;
        }
        canvas.append('g')
            .attr('id', com.id + 'nodes')
            .selectAll('circle')
            .data(tmp.nodes)
            .enter()
            .append('circle')
            .transition()
            .delay(300)
            .attr('r', d => d.r)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('id', d => d.id)
            .attr('display', 'inline')
            .attr('fill', colors[globalSequence.indexOf(com.id) % colors.length][6]);
        const nElement = document.getElementById(com.id + 'nodes');
        d3.select(nElement)
            .selectAll('circle')
            .on('click', (d: any) => clickTopic(d.id, topics[d.id]));
        canvas.append('g')
            .attr('id', com.id + 'edges')
            .selectAll('path')
            .data(tmp.edges)
            .enter()
            .append('path')
            .transition()
            .delay(300)
            .attr('d', d => link(d.path))
            .attr('stroke', colors[globalSequence.indexOf(com.id) % colors.length][8])
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrow' + globalSequence.indexOf(com.id) + ')')
            .style('visibility', 'visible')
            .attr('display', 'inline');
        canvas.append('g')
            .attr('id', com.id + 'text')
            .selectAll('text')
            .data(tmp.nodes)
            .enter()
            .append('text')
            .transition()
            .delay(300)
            .attr('font-size', d => {
                const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
                if (tmp > 24) {
                    return 24;
                } else {
                    return tmp;
                }
            })
            .attr('x', d => {
                const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
                return d.cx - judgementStringLengthWithChinese(topics[d.id]) * (tmp > 24 ? 12 : tmp / 2);
            })
            .attr('y', d => {
                const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[d.id]);
                if (tmp > 24) {
                    return d.cy + 12;
                } else {
                    return d.cy + (d.r - 2) / judgementStringLengthWithChinese(topics[d.id]);
                }
            })
            .text(d => topics[d.id])
            .attr('fill', '#ffffff')
            .attr('display', 'inline');
        const tElement = document.getElementById(com.id + 'text');
        d3.select(tElement)
            .selectAll('text')
            .on('click', (d: any) => clickTopic(d.id, topics[d.id]));
        let inCom = [];
        let outCom = [];
        inCom = calNodeWithSelectedInComCrossCom(
            id,
            communityRelation,
            graph
        )
        outCom = calNodeWithSelectedOutComCrossCom(
            id,
            communityRelation,
            graph
        )
        return [inCom, outCom];
    }
}
