import { hetongfa } from './../hetongfa';

// import {drawMap} from "./module/topicDependenceVisualization";
import {drawMap} from "../src/draw-map";

// import {gaozhongshuxue} from "../gaozhongshuxue";
// import {drawTree} from './module/facetTree';

const domainName = '合同法';
// const learningPath = [-1,104882,104890,104894,104898,104941];
const learningPath = [];
const treesvg = document.getElementById('tree');

const svg = document.getElementById('map');




// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-use-before-define
drawMap(hetongfa,svg,treesvg,domainName,learningPath,(topicId, topicName) => {}, clickFacet);

async function clickFacet(facetId: number) {
    console.log(facetId);

}
