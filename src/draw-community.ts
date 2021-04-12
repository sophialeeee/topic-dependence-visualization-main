import * as d3 from 'd3';
import {presetPalettes} from '@ant-design/colors';

import {
    calcCircleLayout,
} from "./circle-layout";
import {completeObj, judgementStringLengthWithChinese, link, MapData} from './draw-map';

const colors = [];
for (let key in presetPalettes) {
    colors.push(presetPalettes[key].slice(0, 10));
}

export function drawCommunity(
    mapData: MapData,//后端返回的数据
    svg: HTMLElement,//画整张图需要的svg
    clickCom,//点击簇时的回调函数，点击簇，画这个簇内部的主题布局，返回与这个簇相关的簇
) {
    let {
        topics,
        graph,
        topicId2Community,
        relationCrossCommunity,
        communityRelation,
    } = mapData;
    const canvas = d3.select(svg);//整个认知关系的画布
    //用来显示画簇的认知关系，鼠标附上去会显示簇
    const divTooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('opacity', 0)
        .style('text-align', 'center')
        .style('font-size', '6px')
        .style('background-color', '#ffffb8')
        .style('padding', '1px 3px')
        .style('top', 0);
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
    // 补全键名，键名是所有的topic_id
    communityRelation = completeObj(communityRelation);
    // 画外面的大圆
    const radius = svg.clientHeight < svg.clientWidth ? svg.clientHeight / 2 : svg.clientWidth / 2;
    //整张大圆的圆心、半径、簇和簇之间认知关系的数据
    //判断有没有起始簇，入度为0的点只有一个的话就不需要加上开始，如果有多个入度为0的点则需要加上一个开始节点？？不是这个意思
    //使得入度为0的点放在每一个圆的12.方向
    const {nodes, edges, sequence} = calcCircleLayout(
        {x: radius, y: radius},
        radius,
        communityRelation,
        topicId2Community[-1] !== undefined ? topicId2Community[-1] : undefined
    );
    const sequences = {};
    // 绘制簇内信息
    for (let com of nodes) {
        // 计算簇内布局
        const tmp = calcCircleLayout(
            { x: com.cx, y: com.cy },
            com.r,
            graph[com.id],
            com.id === topicId2Community[-1] ? -1 : undefined
        );
        sequences[com.id] = tmp.sequence;
    }
    /**
     * 绘制簇间认知关系
     */
    // 绘制簇间认知关系
    canvas.append('g')
        .attr('id', 'com2com')
        .selectAll('path')
        .data(edges)
        .enter()
        .append('path')
        .attr('d', d => link(d.path))
        .attr('stroke', '#873800')
        .attr('stroke-width', 4)
        .attr('fill', 'none')
        .style('cursor', 'pointer')
        .style('visibility', 'visible')
        .on('mouseover', d => {
            let topic = '';
            for (let edge of relationCrossCommunity) {
                if (topicId2Community[edge[0]] === d.start && topicId2Community[edge[1]] === d.end) {
                    topic += topics[edge[0]] + '->' + topics[edge[1]] + '\n';
                }
            }
            divTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            divTooltip.html(topic.trim())
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            divTooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .attr('marker-end', 'url(#arrow)');
    // 绘制知识簇
    canvas.append('g')
        .attr('id', 'com')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.r)
        .attr('cx', d => d.cx)
        .attr('cy', d => d.cy)
        .attr('id', d => 'com' + d.id)
        .attr('fill', (d, i) => colors[i % colors.length][1]);
    // 绘制知识簇上的文本
    canvas.append('g')
        .attr('id', 'comText')
        .selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        //.attr('font-size', 28)
        .attr('font-size', d => {

            const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
            if (tmp > 24) {
                return 24;
            }
            return tmp;
        })
        .attr('x', d => {
            const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
            if (tmp > 24) {
                return d.cx - 12 * judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
            } else {
                return d.cx - tmp / 2 * judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
            }
        })
        .attr('y', (d, i) => {
            const tmp = (d.r * 2 - 4) / judgementStringLengthWithChinese(topics[sequences[d.id][0]]);
            if (tmp > 24) {
                return d.cy + 12;
            } else {
                return d.cy + tmp / 2;
            }
        })
        .text(d => topics[sequences[d.id][0]])
        .attr('fill', '#000000')
        .attr('cursor', 'pointer')

    /**
     * 设置簇的交互操作，点击簇，跳转到画主题的函数
     */
    canvas.select('#com')
        .selectAll('circle')
        .on('click', d => clickCom(d));
    canvas.select('#comText')
        .selectAll('text')
        .on('click', d => clickCom(d));
    return sequences;
}

