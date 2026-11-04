/*
 * Interface Craft: Figma Design System Builder
 * Creates REAL native Figma components, variants, variables and editable screens.
 * Requires a NEW EMPTY Figma Design file (three pages max, including current one).
 * No network, external assets or personal data collection.
 */
(async () => {
  "use strict";
  const BRAND = "Interface Craft";
  const COLORS = {
    primary: "#205B50", hover: "#16483D", soft: "#EAF3EF", dark: "#10262D",
    ink: "#172B31", muted: "#61717A", canvas: "#F6F8F8", surface: "#FFFFFF",
    border: "#DFE6E6", success: "#277052", successSoft: "#E5F4EB",
    danger: "#A73542", dangerSoft: "#FBEBEE", mint: "#A2D6C0"
  };
  const rgb = (hex) => {
    const h = hex.replace("#", "");
    return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255 };
  };
  const paint = (hex) => ({ type: "SOLID", color: rgb(hex) });
  const VARS = {};
  // Bind palette fills to Figma variables when the API is supported.
  function boundPaint(hex) {
    const colour = VARS[hex.toUpperCase()];
    const base = paint(hex);
    if (colour && typeof figma.variables.setBoundVariableForPaint === "function") {
      try { return figma.variables.setBoundVariableForPaint(base, "color", colour); }
      catch (_) { return base; }
    }
    return base;
  }
  const fill = (node, hex) => { node.fills = [boundPaint(hex)]; };
  const stroke = (node, hex, weight=1) => { node.strokes = [boundPaint(hex)]; node.strokeWeight = weight; };
  let FONTS = null;
  let page = null;

  // Make only a new blank file eligible: user content must never be overwritten.
  if (figma.editorType !== "figma") {
    figma.closePlugin("Open a Figma Design file (not FigJam) before running.");
    return;
  }
  if (figma.root.children.length !== 1 || figma.currentPage.children.length !== 0) {
    figma.closePlugin("Create a NEW empty Figma Design file, then run this builder. It won't modify an existing project.");
    return;
  }

  async function fonts() {
    const candidates = [
      [{ family: "Inter", style: "Regular" }, { family: "Inter", style: "Medium" }, { family: "Inter", style: "Bold" }],
      [{ family: "Roboto", style: "Regular" }, { family: "Roboto", style: "Medium" }, { family: "Roboto", style: "Bold" }]
    ];
    for (const set of candidates) {
      try { await Promise.all(set.map(f => figma.loadFontAsync(f))); FONTS = set; return; }
      catch (_) {}
    }
    throw new Error("Inter / Roboto font unavailable. Install one of these font families in Figma first.");
  }
  function parent(n, container) {
    (container || page).appendChild(n);
    return n;
  }
  function frame(name, x, y, w, h, background=null, radius=0, container=null) {
    const node = parent(figma.createFrame(), container);
    node.name = name;
    node.resize(w,h);
    node.x = x; node.y = y;
    node.clipsContent = false;
    if (background) fill(node, background); else node.fills = [];
    if (radius) node.cornerRadius = radius;
    return node;
  }
  function rect(name, x, y, w, h, background, radius=0, container=null, border=null) {
    const node = parent(figma.createRectangle(), container);
    node.name = name; node.resize(w,h); node.x=x; node.y=y;
    node.cornerRadius = radius;
    fill(node, background);
    if (border) stroke(node,border);
    return node;
  }
  function text(name, value, x, y, size=14, color=COLORS.ink, weight="regular", container=null) {
    const node = parent(figma.createText(), container);
    node.name=name;
    node.fontName=FONTS[weight==="bold"?2:weight==="medium"?1:0];
    node.fontSize=size;
    node.characters=value;
    node.textAutoResize="WIDTH_AND_HEIGHT";
    node.fills=[paint(color)];
    node.x=x;node.y=y;
    return node;
  }
  function rule(name,x,y,w,container=null,color=COLORS.border) {
    return rect(name,x,y,w,1,color,0,container);
  }
  function tag(name, x,y,w,label, fg,bg,container=null){
    const group=frame(name,x,y,w,30,bg,6,container);
    text("Badge label",label,12,8,11,fg,"medium",group);
    return group;
  }
  function sectionTitle(number,label,x,y,container=null) {
    text("Section index",number,x,y,11,COLORS.primary,"bold",container);
    text("Section heading",label,x,y+24,27,COLORS.ink,"bold",container);
  }
  function auto(node,w,h,axis="HORIZONTAL",pad=16,gap=10) {
    node.resize(w,h);
    node.layoutMode=axis;
    node.primaryAxisSizingMode="FIXED";
    node.counterAxisSizingMode="FIXED";
    node.primaryAxisAlignItems="CENTER";
    node.counterAxisAlignItems="CENTER";
    node.itemSpacing=gap;
    node.paddingTop=pad;
    node.paddingBottom=pad;
    node.paddingLeft=pad;
    node.paddingRight=pad;
  }
  function component(name,w,h,background=null,radius=8,border=null) {
    const c=parent(figma.createComponent(),page);
    c.name=name;c.resize(w,h);c.cornerRadius=radius;
    if(background) fill(c,background); else c.fills=[];
    if(border) stroke(c,border);
    return c;
  }
  function combine(name,nodes,x,y,columns=2,width=188,height=74) {
    nodes.forEach((node,i) => { node.x= (i%columns)*(width+26);node.y=Math.floor(i/columns)*(height+18); });
    const set=figma.combineAsVariants(nodes,page);
    set.name=name;set.x=x;set.y=y;
    return set;
  }
  function buttonVariant(kind,state) {
    const primary=kind==="Primary",danger=kind==="Danger",disabled=state==="Disabled";
    const bg=primary?(disabled?"#DEE8E4":state==="Hover"?COLORS.hover:COLORS.primary):
      danger?(disabled?"#F5EBEC":COLORS.danger):(disabled?"#F6F8F8":state==="Hover"?COLORS.soft:COLORS.surface);
    const fg=primary?(disabled?COLORS.muted:COLORS.surface):
      danger?(disabled?COLORS.muted:COLORS.surface):(disabled?"#8EA39B":COLORS.ink);
    const c=component("Type="+kind+", State="+state,176,44,bg,6,primary||danger?null:COLORS.border);
    auto(c,176,44,"HORIZONTAL",12,8);
    if(state==="Focus") stroke(c,COLORS.mint,3);
    const t=text("Label",kind==="Primary"?"Continue":kind==="Danger"?"Delete":"Cancel",0,0,14,fg,"medium",c);
    t.textAutoResize="WIDTH_AND_HEIGHT";
    return c;
  }
  function inputVariant(state) {
    const c=component("State="+state,286,84,null,0);
    c.clipsContent=false;
    text("Field label","Email address",0,0,12,COLORS.ink,"medium",c);
    rect("Field background",0,21,286,43,state==="Disabled"?"#EFF3F2":COLORS.surface,6,c,
      state==="Error"?COLORS.danger:state==="Focus"?COLORS.primary:COLORS.border);
    text("Field value",state==="Error"?"invalid-address":state==="Disabled"?"Not available":"name@example.com",
      11,33,13,state==="Disabled"?"#96AAA3":COLORS.muted,"regular",c);
    if(state==="Error") text("Error helper","Enter a valid email address.",0,67,11,COLORS.danger,"regular",c);
    return c;
  }
  function badgeVariant(state){
    const colors={Neutral:[COLORS.muted,"#EFF2F1"],Success:[COLORS.success,COLORS.successSoft],
      Error:[COLORS.danger,COLORS.dangerSoft],Warning:["#846132","#F6EDD9"]};
    const [fg,bg]=colors[state];
    const c=component("Status="+state,128,32,bg,6);
    auto(c,128,32,"HORIZONTAL",10,4);
    text("Label",state,0,0,12,fg,"medium",c);
    return c;
  }
  function stepVariant(state) {
    const c=component("State="+state,202,43,null,0);
    rect("Index",0,0,34,34,state==="Current"?COLORS.primary:state==="Complete"?COLORS.successSoft:"#EEF2F1",17,c);
    text("Step number",state==="Complete"?"✓":"1",12,7,15,state==="Current"?COLORS.surface:state==="Complete"?COLORS.success:COLORS.muted,"bold",c);
    text("Step label",state==="Current"?"Delivery":state==="Complete"?"Done":"Payment",46,9,14,
      state==="Current"?COLORS.ink:COLORS.muted,"medium",c);
    return c;
  }
  function transactionVariant(direction) {
    const isIn=direction==="In";
    const c=component("Direction="+direction,420,76,COLORS.surface,9,COLORS.border);
    rect("Direction icon",16,16,42,42,isIn?COLORS.successSoft:"#FBEFE8",8,c);
    text("Direction",isIn?"↓":"↑",30,25,19,isIn?COLORS.success:"#A76549","bold",c);
    text("Description",isIn?"Income entry":"Expense entry",72,17,13,COLORS.ink,"medium",c);
    text("Meta",isIn?"Income · Today":"Spending · Today",72,42,11,COLORS.muted,"regular",c);
    text("Amount",isIn?"+₹500.00":"−₹125.25",300,26,13,isIn?COLORS.success:COLORS.ink,"medium",c);
    return c;
  }
  function navVariant(state){
    const c=component("State="+state,175,44,state==="Active"?COLORS.soft:COLORS.surface,6);
    text("Label",state==="Active"?"Overview":"Activity",18,12,14,state==="Active"?COLORS.primary:COLORS.muted,"medium",c);
    return c;
  }
  function cardVariant(state) {
    const c=component("State="+state,360,154,state==="Dark"?COLORS.dark:COLORS.surface,10,
      state==="Dark"?null:COLORS.border);
    text("Card eyebrow",state==="Dark"?"RECORDED BALANCE":"THIS MONTH",20,19,11,state==="Dark"?COLORS.mint:COLORS.muted,"medium",c);
    text("Card amount","₹0.00",20,52,38,state==="Dark"?COLORS.surface:COLORS.ink,"bold",c);
    text("Card helper","Sample state · no linked account",20,116,11,state==="Dark"?"#AEC4BB":COLORS.muted,"regular",c);
    return c;
  }
  function annotateShape(parentNode,x,y,label,color,width=260) {
    rect("Token swatch",x,y,68,68,color,8,parentNode,color===COLORS.surface?COLORS.border:null);
    text("Token name",label,x+84,y+10,16,COLORS.ink,"medium",parentNode);
    text("Hex value",color,x+84,y+37,12,COLORS.muted,"regular",parentNode);
  }
  function createVariables() {
    const collection = figma.variables.createVariableCollection("Interface Craft / Core");
    const mode=collection.modes[0].modeId;
    collection.renameMode(mode,"Light");
    const colors={};
    for(const [name,color] of Object.entries(COLORS)){
      const v=figma.variables.createVariable("color/"+name,collection,"COLOR");
      v.setValueForMode(mode,{...rgb(color),a:1});
      colors[name]=v;
      VARS[color.toUpperCase()]=v;
    }
    for(const [name,value] of Object.entries({4:4,8:8,12:12,16:16,20:20,24:24,32:32})){
      const v=figma.variables.createVariable("space/"+name,collection,"FLOAT");
      v.setValueForMode(mode,value);
    }
    for(const [name,value] of Object.entries({control:6,card:10,surface:12})){
      const v=figma.variables.createVariable("radius/"+name,collection,"FLOAT");
      v.setValueForMode(mode,value);
    }
    return colors;
  }
  function createStyles(){
    const data=[["Display / 36",36,2],["Heading / 24",24,2],["Title / 20",20,1],
      ["Body / 14",14,0],["Caption / 12",12,0],["Label / 12",12,1]];
    for(const [name,size,index] of data){
      const s=figma.createTextStyle();
      s.name=name;s.fontName=FONTS[index];s.fontSize=size;
    }
    for(const [name,color] of Object.entries(COLORS)){
      const style=figma.createPaintStyle();
      style.name="Color / "+name;style.paints=[paint(color)];
    }
  }
  async function switchPage(target){
    await figma.setCurrentPageAsync(target);
    page=target;
  }

  function foundations(){
    const cover=frame("Interface Craft / Cover & Foundations",0,0,1440,1440,COLORS.canvas,0);
    rect("Hero",0,0,1440,320,COLORS.dark,0,cover);
    text("Wordmark","interfacecraft.",78,86,48,COLORS.surface,"bold",cover);
    text("Eyebrow","UI/UX INTERNSHIP    •    DESIGN SYSTEM V1.0",78,158,13,COLORS.mint,"medium",cover);
    text("Subheading","Reusable foundations, intentional states, consistent interaction.",78,213,19,"#B4C8C1","regular",cover);
    sectionTitle("01","Colour roles",74,366,cover);
    const swatches=Object.entries(COLORS).slice(0,12);
    swatches.forEach(([name,color],i)=> {
      const col=i%3,row=Math.floor(i/3);
      const x=74+col*434,y=445+row*111;
      rect("Swatch group",x,y,409,90,COLORS.surface,10,cover,COLORS.border);
      annotateShape(cover,x+11,y+11,name,color);
    });
    sectionTitle("02","Type hierarchy",74,926,cover);
    text("Display / 36","Your money, in view.",74,1018,36,COLORS.ink,"bold",cover);
    text("Heading / 24","Clear paths and reassuring feedback",74,1081,24,COLORS.ink,"medium",cover);
    text("Body / 14","Readable descriptions, balanced line length, and honest data states.",74,1137,14,COLORS.muted,"regular",cover);
    sectionTitle("03","Spacing & radii",74,1190,cover);
    text("Spacing","4   /   8   /   12   /   16   /   20   /   24   /   32",74,1280,17,COLORS.ink,"medium",cover);
    text("Radii","Controls 6   /   Cards 10   /   Hero 12",74,1317,14,COLORS.muted,"regular",cover);
    text("Guidance","Text errors + visible focus states · 44px action targets · no fabricated account data.",74,1360,12,COLORS.muted,"regular",cover);
    return cover;
  }

  function components(){
    const board=frame("Interface Craft / Native Components",0,0,1530,1660,COLORS.canvas,0);
    text("Page title","Component library",66,57,38,COLORS.ink,"bold",board);
    text("Page subtitle","Each green diamond is a native Figma component, grouped in a variant set.",66,115,15,COLORS.muted,"regular",board);
    // Components must be created on the page, not inside the display frame, before combining.
    const sets=[];
    const buttonNodes=[];
    ["Primary","Secondary","Danger"].forEach(kind=>["Default","Hover","Focus","Disabled"].forEach(state=>
      buttonNodes.push(buttonVariant(kind,state))));
    sets.push(combine("Button",buttonNodes,66,210,4,176,44));
    const inputs=["Default","Focus","Error","Disabled"].map(inputVariant);
    sets.push(combine("Text field",inputs,66,565,2,286,84));
    const badges=["Neutral","Success","Warning","Error"].map(badgeVariant);
    sets.push(combine("Status badge",badges,850,565,2,128,32));
    const transactions=["In","Out"].map(transactionVariant);
    sets.push(combine("Transaction row",transactions,66,1000,1,420,76));
    const steps=["Pending","Current","Complete"].map(stepVariant);
    sets.push(combine("Checkout step",steps,760,980,1,202,43));
    sets.push(combine("Navigation item",["Active","Idle"].map(navVariant),1100,980,1,175,44));
    sets.push(combine("Balance card",["Light","Dark"].map(cardVariant),66,1380,2,360,154));
    text("Legend","Button   ·   Field   ·   Badge   ·   Transaction   ·   Step   ·   Navigation   ·   Card",66,1630,14,COLORS.muted,"regular",board);
    return { board, sets, button:buttonNodes[0] };
  }

  function preview(name,x,y,w,h){
    const s=frame(name,x,y,w,h,COLORS.canvas,0);
    s.clipsContent=true;
    return s;
  }
  function surface(s,name,x,y,w,h,colour=COLORS.surface,radius=10,border=COLORS.border){
    return rect(name,x,y,w,h,colour,radius,s,border);
  }
  function instanceButton(source,s,label,x,y,w=178){
    const i=source.createInstance();
    s.appendChild(i);i.x=x;i.y=y;
    i.resize(w,44);
    const title=i.findOne(n=>n.type==="TEXT");
    if(title)title.characters=label;
    return i;
  }
  function walletScreen(x,y,mobile,button){
    const w=mobile?390:1440,h=mobile?1100:960,p=preview("Wallet / "+(mobile?"Mobile 390":"Desktop 1440"),x,y,w,h);
    if(!mobile){
      rect("Sidebar",0,0,254,h,COLORS.dark,0,p);
      text("Wordmark","interfacecraft.",24,39,24,COLORS.surface,"bold",p);
      text("Label","WALLET",26,71,11,COLORS.mint,"medium",p);
      ["Overview","Activity","Data & privacy"].forEach((label,i)=>{
        if(i===0)rect("Navigation active",17,139,220,44,"#23473F",7,p);
        text("Navigation / "+label,label,37,152+i*55,14,i===0?COLORS.surface:"#AFC6BE","medium",p);
      });
      text("Breadcrumb","Wallet   /   Overview",305,38,12,COLORS.muted,"regular",p);
      text("Page heading","Your money, in view.",305,135,38,COLORS.ink,"bold",p);
      text("Description","Every entry starts with you. No preloaded transactions.",306,194,14,COLORS.muted,"regular",p);
      surface(p,"Balance surface",305,247,654,240,COLORS.dark,10,null);
      text("Balance label","RECORDED BALANCE",334,277,12,COLORS.mint,"medium",p);
      text("Balance value","₹0.00",334,335,60,COLORS.surface,"bold",p);
      rule("Balance rule",334,423,580,p,"#45665D");
      text("Balance helper","Based on entries recorded on this device.",334,441,12,"#B4C8C1","regular",p);
      surface(p,"Monthly surface",979,247,396,240);
      text("Monthly label","THIS MONTH",1002,279,13,COLORS.muted,"medium",p);
      text("Incoming value","↓  Money in                                 ₹0.00",1002,338,13,COLORS.success,"medium",p);
      text("Outgoing value","↑  Money out                                ₹0.00",1002,397,13,COLORS.ink,"medium",p);
      text("Section label","Record a transaction",306,534,23,COLORS.ink,"bold",p);
      instanceButton(button,p,"Money in",306,588,178);
      surface(p,"Secondary action",505,588,178,44);
      text("Secondary label","Money out",534,602,14,COLORS.ink,"medium",p);
      surface(p,"Activity surface",305,679,1070,216);
      text("Activity label","Activity",331,706,21,COLORS.ink,"bold",p);
      rule("Divider",333,752,1010,p);
      text("Empty heading","A clean slate.",333,784,18,COLORS.ink,"bold",p);
      text("Empty explanation","New activity appears here once you record an entry.",333,822,13,COLORS.muted,"regular",p);
    } else {
      rect("Mobile header",0,0,w,76,COLORS.dark,0,p);
      text("Wordmark","interfacecraft.",18,24,23,COLORS.surface,"bold",p);
      text("Mobile caption","WALLET",21,50,10,COLORS.mint,"medium",p);
      text("Eyebrow","WALLET   /   OVERVIEW",18,110,11,COLORS.primary,"medium",p);
      text("Title","Your money,",18,151,33,COLORS.ink,"bold",p);
      text("Title continuation","in view.",18,193,33,COLORS.ink,"bold",p);
      text("Description","Every entry starts with you.",18,248,13,COLORS.muted,"regular",p);
      surface(p,"Balance surface",18,293,354,208,COLORS.dark,12,null);
      text("Recorded balance","RECORDED BALANCE",38,317,11,COLORS.mint,"medium",p);
      text("Amount","₹0.00",38,364,44,COLORS.surface,"bold",p);
      rule("Divider",38,441,312,p,"#446359");
      text("Helper","From entries on this device.",38,456,11,"#AEC4BC","regular",p);
      surface(p,"Monthly surface",18,518,354,184);
      text("Monthly label","This month",38,539,18,COLORS.ink,"medium",p);
      text("Money in","↓  Money in",38,584,13,COLORS.success,"medium",p);
      text("Incoming sum","₹0.00",288,584,13,COLORS.ink,"bold",p);
      text("Money out","↑  Money out",38,636,13,COLORS.ink,"medium",p);
      text("Outgoing sum","₹0.00",288,636,13,COLORS.ink,"bold",p);
      text("Section heading","Record a transaction",19,743,19,COLORS.ink,"bold",p);
      instanceButton(button,p,"Money in",19,793,170);
      surface(p,"Out button",201,793,170,44);
      text("Money out","Money out",232,807,13,COLORS.ink,"medium",p);
      surface(p,"Activity",18,862,354,193);
      text("Activity label","Activity",38,888,19,COLORS.ink,"bold",p);
      rule("Activity divider",38,930,314,p);
      text("Empty title","A clean slate.",38,949,16,COLORS.ink,"bold",p);
      text("Empty helper","Your entries will appear here.",38,983,12,COLORS.muted,"regular",p);
    }
    return p;
  }

  function checkoutScreen(x,y,mobile,button){
    const w=mobile?390:1440,h=mobile?1160:960,p=preview("Checkout / "+(mobile?"Mobile 390":"Desktop 1440"),x,y,w,h);
    const off=mobile?18:100;
    rect("Header",0,0,w,mobile?76:85,COLORS.surface,0,p);
    rule("Header rule",0,mobile?75:84,w,p);
    text("Brand","interfacecraft.",off,mobile?23:35,mobile?22:24,COLORS.primary,"bold",p);
    text("Section","CHECKOUT",off+2,mobile?50:62,10,COLORS.muted,"medium",p);
    if(!mobile){
      text("Eyebrow","INTERFACE CRAFT  /  CHECKOUT",off,149,12,COLORS.primary,"medium",p);
      text("Main headline","One clear path to checkout.",off,192,39,COLORS.ink,"bold",p);
      text("Subtitle","Review your basket, enter delivery details and complete the example.",off,254,14,COLORS.muted,"regular",p);
      surface(p,"Delivery form",off,323,751,537);
      text("Form kicker","STEP 01 / 02",off+30,358,12,COLORS.primary,"medium",p);
      text("Form title","Where should we deliver?",off+30,392,26,COLORS.ink,"bold",p);
      const fields=[["Full name",off+30,460],["Email address",off+387,460],["Street address",off+30,566],["City",off+30,672],["PIN code",off+387,672]];
      fields.forEach(([label,fx,fy])=>{
        text(label,label,fx,fy,12,COLORS.ink,"medium",p);
        surface(p,label+" input",fx,fy+25,label==="Street address"?688:332,44);
      });
      instanceButton(button,p,"Continue",off+30,785,226);
      surface(p,"Order summary",884,323,455,537);
      text("Summary kicker","YOUR BASKET",910,359,12,COLORS.primary,"medium",p);
      text("Summary title","Order summary",910,391,24,COLORS.ink,"bold",p);
      rule("Rule",910,447,397,p);
      text("Item 1","Cloud Knit Runner",910,476,16,COLORS.ink,"medium",p);
      text("Item option","Sand / Size 8",910,500,12,COLORS.muted,"regular",p);
      text("Price","₹2,799.00",1215,488,13,COLORS.ink,"medium",p);
      rule("Rule",910,543,397,p);
      text("Item 2","Everyday Canvas Tote",910,566,16,COLORS.ink,"medium",p);
      text("Item option","Natural / One size",910,590,12,COLORS.muted,"regular",p);
      text("Price","₹899.00",1233,574,13,COLORS.ink,"medium",p);
      rule("Totals rule",910,650,397,p);
      text("Label","Total (sample)",910,694,15,COLORS.muted,"medium",p);
      text("Amount","₹3,698.00",1192,694,17,COLORS.ink,"bold",p);
      text("Disclaimer","No real order or payment is placed.",910,766,12,COLORS.muted,"regular",p);
    } else {
      text("Eyebrow","CHECKOUT  /  DELIVERY",18,109,11,COLORS.primary,"medium",p);
      text("Heading","One clear path",18,148,30,COLORS.ink,"bold",p);
      text("Heading continued","to checkout.",18,187,30,COLORS.ink,"bold",p);
      text("Subtitle","Sample order · No payment collected",18,237,12,COLORS.muted,"regular",p);
      surface(p,"Order summary",18,277,354,307);
      text("Summary kicker","YOUR BASKET",36,302,11,COLORS.primary,"medium",p);
      text("Summary title","Order summary",36,326,19,COLORS.ink,"bold",p);
      rule("Divider",36,364,320,p);
      text("Item 1","Cloud Knit Runner",36,389,14,COLORS.ink,"medium",p);
      text("Item 1 sum","₹2,799",287,389,12,COLORS.ink,"medium",p);
      text("Item 2","Everyday Canvas Tote",36,443,14,COLORS.ink,"medium",p);
      text("Item 2 sum","₹899",310,443,12,COLORS.ink,"medium",p);
      rule("Divider",36,499,320,p);
      text("Total label","Total",36,520,16,COLORS.muted,"medium",p);
      text("Total value","₹3,698.00",243,520,18,COLORS.ink,"bold",p);
      surface(p,"Delivery form",18,606,354,509);
      text("Step kicker","STEP 01 / 02",36,631,11,COLORS.primary,"medium",p);
      text("Form title","Where should we deliver?",36,659,19,COLORS.ink,"bold",p);
      [["Full name",705],["Email address",792],["Street address",879],["PIN code",966]].forEach(([label,fy])=>{
        text(label,label,36,fy,12,COLORS.ink,"medium",p);
        surface(p,label+" input",36,fy+22,318,43);
      });
      instanceButton(button,p,"Continue",36,1054,318);
    }
    return p;
  }

  try {
    await fonts();
    createVariables();
    createStyles();

    // Three pages total keeps the file compatible with Figma's free Starter plan.
    const foundationPage=figma.currentPage;
    foundationPage.name="00 · Foundations";
    page=foundationPage;
    const cover=foundations();
    foundationPage.setPluginData("interface-craft","foundation");

    const componentPage=figma.createPage();
    componentPage.name="01 · Native components";
    await switchPage(componentPage);
    const lib=components();
    componentPage.setPluginData("interface-craft","components");

    const screensPage=figma.createPage();
    screensPage.name="02 · Wallet & Checkout screens";
    await switchPage(screensPage);
    walletScreen(0,0,false,lib.button);
    walletScreen(1490,0,true,lib.button);
    checkoutScreen(0,1050,false,lib.button);
    checkoutScreen(1490,1250,true,lib.button);
    screensPage.setPluginData("interface-craft","screens");
    figma.viewport.scrollAndZoomIntoView(screensPage.children);
    figma.closePlugin("Interface Craft built: 3 pages, native variants, variables and editable desktop/mobile screens.");
  } catch (error) {
    const reason=error && error.message ? error.message : String(error);
    figma.closePlugin("Builder stopped: "+reason);
  }
})();
