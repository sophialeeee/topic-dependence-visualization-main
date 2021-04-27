import axios from 'axios';

// import {drawMap} from "./module/topicDependenceVisualization";
import {drawMap} from "../src/draw-map";
import {gaozhongshuxue} from "../gaozhongshuxue";
// import {drawTree} from './module/facetTree';

const domainName = '数据库应用';
// const learningPath = [-1,104882,104890,104894,104898,104941];
const learningPath = [];
const treesvg = document.getElementById('tree');

const svg = document.getElementById('map');

const TopicEdit = 'yes';
const RelationEdit = 'yes';
const FacetEdit = 'yes';

axios.get('http://47.95.145.72:80/dependences/?domainName=' + domainName)
    .then(res => {
        console.log("rs",res.data);
        drawMap(res.data, svg, treesvg, domainName, learningPath, (topicId, topicName) => {}, clickFacet, ()=>{

}, ()=>{},() => {},()=>{},(a,b)=>{}, TopicEdit, RelationEdit, FacetEdit,() => {},()=>{});})

async function clickFacet(facetId: number) {

    try {
        const res = await axios.get('http://yotta.xjtushilei.com:8083/facet/getFacetNameAndParentFacetNameByFacetId', {
            params: {
                facetId,
            }
        });
        if ((res as any).data.code === 200) {
            document.getElementById('facet').innerHTML = (res.data.data.parentFacetName ?  res.data.data.parentFacetName + ' - ' : '') + res.data.data.facetName;
        } else {
            throw(res.data)
        }
    } catch (e) {
        console.log(e);
        document.getElementById('facet').innerHTML = '';
    }

    // empty list
    const list = document.getElementById('list');
    const children = list.childNodes;
    for (let i = 0; i < children.length; i++) {
        list.removeChild(children[i]);
    }

    const ul = document.createElement('ul');
    let assembleNumber = 0;

    try {
        const res = await axios.get('http://yotta.xjtushilei.com:8083/assemble/getAssemblesByFacetId', {
            params: {
                facetId: facetId,
            },
        });

        if ((res as any).data.code === 200) {
            const assembleList = res.data.data;
            (assembleList as any).forEach(element => {
                const li = document.createElement('li');
                li.className = 'assemble';
                if (element.type === 'video') {
                    const regex = new RegExp('https://.*mp4');
                    li.innerHTML = `<video src='${regex.exec(element.assembleContent as string)[0]}' controls height="280"></video>`
                } else {
                    li.innerHTML = element.assembleContent;
                }
                ul.appendChild(li);
            });
            assembleNumber = assembleList.length;
            list.appendChild(ul);
            document.getElementById('assembleNumber').innerHTML = assembleNumber.toString();
        } else {
            throw ('api error');
        }
    } catch (e) {
        console.log(e);
        document.getElementById('assembleNumber').innerHTML = '';
    }
}
