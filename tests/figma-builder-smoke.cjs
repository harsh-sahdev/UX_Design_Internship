/*
 * Figma builder dry-run: verifies our native builder's page/component/variable
 * creation path against a deliberately small Figma Plugin API mock.
 * NOT a substitute for actually running it inside Figma Desktop.
 */
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const path=require("node:path");

let seq=0;
class Node {
  constructor(type) {
    this.type=type;this.name=type;this.id=String(++seq);
    this.x=0;this.y=0;this.width=100;this.height=100;this.children=[];
    this.parent=null;this.fills=[];this.strokes=[];
  }
  appendChild(n) {
    if(n===this)throw Error("Can't parent node to itself");
    if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);
    this.children.push(n);n.parent=this;
  }
  resize(w,h){this.width=w;this.height=h}
  setPluginData(k,v){if(!this.pluginData)this.pluginData={};this.pluginData[k]=v}
  findOne(fn){
    for(const c of this.children) {
      if(fn(c))return c;
      const n=c.findOne(fn);if(n)return n;
    }
    return null;
  }
  createInstance(){
    if(this.type!=="COMPONENT")throw Error("createInstance only on Component");
    const inst=new Node("INSTANCE");
    inst.name=this.name;inst.resize(this.width,this.height);
    const deep=(src,dst)=>{
      for(const c of src.children){
        const n=new Node(c.type);n.name=c.name;
        if(c.characters!==undefined)n.characters=c.characters;
        n.resize(c.width,c.height);dst.appendChild(n);deep(c,n);
      }
    };
    deep(this,inst);
    return inst;
  }
}

function fakeFigma(preFilled=false){
  const root=new Node("DOCUMENT");
  const initial=new Node("PAGE");
  initial.name="Page 1";root.appendChild(initial);
  if(preFilled)initial.appendChild(new Node("RECTANGLE"));
  let currentPage=initial, notice="";
  let components=0,sets=0,variables=0,styles=0,instances=0;
  const create=(type)=>{
    const node=new Node(type);
    if(type==="COMPONENT")components++;
    currentPage.appendChild(node);
    return node;
  };
  const fg={
    editorType:"figma",
    root,
    get currentPage(){return currentPage},
    createPage(){const node=new Node("PAGE");root.appendChild(node);return node},
    async setCurrentPageAsync(p){currentPage=p},
    async loadFontAsync(){},
    createFrame(){return create("FRAME")},
    createRectangle(){return create("RECTANGLE")},
    createText(){return create("TEXT")},
    createComponent(){return create("COMPONENT")},
    createTextStyle(){styles++;return {}},
    createPaintStyle(){styles++;return {}},
    combineAsVariants(nodes,parent) {
      assert(nodes.length>0 && nodes.every(x=>x.type==="COMPONENT"));
      const s=new Node("COMPONENT_SET");
      parent.appendChild(s);
      nodes.forEach(n=>s.appendChild(n));
      sets++;return s;
    },
    variables:{
      createVariableCollection(name) {
        const modeId="mode0";
        return {name,modes:[{modeId}],renameMode(id,label){this.modes[0].name=label}};
      },
      createVariable(name,collection,type) {
        variables++;
        return {name,type,collection,setValueForMode(mode,value){this.value=value}};
      }
    },
    viewport:{scrollAndZoomIntoView(nodes){assert(nodes.length>0)}},
    closePlugin(message){notice=message},
    get stats(){return{components,sets,variables,styles,instances,pages:root.children.length,notice}}
  };
  return fg;
}
function waitUntilClosed(figma,timeout=4000){
  return new Promise((resolve,reject)=>{
    const start=Date.now();
    function poll(){
      if(figma.stats.notice)return resolve(figma.stats.notice);
      if(Date.now()-start>timeout)return reject(Error("Builder did not finish"));
      setTimeout(poll,10);
    }
    poll();
  });
}
async function run(preFilled){
  const source=fs.readFileSync(path.join(__dirname,"../design-system/figma-plugin/code.js"),"utf8");
  const figma=fakeFigma(preFilled);
  new vm.Script(source,{filename:"figma-plugin/code.js"}).runInNewContext({figma,console});
  await waitUntilClosed(figma);
  return figma;
}
(async()=>{
  const result=await run(false);
  assert.match(result.stats.notice,/built/i,"Builder should finish successfully");
  assert.equal(result.stats.pages,3,"Must fit Starter plan three-page limit");
  assert.equal(result.stats.sets,7,"Expected native variant component sets");
  assert.equal(result.stats.components,29,"Expected all component variants");
  assert.equal(result.stats.variables,24,"Expected colours, spacing and radii");
  assert.ok(result.stats.styles>=19);
  const pages=result.root.children;
  assert.deepEqual(pages.map(p=>p.name),[
    "00 · Foundations","01 · Native components","02 · Wallet & Checkout screens"
  ]);
  assert.equal(pages[2].children.filter(n=>n.type==="FRAME").length,4);
  const blocked=await run(true);
  assert.equal(blocked.root.children.length,1,"Must preserve preexisting content");
  assert.match(blocked.stats.notice,/NEW empty/i,"Should refuse existing files");
  console.log("Figma builder mock passed:",JSON.stringify(result.stats));
})().catch(e=>{console.error(e);process.exit(1)});
