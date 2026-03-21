import { useState, useRef, useEffect, useCallback } from "react";
import * as mammoth from "mammoth";

const LOGO = "data:image/png;base64,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";

/* STORAGE */
const DK = "difilex-d4", PK = "difilex-p4";
// Draft storage: localStorage (per browser)
function ldLocal(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } }
function svLocal(k, d) { try { localStorage.setItem(k, JSON.stringify(d)); } catch {} }
// Published storage: server JSON file (persistent)
async function ldServer() { try { const r = await fetch("/api/content"); if (!r.ok) return null; return await r.json(); } catch { return null; } }
async function svServer(d) { try { await fetch("/api/content", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d) }); } catch {} }
// Server is available in self-hosted mode
const hasServer = true;
async function ldPub() {
  if (hasServer) { const d = await ldServer(); if (d) return d; }
  return ldLocal(PK);
}
async function svPub(d) {
  if (hasServer) await svServer(d);
  svLocal(PK, d);
}
async function ldDraft() {
  return ldLocal(DK);
}
async function svDraft(d) {
  svLocal(DK, d);
}
async function ldPref(k) {
  return ldLocal(k);
}
async function svPref(k, d) {
  svLocal(k, d);
}

/* AI */
function serializePages(pages) {
  return Object.values(pages).map(p => {
    const body = p.blocks.map(b => {
      const t = (b.text || "").replace(/<[^>]+>/g, "");
      if (b.type === "h1") return "# " + t;
      if (b.type === "h2") return "## " + t;
      if (b.type === "h3") return "### " + t;
      if (b.type === "ul" || b.type === "ol") return (b.items || []).map(it => "- " + it.replace(/<[^>]+>/g, "")).join("\n");
      if (b.type === "quote") return "> " + t;
      if (b.type === "callout") return "[" + (b.variant || "info") + "] " + t;
      if (b.type === "code") return "```" + (b.language||"") + "\n" + (b.code||"") + "\n```";
      if (b.type === "table") return (b.rows||[]).map(r=>r.join(" | ")).join("\n");
      return t;
    }).join("\n\n");
    return "=== " + p.title + " ===\n" + body;
  }).join("\n\n");
}

async function askAI(question, pages) {
  try {
    const docs = serializePages(pages).slice(0, 12000);
    const names = Object.values(pages).map(p => p.title).join(", ");
    const sys = "You are Difilex AI, a documentation assistant. You ONLY answer based on the published documentation provided below. If the answer cannot be found in the documentation, say: 'This topic is not covered in the current documentation. The following pages are available:' and list the page titles.\n\nAvailable pages: " + names + "\n\nSTYLE: Write in narrative, professional style. Use **bold** for key terms. Use flowing paragraphs, NOT headers or bullet points. NEVER use ## or # or markdown headers. If Dutch question, answer in formal juridisch Nederlands. If English, formal legal English.\n\nSOURCES: You MUST end your answer with source references. On new lines at the very end, list ALL pages you used with this exact format:\n[SOURCE: exact page title]\nUse the exact page titles from the documentation. Always include at least one source if you found relevant information.\n\n<DOCS>\n" + docs + "\n</DOCS>";
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: sys, messages: [{ role: "user", content: question }] }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("AI API error:", res.status, err);
      return "AI fout (HTTP " + res.status + "): " + (err || "onbekend").slice(0, 200);
    }
    const data = await res.json();
    if (data.error) return "AI fout: " + (data.error.message || JSON.stringify(data.error));
    return data.content?.map(c => c.text || "").join("") || "Geen antwoord ontvangen.";
  } catch (e) {
    console.error("AI error:", e);
    return "Kon geen verbinding maken met AI. Probeer het opnieuw.";
  }
}

/* MARKDOWN PARSER */
function parseMd(md) {
  const lines = md.split("\n");
  const blocks = [];
  let i = 0;
  const uid = () => "b" + Date.now() + "_" + Math.random().toString(36).slice(2,7);
  const fmt = (t) => t.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/\*([^*]+)\*/g,"<i>$1</i>").replace(/~~([^~]+)~~/g,"<s>$1</s>");
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (line === "") { i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { blocks.push({id:uid(),type:"divider"}); i++; continue; }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const cl = []; i++;
      while (i < lines.length && !lines[i].trimEnd().startsWith("```")) { cl.push(lines[i]); i++; }
      i++;
      blocks.push({id:uid(),type:"code",code:cl.join("\n"),language:lang});
      continue;
    }
    if (/^### /.test(line)) { blocks.push({id:uid(),type:"h3",text:fmt(line.slice(4))}); i++; continue; }
    if (/^## /.test(line)) { blocks.push({id:uid(),type:"h2",text:fmt(line.slice(3))}); i++; continue; }
    if (/^# /.test(line)) { blocks.push({id:uid(),type:"h1",text:fmt(line.slice(2))}); i++; continue; }
    const cm = line.match(/^>\s*\[(info|warning|danger|success)\]\s*(.*)/i);
    if (cm) {
      const cl = [cm[2]]; i++;
      while (i < lines.length && lines[i].trimEnd().startsWith(">")) { cl.push(lines[i].trimEnd().replace(/^>\s?/,"")); i++; }
      blocks.push({id:uid(),type:"callout",text:fmt(cl.join(" ")),variant:cm[1].toLowerCase()});
      continue;
    }
    if (line.startsWith("> ")) {
      const ql = []; while (i < lines.length && lines[i].trimEnd().startsWith(">")) { ql.push(lines[i].trimEnd().replace(/^>\s?/,"")); i++; }
      blocks.push({id:uid(),type:"quote",text:fmt(ql.join(" "))});
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const it = []; while (i < lines.length && /^\d+\.\s/.test(lines[i].trimEnd())) { it.push(fmt(lines[i].trimEnd().replace(/^\d+\.\s/,""))); i++; }
      blocks.push({id:uid(),type:"ol",items:it});
      continue;
    }
    if (/^[-*+]\s/.test(line)) {
      const it = []; while (i < lines.length && /^[-*+]\s/.test(lines[i].trimEnd())) { it.push(fmt(lines[i].trimEnd().replace(/^[-*+]\s/,""))); i++; }
      blocks.push({id:uid(),type:"ul",items:it});
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      const rows = []; while (i < lines.length && lines[i].trim().startsWith("|")) {
        const row = lines[i].trim().split("|").filter(Boolean).map(c=>c.trim());
        if (!row.every(c=>/^[-:]+$/.test(c))) rows.push(row);
        i++;
      }
      blocks.push({id:uid(),type:"table",rows});
      continue;
    }
    const pl = []; while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3} |```|[-*+]\s|\d+\.\s|> |---$|\|)/.test(lines[i].trimEnd())) { pl.push(lines[i].trimEnd()); i++; }
    if (pl.length > 0) blocks.push({id:uid(),type:"p",text:fmt(pl.join(" "))});
    else i++;
  }
  return blocks;
}

/* CONTENT */
let _i = 1;
const uid = () => "b" + (_i++);

const DP = {
  "ch7": {
    id:"ch7", title:"Chapter 7 — Overview", icon:"§", children:["s71","s72","s73","s74"],
    blocks: [
      {id:uid(),type:"h1",text:"Bank Recovery, Resolution, and Insolvency"},
      {id:uid(),type:"subtitle",text:"The EU Framework from Bailout to Bail-In"},
      {id:uid(),type:"p",text:"The European Union’s bank resolution framework represents the most consequential post-crisis reform in financial law — a complete overhaul of how failing banks are managed, shifting losses from taxpayers to shareholders and creditors."},
      {id:uid(),type:"p",text:"Built on the <b>Bank Recovery and Resolution Directive</b> (Directive 2014/59/EU), the <b>Single Resolution Mechanism</b> (Regulation 806/2014), and the <b>Deposit Guarantee Schemes Directive</b> (Directive 2014/49/EU), this framework establishes a cradle-to-grave regime."},
      {id:uid(),type:"callout",text:"The Netherlands played a pioneering role: the 2012 <b>Interventiewet</b> anticipated the BRRD, the <b>SNS REAAL expropriation</b> tested bail-in before it became EU law.",variant:"info"},
    ],
  },
  "s71": {
    id:"s71", title:"7.1 — From Bailout to Bail-In", icon:"§", children:[],
    blocks: [
      {id:uid(),type:"h1",text:"7.1 The Policy Rationale: From Bailout to Bail-In"},
      {id:uid(),type:"p",text:"The 2008–2012 banking crisis exposed a fundamental structural flaw. Banks operated across borders while supervision remained national."},
      {id:uid(),type:"callout",text:"EU member states committed approximately <b>€4.9 trillion</b> — roughly 39% of EU GDP — in guarantees and recapitalisations.",variant:"warning"},
      {id:uid(),type:"h2",text:"The Global Reform Agenda"},
      {id:uid(),type:"p",text:"The G20 Pittsburgh Summit (2009) committed leaders to develop resolution tools. The <b>FSB</b> responded with its <b>Key Attributes</b> (October 2011)."},
      {id:uid(),type:"quote",text:"The core objective was to make feasible the resolution of financial institutions without severe systemic disruption and without exposing taxpayers to loss."},
      {id:uid(),type:"h2",text:"The Dutch Experience"},
      {id:uid(),type:"ul",items:["<b>ING Group (2008)</b> — €10bn state injection","<b>Fortis/ABN AMRO (2008)</b> — Acquired for €16.8bn","<b>DSB Bank (2009)</b> — Bank run, €600m drained","<b>SNS REAAL (2013)</b> — Interventiewet expropriation"]},
      {id:uid(),type:"code",code:"// Example: BRRD Article 32 conditions\nconst resolutionConditions = {\n  foltf: true,      // Failing or likely to fail\n  noAlternative: true,  // No private sector solution\n  publicInterest: true  // Resolution in public interest\n};",language:"javascript"},
    ],
  },
  "s72": {
    id:"s72", title:"7.2 — The BRRD", icon:"§", children:[],
    blocks: [
      {id:uid(),type:"h1",text:"7.2 The Bank Recovery and Resolution Directive"},
      {id:uid(),type:"p",text:"Proposed 6 June 2012, adopted 15 May 2014, with <b>Article 114 TFEU</b> as legal basis."},
      {id:uid(),type:"h2",text:"Structure of the BRRD"},
      {id:uid(),type:"table",rows:[["Title","Articles","Subject"],["I","1–3","Scope and definitions"],["II","4–26","Recovery & resolution planning"],["III","27–30","Early intervention"],["IV","31–86","Resolution framework, bail-in, MREL"],["V–VI","87–98","Cross-border & third-country"]]},
      {id:uid(),type:"h2",text:"Key Legal Concepts"},
      {id:uid(),type:"ul",items:["<b>Critical functions</b> (Art. 2(1)(35)) — Essential services","<b>Public interest assessment</b> — Resolution vs. insolvency","<b>NCWO principle</b> (Art. 73–75) — No creditor worse off"]},
    ],
  },
  "s73": {
    id:"s73", title:"7.3 — Resolution Tools", icon:"§", children:[],
    blocks: [
      {id:uid(),type:"h1",text:"7.3 Resolution: Tools & Powers"},
      {id:uid(),type:"h2",text:"Three Conditions (Article 32)"},
      {id:uid(),type:"ol",items:["Institution is <b>failing or likely to fail</b>","No alternative measures available","Resolution is in the <b>public interest</b>"]},
      {id:uid(),type:"h2",text:"Bail-In Hierarchy"},
      {id:uid(),type:"ol",items:["CET1 written down first","AT1 instruments","Tier 2","Other subordinated debt","Senior unsecured","Eligible deposits >€100,000"]},
      {id:uid(),type:"callout",text:"Minimum <b>8% of TLOF</b> bail-in before SRF contributes, capped at <b>5% of TLOF</b>.",variant:"danger"},
    ],
  },
  "s74": {
    id:"s74", title:"7.4 — SRM & MREL", icon:"§", children:[],
    blocks: [
      {id:uid(),type:"h1",text:"7.4 The SRM & MREL"},
      {id:uid(),type:"p",text:"The <b>SRM Regulation (806/2014)</b> centralises resolution within the Banking Union."},
      {id:uid(),type:"h2",text:"Dutch Bank MREL Compliance"},
      {id:uid(),type:"table",rows:[["Bank","MREL Ratio","Requirement","Surplus"],["ING Group (G-SIB)","33.3%","23.75%","+9.6%"],["ABN AMRO","31.8%","28.4%","+3.4%"],["Rabobank","20.9%","28.8%","−7.9%"]]},
      {id:uid(),type:"callout",text:"Aggregate shortfall at Q4 2024: <b>€0.6bn</b> (0.01% of TREA).",variant:"success"},
      {id:uid(),type:"h2",text:"CMDI Reform"},
      {id:uid(),type:"p",text:"Application expected <b>mid-2028</b>. Expands resolution perimeter and permits DGS to supplement MREL."},
    ],
  },
};

const DS = [
  {id:"s1",label:"Overview",pages:["ch7"]},
  {id:"s2",label:"Policy & Framework",pages:["s71","s72"]},
  {id:"s3",label:"Tools & Mechanisms",pages:["s73","s74"]},
];

const DM = {title:"EU Financial Regulation",subtitle:"A Living Regulatory Book for Practitioners",pw:"admin",pub:null,versions:[]};

/* RESPONSIVE HOOK */
function useScreen() {
  const [w, setW] = useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{
    const h=()=>setW(window.innerWidth);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);
  return {isMobile:w<768, isTablet:w>=768&&w<1024, isDesktop:w>=1024, w};
}

/* THEMES */
const LIGHT = {
  bg:"#f9f9f7",fg:"#1a1a1a",fgBody:"#262626",fgMuted:"#737373",fgFaint:"#a3a3a3",
  border:"#e5e5e3",hover:"#f0efec",card:"#fff",surface:"#f9f9f7",
  sBg:"#f9f9f7",sText:"#737373",sActive:"#eff6ff",sActText:"#1e3a5f",
  eBg:"#1a1a1a",eBorder:"#333",eText:"#a3a3a3",eActive:"#333",eActText:"#fff",eFaint:"#525252",
  codeBg:"#1a1625",codeText:"#e2e0ea",codeBorder:"#2a2638",
  ac:"#1e3a5f",acLight:"#eff6ff",
  hf:"'Libre Baskerville','Georgia',serif",bf:"'Source Serif 4','Georgia',serif",mf:"'IBM Plex Mono',monospace",uf:"'Aptos','Calibri','Segoe UI',sans-serif",
};
const DARK = {
  bg:"#111113",fg:"#e4e4e7",fgBody:"#d4d4d8",fgMuted:"#a1a1aa",fgFaint:"#52525b",
  border:"#27272a",hover:"#1c1c1f",card:"#18181b",surface:"#111113",
  sBg:"#18181b",sText:"#a1a1aa",sActive:"#1e293b",sActText:"#93c5fd",
  eBg:"#09090b",eBorder:"#27272a",eText:"#a1a1aa",eActive:"#27272a",eActText:"#fff",eFaint:"#52525b",
  codeBg:"#09090b",codeText:"#d4d4d8",codeBorder:"#27272a",
  ac:"#60a5fa",acLight:"#1e293b",
  hf:"'Libre Baskerville','Georgia',serif",bf:"'Source Serif 4','Georgia',serif",mf:"'IBM Plex Mono',monospace",uf:"'Aptos','Calibri','Segoe UI',sans-serif",
};

/* EXPANDABLE BLOCK */
function ExpandableBlock({b, ed, onUp, T}) {
  const [open, setOpen] = useState(!!b.open);
  const title = b.title || "Click to expand";
  const content = b.text || "";
  if (ed) {
    return (
      <div style={{margin:"14px 0",border:"1px solid "+T.border,borderRadius:6,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:T.hover,cursor:"pointer"}} onClick={()=>setOpen(!open)}>
          <span style={{fontSize:9,color:T.fgFaint,transform:open?"rotate(90deg)":"none",transition:"transform .15s"}}>▸</span>
          <input value={b.title||""} onChange={e=>onUp({...b,title:e.target.value})} onClick={e=>e.stopPropagation()} placeholder="Section title…"
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:14,fontWeight:600,color:T.fg,fontFamily:T.bf}} />
        </div>
        {open && (
          <div style={{padding:"12px 14px",borderTop:"1px solid "+T.border}}>
            <div contentEditable suppressContentEditableWarning onBlur={e=>onUp({...b,text:e.currentTarget.innerHTML})} dangerouslySetInnerHTML={{__html:content}}
              style={{fontSize:14,lineHeight:1.7,color:T.fgBody,fontFamily:T.bf,outline:"none",minHeight:40}} />
          </div>
        )}
      </div>
    );
  }
  return (
    <div style={{margin:"14px 0",border:"1px solid "+T.border,borderRadius:6,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:T.hover,cursor:"pointer",transition:"background .1s"}}
        onClick={()=>setOpen(!open)}
        onMouseEnter={e=>e.currentTarget.style.background=T.acLight}
        onMouseLeave={e=>e.currentTarget.style.background=T.hover}>
        <span style={{fontSize:9,color:T.ac,transform:open?"rotate(90deg)":"none",transition:"transform .15s"}}>▸</span>
        <span style={{flex:1,fontSize:14,fontWeight:600,color:T.fg,fontFamily:T.bf}}>{title}</span>
        <span style={{fontSize:10,color:T.fgFaint,fontFamily:T.mf}}>{open?"Hide":"Show"}</span>
      </div>
      {open && (
        <div style={{padding:"12px 14px",borderTop:"1px solid "+T.border}}>
          <div dangerouslySetInnerHTML={{__html:content}} style={{fontSize:14,lineHeight:1.7,color:T.fgBody,fontFamily:T.bf}} />
        </div>
      )}
    </div>
  );
}

/* STEPS BLOCK */
function StepsBlock({b, ed, onUp, T}) {
  const steps = b.steps || [{title:"Step 1",text:""}];
  if (ed) {
    return (
      <div style={{margin:"14px 0"}}>
        {steps.map((s,i) => (
          <div key={i} style={{display:"flex",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:T.ac,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:T.mf}}>{i+1}</div>
              {i<steps.length-1&&<div style={{width:2,flex:1,background:T.border,minHeight:20}} />}
            </div>
            <div style={{flex:1,paddingBottom:i<steps.length-1?16:0}}>
              <input value={s.title} onChange={e=>{const ns=[...steps];ns[i]={...ns[i],title:e.target.value};onUp({...b,steps:ns})}} placeholder={"Step "+(i+1)+" title…"}
                style={{width:"100%",border:"none",outline:"none",background:"transparent",fontSize:14,fontWeight:600,color:T.fg,fontFamily:T.bf,marginBottom:4,boxSizing:"border-box"}} />
              <div contentEditable suppressContentEditableWarning
                onBlur={e=>{const ns=[...steps];ns[i]={...ns[i],text:e.currentTarget.innerHTML};onUp({...b,steps:ns})}}
                dangerouslySetInnerHTML={{__html:s.text}} data-placeholder="Description…"
                style={{fontSize:13,lineHeight:1.6,color:T.fgMuted,fontFamily:T.bf,outline:"none",minHeight:20}} />
              {steps.length>1&&<button onClick={()=>{const ns=steps.filter((_,j)=>j!==i);onUp({...b,steps:ns})}}
                style={{marginTop:4,background:"transparent",border:"none",color:T.fgFaint,fontSize:10,cursor:"pointer",fontFamily:T.mf}}
                onMouseEnter={e=>e.currentTarget.style.color="#dc2626"} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>Remove step</button>}
            </div>
          </div>
        ))}
        <button onClick={()=>onUp({...b,steps:[...steps,{title:"Step "+(steps.length+1),text:""}]})}
          style={{marginTop:8,marginLeft:40,padding:"4px 12px",background:"transparent",border:"1px dashed "+T.border,borderRadius:4,cursor:"pointer",fontSize:11,color:T.fgFaint,fontFamily:T.uf}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>+ Add step</button>
      </div>
    );
  }
  return (
    <div style={{margin:"14px 0"}}>
      {steps.map((s,i) => (
        <div key={i} style={{display:"flex",gap:12}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:T.ac,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:T.mf}}>{i+1}</div>
            {i<steps.length-1&&<div style={{width:2,flex:1,background:T.border,minHeight:20}} />}
          </div>
          <div style={{flex:1,paddingBottom:i<steps.length-1?16:0}}>
            <div style={{fontSize:14,fontWeight:600,color:T.fg,fontFamily:T.bf,marginBottom:2}}>{s.title}</div>
            {s.text&&<div dangerouslySetInnerHTML={{__html:s.text}} style={{fontSize:13,lineHeight:1.6,color:T.fgMuted,fontFamily:T.bf}} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/* BLOCK RENDERER */
function Block({b, ed, onUp, T, pages, onNav}) {
  const E = ed ? {contentEditable:true, suppressContentEditableWarning:true} : {};
  const cur = ed ? "text" : "default";
  const sav = (e) => ed && onUp({...b, text: e.currentTarget.innerHTML});
  const savI = (e, i) => { if (!ed) return; const n=[...b.items]; n[i]=e.currentTarget.innerHTML; onUp({...b,items:n}); };
  const hid = (b.type==="h1"||b.type==="h2"||b.type==="h3") ? "hd-"+b.id : undefined;

  switch(b.type) {
    case "h1": return <h1 id={hid} {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:28,fontWeight:400,color:T.fg,lineHeight:1.25,fontFamily:T.hf,margin:"24px 0 8px",borderBottom:"1px solid "+T.border,paddingBottom:8,scrollMarginTop:20,outline:"none",cursor:cur}} />;
    case "h2": return <h2 id={hid} {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:20,fontWeight:400,color:T.fg,lineHeight:1.35,fontFamily:T.hf,margin:"20px 0 6px",scrollMarginTop:20,outline:"none",cursor:cur}} />;
    case "h3": return <h3 id={hid} {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:13,fontWeight:600,color:T.fgMuted,lineHeight:1.4,fontFamily:T.bf,margin:"16px 0 4px",textTransform:"uppercase",letterSpacing:".06em",scrollMarginTop:20,outline:"none",cursor:cur}} />;
    case "subtitle": return <div {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:17,color:T.fgMuted,fontFamily:T.hf,fontStyle:"italic",margin:"-6px 0 20px",lineHeight:1.5,outline:"none",cursor:cur}} />;
    case "p": return <p {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:15.5,lineHeight:1.75,color:T.fgBody,fontFamily:T.bf,margin:"0 0 12px",outline:"none",textAlign:"justify",hyphens:"auto",cursor:cur}} />;
    case "quote": return <blockquote style={{borderLeft:"2px solid "+T.ac,paddingLeft:18,margin:"18px 0"}}><p {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{fontSize:18,lineHeight:1.7,color:T.fgMuted,fontFamily:T.hf,fontStyle:"italic",margin:0,outline:"none",cursor:cur}} /></blockquote>;
    case "callout": {
      const V={info:{bg:T.acLight,c:T.ac,i:"ℹ"},warning:{bg:"#fefce8",c:"#ca8a04",i:"⚠"},danger:{bg:"#fef2f2",c:"#dc2626",i:"⚑"},success:{bg:"#f0fdf4",c:"#16a34a",i:"✓"}}[b.variant]||{bg:T.acLight,c:T.ac,i:"ℹ"};
      return <div style={{display:"flex",gap:14,padding:"16px 20px",background:V.bg,borderLeft:"2px solid "+V.c,borderRadius:"0 3px 3px 0",margin:"14px 0"}}><span style={{fontSize:15,color:V.c,fontWeight:700,lineHeight:"26px",flexShrink:0}}>{V.i}</span><div {...E} onBlur={sav} dangerouslySetInnerHTML={{__html:b.text}} style={{flex:1,fontSize:15,lineHeight:1.7,color:V.c,fontFamily:T.bf,outline:"none",cursor:cur}} /></div>;
    }
    case "ul": return <ul style={{margin:"8px 0 14px",paddingLeft:6,listStyle:"none"}}>{(b.items||[]).map((it,i)=><li key={i} style={{display:"flex",gap:12,marginBottom:5,fontSize:16,lineHeight:1.75,color:T.fgBody,fontFamily:T.bf}}><span style={{color:T.ac,fontSize:8,lineHeight:"30px",flexShrink:0}}>●</span><span {...E} onBlur={e=>savI(e,i)} dangerouslySetInnerHTML={{__html:it}} style={{flex:1,outline:"none",cursor:cur}} /></li>)}</ul>;
    case "ol": return <ol style={{margin:"8px 0 14px",paddingLeft:6,listStyle:"none"}}>{(b.items||[]).map((it,i)=><li key={i} style={{display:"flex",gap:12,marginBottom:5,fontSize:16,lineHeight:1.75,color:T.fgBody,fontFamily:T.bf}}><span style={{color:T.ac,fontSize:14,fontWeight:600,lineHeight:"30px",flexShrink:0,minWidth:22,textAlign:"right",fontFamily:T.mf}}>{i+1}.</span><span {...E} onBlur={e=>savI(e,i)} dangerouslySetInnerHTML={{__html:it}} style={{flex:1,outline:"none",cursor:cur}} /></li>)}</ol>;
    case "code": return (
      <div style={{margin:"14px 0",borderRadius:3,overflow:"hidden",border:"1px solid "+T.codeBorder}}>
        <div style={{display:"flex",justifyContent:"space-between",padding:"5px 14px",background:T.codeBg,borderBottom:"1px solid "+T.codeBorder}}>
          {ed ? <input value={b.language||""} onChange={e=>onUp({...b,language:e.target.value})} placeholder="lang" style={{border:"none",outline:"none",background:"transparent",color:T.fgFaint,fontSize:10,fontFamily:T.mf,width:80}} />
            : <span style={{fontSize:10,color:T.fgFaint,fontFamily:T.mf}}>{b.language||""}</span>}
          <button onClick={()=>navigator.clipboard?.writeText(b.code||"")} style={{background:"transparent",border:"none",color:T.fgFaint,cursor:"pointer",fontSize:10,fontFamily:T.mf}}>Copy</button>
        </div>
        <div contentEditable={ed} suppressContentEditableWarning onBlur={e=>ed&&onUp({...b,code:e.currentTarget.textContent})}
          style={{padding:"14px 18px",fontFamily:T.mf,fontSize:13,lineHeight:1.7,color:T.codeText,background:T.codeBg,whiteSpace:"pre-wrap",outline:"none",minHeight:40,cursor:cur}}>{b.code||""}</div>
      </div>
    );
    case "table": {
      const rows = b.rows || [["",""],["",""]];
      return (
        <div style={{margin:"14px 0",overflowX:"auto",borderRadius:8,border:"1px solid "+T.border}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:T.bf,fontSize:14}}>
            {rows.map((row,ri) => (
              <tr key={ri} style={{background:ri===0?T.acLight:ri%2===0?T.hover:"transparent"}}>
                {row.map((cell,ci) => {
                  const Tag = ri===0 ? "th" : "td";
                  return <Tag key={ci} contentEditable={ed} suppressContentEditableWarning
                    onBlur={e=>{if(!ed)return;const nr=rows.map(r=>[...r]);nr[ri][ci]=e.currentTarget.textContent;onUp({...b,rows:nr})}}
                    style={{padding:"10px 14px",borderBottom:"1px solid "+T.border,textAlign:"left",fontWeight:ri===0?600:400,color:ri===0?T.ac:T.fgBody,outline:"none",whiteSpace:"nowrap",cursor:cur}}
                    dangerouslySetInnerHTML={{__html:cell}} />;
                })}
                {ed && ri===0 && <th style={{width:28,padding:4,borderBottom:"1px solid "+T.border}}>
                  <button onClick={()=>{const nr=rows.map(r=>[...r,""]); onUp({...b,rows:nr})}} style={{background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:13}}>+</button>
                </th>}
              </tr>
            ))}
            {ed && <tr><td colSpan={rows[0]?.length||1} style={{padding:4}}>
              <button onClick={()=>{const nr=[...rows,Array(rows[0]?.length||2).fill("")];onUp({...b,rows:nr})}} style={{background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:11,fontFamily:T.mf}}>+ row</button>
            </td></tr>}
          </table>
        </div>
      );
    }
    case "image": {
      if (ed && !b.src) return (
        <div style={{margin:"16px 0",padding:"28px 20px",border:"2px dashed "+T.border,borderRadius:4,textAlign:"center",cursor:"pointer",background:T.hover}}
          onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.onchange=(ev)=>{const file=ev.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>onUp({...b,src:reader.result,alt:file.name});reader.readAsDataURL(file)};inp.click()}}>
          <div style={{fontSize:13,color:T.fgMuted}}>Click to upload image</div></div>
      );
      return (
        <div style={{margin:"16px 0",borderRadius:8,overflow:"hidden",border:"1px solid "+T.border}}>
          <img src={b.src} alt={b.alt||""} style={{width:"100%",display:"block",maxHeight:500,objectFit:"contain",background:T.card}} />
          {(ed || b.caption) && <div {...E} onBlur={e=>ed&&onUp({...b,caption:e.currentTarget.textContent})} data-placeholder="Caption…"
            style={{padding:"8px 14px",fontSize:12,color:T.fgMuted,fontFamily:T.mf,fontStyle:"italic",borderTop:"1px solid "+T.border,outline:"none",background:T.hover,minHeight:ed?28:undefined}}>{b.caption||""}</div>}
        </div>
      );
    }
    case "embed": {
      if (ed && !b.html) return (
        <div style={{margin:"16px 0",padding:"28px 20px",border:"2px dashed "+T.border,borderRadius:4,textAlign:"center",cursor:"pointer",background:T.hover}}
          onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.accept=".html,.htm,.svg";inp.onchange=async(ev)=>{const file=ev.target.files[0];if(!file)return;const text=await file.text();const isSvg=file.name.toLowerCase().endsWith(".svg");const isInteractive=!isSvg&&(text.includes("<script")||text.includes("<!DOCTYPE")||text.includes("<html"));onUp({...b,html:text,filename:file.name,interactive:isInteractive})};inp.click()}}>
          <div style={{fontSize:13,color:T.fgMuted}}>Click to upload HTML/SVG</div></div>
      );
      // Interactive HTML: render in iframe
      if (b.interactive) {
        return (
          <div style={{margin:"16px 0",borderRadius:8,overflow:"hidden",border:"1px solid "+T.border,background:T.card}}>
            <iframe srcDoc={b.html} style={{width:"100%",minHeight:400,border:"none",borderRadius:"8px 8px 0 0",background:"#fff"}}
              sandbox="allow-scripts allow-same-origin"
              onLoad={e=>{try{const doc=e.target.contentDocument||e.target.contentWindow.document;const h=doc.documentElement.scrollHeight||doc.body.scrollHeight;if(h>50)e.target.style.height=Math.min(h+20,800)+"px"}catch(err){}}} />
            {ed && <div style={{padding:"8px 14px",fontSize:10,color:T.fgFaint,fontFamily:T.mf,borderTop:"1px solid "+T.border,background:T.hover,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{background:T.ac,color:"#fff",padding:"1px 6px",borderRadius:3,fontSize:9}}>Interactive</span>{b.filename||"embed.html"}</span>
              <span style={{fontSize:9,color:T.fgFaint}}>Rendered in sandboxed iframe</span>
            </div>}
          </div>
        );
      }
      // SVG or simple HTML: render inline
      return (
        <div style={{margin:"16px 0",borderRadius:8,overflow:"hidden",border:"1px solid "+T.border,background:T.card}}>
          <div dangerouslySetInnerHTML={{__html:b.html||""}} />
          {ed && <div style={{padding:"6px 14px",fontSize:10,color:T.fgFaint,fontFamily:T.mf,borderTop:"1px solid "+T.border,background:T.hover}}>{b.filename||"embed"}</div>}
        </div>
      );
    }
    case "pagelink": {
      const target = pages?.[b.targetId];
      const label = b.label || target?.title || "Untitled";
      if (ed) {
        // Editor: show page picker
        const allPages = pages ? Object.values(pages) : [];
        return (
          <div style={{margin:"12px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>Link to:</span>
              <select value={b.targetId||""} onChange={e=>{
                const tid=e.target.value;
                const tPage=pages?.[tid];
                onUp({...b, targetId:tid, label:tPage?.title||""});
              }} style={{padding:"6px 10px",border:"1px solid "+T.border,borderRadius:6,fontSize:12,fontFamily:T.uf,background:"transparent",color:T.fg,cursor:"pointer",maxWidth:260}}>
                <option value="">Select a page…</option>
                {allPages.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {b.targetId && (
                <input value={b.label||""} onChange={e=>onUp({...b,label:e.target.value})} placeholder={target?.title||"Button label…"}
                  style={{padding:"6px 10px",border:"1px solid "+T.border,borderRadius:6,fontSize:12,fontFamily:T.uf,background:"transparent",color:T.fg,flex:1,minWidth:120,outline:"none"}} />
              )}
            </div>
            {b.targetId && (
              <div onClick={()=>onNav&&onNav(b.targetId)} style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:8,padding:"10px 18px",background:T.acLight,border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",transition:"all .12s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border}}>
                
                <span style={{fontSize:14,color:T.ac,fontFamily:T.uf,fontWeight:500}}>{label}</span>
                <span style={{fontSize:11,color:T.fgFaint}}>→</span>
              </div>
            )}
          </div>
        );
      }
      // Reader: clickable button
      if (!b.targetId) return null;
      return (
        <div style={{margin:"12px 0"}}>
          <div onClick={()=>onNav&&onNav(b.targetId)}
            style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",background:T.acLight,border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.background=T.card}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.acLight}}>
            
            <span style={{fontSize:14,color:T.ac,fontFamily:T.uf,fontWeight:500}}>{label}</span>
            <span style={{fontSize:11,color:T.fgFaint}}>→</span>
          </div>
        </div>
      );
    }
    case "expandable": return <ExpandableBlock b={b} ed={ed} onUp={onUp} T={T} />;
    case "steps": return <StepsBlock b={b} ed={ed} onUp={onUp} T={T} />;
    case "divider": return <div style={{margin:"24px 0"}}><div style={{height:1,background:T.border}} /></div>;
    default: return null;
  }
}

/* TEXT TO SPEECH PLAYER */
function TTSPlayer({page, T}) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [spd, setSpd] = useState(0.95);
  const [voices, setVoices] = useState([]);
  const utterRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const load = () => { const v = window.speechSynthesis.getVoices(); if (v.length) setVoices(v); };
    load(); window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const pickVoice = useCallback(() => {
    const v = voices;
    const isFem = x => /female|woman|fiona|kate|karen|moira|samantha|jenny|aria|zira|hazel|susan|linda|sonia|libby/i.test(x.name);
    const isUK = x => /en[-_]GB/i.test(x.lang) || /UK|British|GB/i.test(x.name);
    return v.find(x => /Google.*UK.*Female/i.test(x.name))
      || v.find(x => /Google.*UK/i.test(x.name))
      || v.find(x => /natural|neural|enhanced|premium/i.test(x.name) && isUK(x) && isFem(x))
      || v.find(x => /natural|neural/i.test(x.name) && isUK(x))
      || v.find(x => /Sonia|Libby|Maisie/i.test(x.name))
      || v.find(x => /Kate|Fiona|Serena/i.test(x.name))
      || v.find(x => isUK(x) && isFem(x))
      || v.find(x => isUK(x))
      || v.find(x => /Google/i.test(x.name) && /en/i.test(x.lang))
      || v.find(x => /en/i.test(x.lang) && isFem(x))
      || v.find(x => /en[-_](US|GB|AU)/i.test(x.lang))
      || v[0] || null;
  }, [voices]);

  const getText = useCallback(() => {
    if (!page) return "";
    return page.blocks.map(b => {
      const t = (b.text || "").replace(/<[^>]+>/g, "");
      if (b.items) return b.items.map(it => it.replace(/<[^>]+>/g, "")).join(". ");
      if (b.code || b.type === "divider") return "";
      if (b.rows) return b.rows.map(r => r.join(", ")).join(". ");
      if (b.steps) return b.steps.map(s => s.title + ". " + (s.text||"").replace(/<[^>]+>/g,"")).join(". ");
      return t;
    }).filter(Boolean).join(". ");
  }, [page]);

  const wordCount = getText().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / (180 * spd)));

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false); setPaused(false); setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    utterRef.current = null;
  }, []);

  useEffect(() => { stop(); }, [page?.id]);
  useEffect(() => () => { window.speechSynthesis.cancel(); if(intervalRef.current) clearInterval(intervalRef.current); }, []);

  const doPlay = (ov, os) => {
    const v = ov !== undefined ? ov : vol;
    const s = os !== undefined ? os : spd;
    if (paused && ov === undefined && os === undefined) { window.speechSynthesis.resume(); setPaused(false); setPlaying(true); return; }
    stop();
    const text = getText();
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = s; utter.pitch = 1.02; utter.volume = v;
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => { setPlaying(false); setPaused(false); setProgress(100); if(intervalRef.current) clearInterval(intervalRef.current); };
    utter.onerror = () => stop();
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setPlaying(true); setProgress(0);
    const durationMs = (wordCount / (2.8 * s)) * 1000;
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setProgress(Math.min(99, Math.round(((Date.now() - startTime) / durationMs) * 100)));
    }, 200);
  };

  const pause = () => { window.speechSynthesis.pause(); setPaused(true); setPlaying(false); };

  const restart = (nv, ns) => {
    if (nv !== undefined) setVol(nv);
    if (ns !== undefined) setSpd(ns);
    if (playing || paused) { stop(); setTimeout(() => doPlay(nv !== undefined ? nv : vol, ns !== undefined ? ns : spd), 50); }
  };

  if (!page || wordCount < 10) return null;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const spdLabel = spd <= 0.6 ? "0.5x" : spd <= 0.8 ? "0.75x" : spd <= 1.05 ? "1x" : spd <= 1.3 ? "1.25x" : spd <= 1.6 ? "1.5x" : "2x";

  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:T.hover,borderRadius:6,border:"1px solid "+T.border,marginBottom:16}}>
      {(!playing && !paused) || paused ? (
        <button onClick={()=>doPlay()} style={{width:28,height:28,borderRadius:"50%",background:T.ac,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontSize:11,marginLeft:2}}>▶</span>
        </button>
      ) : (
        <button onClick={pause} style={{width:28,height:28,borderRadius:"50%",background:T.ac,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontSize:10}}>❚❚</span>
        </button>
      )}
      <div style={{flex:1,minWidth:80}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:12,color:T.fgMuted,fontFamily:T.bf}}>
            {playing ? "Playing…" : paused ? "Paused" : "Listen to this page"}
          </span>
          <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.bf}}>{readTime} min</span>
        </div>
        <div style={{height:2,background:T.border,borderRadius:1}}>
          <div style={{height:"100%",background:(playing||paused)?T.ac:T.fgFaint,width:progress+"%",transition:"width .3s",borderRadius:1}} />
        </div>
      </div>
      <button onClick={()=>{const ci=speeds.findIndex(s=>Math.abs(s-spd)<0.1);const ns=speeds[(ci+1)%speeds.length];setSpd(ns);if(playing||paused){stop();setTimeout(()=>doPlay(vol,ns),50)}}}
        style={{padding:"2px 8px",background:"transparent",border:"1px solid "+T.border,borderRadius:4,cursor:"pointer",fontSize:11,color:T.fgMuted,fontFamily:T.bf,flexShrink:0,minWidth:36,textAlign:"center"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>{spdLabel}</button>
      <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
        <span style={{fontSize:12,color:T.fgFaint,cursor:"pointer"}} onClick={()=>restart(vol<0.01?0.8:0)}>{"🔊"}</span>
        <input type="range" min="0" max="1" step="0.05" value={vol}
          onChange={e=>restart(parseFloat(e.target.value))}
          style={{width:48,height:4,accentColor:T.ac,cursor:"pointer"}} />
      </div>
      {(playing || paused) && (
        <button onClick={stop} style={{width:20,height:20,borderRadius:3,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.fgFaint,fontSize:8}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>■</button>
      )}
    </div>
  );
}


/* ON THIS PAGE */
function PageToc({page, scrollRef, T, tocW, setTocOpen}) {
  const [activeId, setActiveId] = useState(null);
  const heads = (page?.blocks||[]).filter(b=>b.type==="h1"||b.type==="h2"||b.type==="h3");
  useEffect(() => {
    const el = scrollRef?.current;
    if (!el || heads.length < 2) return;
    const fn = () => { let cur=null; for(const h of heads){const n=document.getElementById("hd-"+h.id);if(n&&n.getBoundingClientRect().top<=80)cur=h.id} setActiveId(cur); };
    el.addEventListener("scroll", fn); fn();
    return () => el.removeEventListener("scroll", fn);
  }, [heads, scrollRef, page?.id]);
  if (heads.length < 2) return null;
  return (
    <div style={{width:tocW||200,flexShrink:0,borderRight:"1px solid "+T.border,background:T.surface,overflowY:"auto",padding:"12px 0",minWidth:120,maxWidth:320,position:"relative"}}>
      {setTocOpen && <button onClick={()=>setTocOpen(false)} title="Hide TOC"
        style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:4,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>◂</button>}
      <div style={{position:"sticky",top:0}}>
        <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.fgFaint,marginBottom:10,padding:"0 16px",fontFamily:T.mf}}>On this page</div>
        {heads.map(h=>{const isA=activeId===h.id;const indent=h.type==="h1"?0:h.type==="h2"?10:20;const plain=(h.text||"").replace(/<[^>]+>/g,"");
          return <div key={h.id} onClick={()=>{const n=document.getElementById("hd-"+h.id);if(n)n.scrollIntoView({behavior:"smooth",block:"start"})}}
            style={{fontSize:h.type==="h1"?12:11,fontWeight:isA?600:400,color:isA?T.ac:T.fgFaint,fontFamily:T.bf,padding:"5px 14px",paddingLeft:14+indent,cursor:"pointer",borderLeft:isA?"2px solid "+T.ac:"2px solid transparent",background:isA?T.acLight:"transparent",borderRadius:"0 4px 4px 0",transition:"all .12s",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.5}}
            onMouseEnter={e=>{if(!isA){e.currentTarget.style.color=T.fgMuted;e.currentTarget.style.background=T.hover}}}
            onMouseLeave={e=>{if(!isA){e.currentTarget.style.color=T.fgFaint;e.currentTarget.style.background="transparent"}}}>{plain}</div>
        })}
      </div>
    </div>
  );
}

/* IMPORT MODAL */
function ImportModal({onImport, onClose, T}) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const parseDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({arrayBuffer}, {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Subtitle'] => h3:fresh",
      ]
    });
    const doc = new DOMParser().parseFromString(result.value, "text/html");
    const uid = () => "b" + Date.now() + "_" + Math.random().toString(36).slice(2,7);
    const blocks = [];
    for (const el of doc.body.children) {
      const tag = el.tagName.toLowerCase();
      const html = el.innerHTML.replace(/\s+/g," ").trim();
      const text = el.textContent.trim();
      if (!text) continue;
      if (tag === "h1") blocks.push({id:uid(),type:"h1",text:html});
      else if (tag === "h2") blocks.push({id:uid(),type:"h2",text:html});
      else if (tag === "h3") blocks.push({id:uid(),type:"h3",text:html});
      else if (tag === "ul") blocks.push({id:uid(),type:"ul",items:Array.from(el.querySelectorAll("li")).map(li=>li.innerHTML.trim())});
      else if (tag === "ol") blocks.push({id:uid(),type:"ol",items:Array.from(el.querySelectorAll("li")).map(li=>li.innerHTML.trim())});
      else if (tag === "blockquote") blocks.push({id:uid(),type:"quote",text:html});
      else if (tag === "table") {
        const rows = Array.from(el.querySelectorAll("tr")).map(tr =>
          Array.from(tr.querySelectorAll("td,th")).map(c => c.textContent.trim())
        );
        if (rows.length) blocks.push({id:uid(),type:"table",rows});
      }
      else blocks.push({id:uid(),type:"p",text:html});
    }
    return blocks;
  };

  const handleFiles = async (fl) => {
    setLoading(true);
    const all = Array.from(fl).filter(f => f.name.endsWith(".md") || f.name.endsWith(".docx") || f.name.endsWith(".doc"));
    const parsed = [];
    for (const f of all) {
      try {
        let blocks;
        if (f.name.endsWith(".md")) {
          const text = await f.text();
          blocks = parseMd(text);
        } else {
          blocks = await parseDocx(f);
        }
        const h1 = blocks.find(b=>b.type==="h1");
        const title = h1 ? h1.text.replace(/<[^>]+>/g,"") : f.name.replace(/\.(md|docx|doc)$/i,"").replace(/[-_]/g," ");
        parsed.push({filename:f.name, title, blocks, count:blocks.length});
      } catch(e) { console.error("Parse error:", e); parsed.push({filename:f.name, title:f.name, blocks:[{id:"b"+Date.now(),type:"p",text:"Error parsing file: "+e.message}], count:1}); }
    }
    setFiles(parsed);
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
      <div onClick={e=>e.stopPropagation()} style={{width:520,background:T.surface,borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:"1px solid "+T.border,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}}>↑</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontFamily:T.hf,color:T.fg}}>Import Documents</div><div style={{fontSize:11,color:T.fgFaint}}>Upload .docx or .md files — headers are preserved</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:T.fgFaint,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          {files.length===0 ? (
            <div>
              {loading ? (
                <div style={{padding:"40px 20px",textAlign:"center"}}>
                  <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:10}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:T.ac,animation:"pulse 1.2s "+i*0.2+"s infinite"}} />)}</div>
                  <div style={{fontSize:13,color:T.fgMuted,fontFamily:T.uf}}>Parsing documents…</div>
                </div>
              ) : (
                <div onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files)}}
                  onClick={()=>inputRef.current?.click()}
                  style={{border:"2px dashed "+(dragOver?T.ac:T.border),borderRadius:4,padding:"40px 20px",textAlign:"center",cursor:"pointer",background:dragOver?T.acLight:T.hover}}>
                  <div style={{fontSize:32,marginBottom:10,opacity:.4}}>⬆</div>
                  <div style={{fontSize:15,fontFamily:T.hf,color:T.fg}}>Drop files here</div>
                  <div style={{fontSize:12,color:T.fgMuted,marginTop:4}}>Accepts <b>.docx</b> and <b>.md</b> files</div>
                  <div style={{fontSize:10,color:T.fgFaint,marginTop:8,fontFamily:T.uf}}>Word headings (Heading 1, 2, 3) are automatically converted to H1, H2, H3</div>
                  <input ref={inputRef} type="file" accept=".md,.docx,.doc" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{fontSize:11,fontWeight:700,color:T.fgFaint,textTransform:"uppercase",letterSpacing:".06em",fontFamily:T.mf,marginBottom:8}}>{files.length} files ready</div>
              {files.map((f,i)=><div key={i} style={{padding:"8px 12px",background:T.hover,borderRadius:8,marginBottom:4,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:10,color:T.ac,fontFamily:T.mf}}>{f.filename.endsWith(".docx")?"W":"M"}</span>
                <span style={{flex:1,fontSize:13,color:T.fg}}>{f.title}</span>
                <span style={{fontSize:10,color:T.fgFaint,fontFamily:T.mf}}>{f.count} blocks</span>
              </div>)}
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button onClick={()=>setFiles([])} style={{flex:1,padding:"8px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,cursor:"pointer",color:T.fgMuted,fontSize:13,fontFamily:T.bf}}>Back</button>
                <button onClick={()=>onImport(files)} style={{flex:1,padding:"8px",background:T.ac,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.bf}}>Import</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* EUR-LEX PARSER — single page, proper headers */
function boldRefs(t) {
  // Bold article/regulation references
  return t
    .replace(/(Article|Artikel)\s+(\d+[a-z]?)/gi, "<b>$1 $2</b>")
    .replace(/(Regulation|Directive|Verordening|Richtlijn)\s*\(E[UCG]+\)\s*(No\s*)?\d+\/\d+/gi, m => "<b>" + m + "</b>")
    .replace(/(Regulation|Directive|Verordening|Richtlijn)\s*\(E[UCG]+\)\s*\d+\/\d+/gi, m => "<b>" + m + "</b>")
    .replace(/Regulation\s*\([^)]+\)\s*No\s*\d+\/\d+/gi, m => "<b>" + m + "</b>")
    .replace(/Directive\s*\d{4}\/\d+\/E[UCG]+/gi, m => "<b>" + m + "</b>")
    .replace(/(TFEU|GDPR|BRRD|MiFID|MiCAR|DORA|CRR|CRD|SRM|EMIR|MAR|AIFMD|UCITS)/g, "<b>$1</b>");
}

function isEurLexNoise(t) {
  if (!t || t.length < 3) return true;
  if (/^(Official Journal|Amtsblatt|Publicatieblad)/i.test(t)) return true;
  if (/^\d+\/\d+\/E[UCG]+$/.test(t.trim())) return true;
  if (/^[LCST]\s*\d+\/\d+$/.test(t.trim())) return true;
  if (/^(EN|NL|DE|FR)\s+\d+\s+(EN|NL|DE|FR)$/.test(t.trim())) return true;
  if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(t.trim())) return true;
  if (/^Page \d/i.test(t.trim())) return true;
  return false;
}

function classifyLine(t) {
  const s = t.trim();
  if (/^(TITLE|TITEL|TITRE|TITEL)\s+[IVXLCDM0-9]/i.test(s)) return "h1";
  if (/^(PART|DEEL|PARTIE|TEIL)\s+[IVXLCDM0-9]/i.test(s)) return "h1";
  if (/^(CHAPTER|HOOFDSTUK|CHAPITRE|KAPITEL)\s+[IVXLCDM0-9]/i.test(s)) return "h1";
  if (/^(SECTION|AFDELING|ABSCHNITT)\s+\d/i.test(s)) return "h1";
  if (/^(ANNEX|ANNEXE|BIJLAGE|ANHANG)\s*[IVXLCDM0-9]/i.test(s)) return "h1";
  if (/^(Whereas|Overwegende)/i.test(s) || s === "RECITALS" || s === "OVERWEGINGEN") return "h1";
  if (/^(Article|Artikel|Art\.)\s+\d/i.test(s)) return "h2";
  return null;
}

function parseEurLexText(lines, docTitle) {
  const uid = () => "b" + Date.now() + "_" + Math.random().toString(36).slice(2,7);
  const blocks = [{id:uid(), type:"h1", text:docTitle}];

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || isEurLexNoise(t)) continue;
    const cls = classifyLine(t);
    if (cls) {
      // Check if next line is a subtitle (e.g., "CHAPTER I" followed by "General provisions")
      let heading = boldRefs(t);
      if (i + 1 < lines.length) {
        const next = lines[i+1].trim();
        if (next && !classifyLine(next) && !isEurLexNoise(next) && next.length < 120 && !/^\d+\./.test(next) && !/^\([a-z]\)/.test(next)) {
          heading += " — " + boldRefs(next);
          i++;
        }
      }
      blocks.push({id:uid(), type:cls, text:heading});
    } else if (t.startsWith("(") && /^\(\d+\)/.test(t)) {
      // Recital numbered paragraph
      blocks.push({id:uid(), type:"p", text:boldRefs(t)});
    } else if (/^\d+\.\s+/.test(t)) {
      // Numbered paragraph within article
      blocks.push({id:uid(), type:"p", text:"<b>" + t.slice(0,t.indexOf(".")+1) + "</b> " + boldRefs(t.slice(t.indexOf(".")+1).trim())});
    } else if (/^\([a-z]\)\s+/.test(t)) {
      // Lettered sub-point
      blocks.push({id:uid(), type:"p", text:boldRefs(t)});
    } else if (t.length > 5) {
      blocks.push({id:uid(), type:"p", text:boldRefs(t)});
    }
  }
  return blocks;
}

function parseEurLexHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const txt = (el) => el?.textContent?.replace(/\s+/g," ").trim() || "";
  const titleEl = doc.querySelector("#title, .doc-ti, p.oj-doc-ti, title");
  const docTitle = txt(titleEl).replace(/\s*-\s*EUR-Lex.*$/i,"").trim() || "EUR-Lex Import";
  const container = doc.querySelector("#docHtml, .tabContent, #TexteOnly") || doc.body;
  const ps = container.querySelectorAll("p");
  const lines = [];
  for (const p of ps) {
    const t = txt(p);
    if (t) lines.push(t);
  }
  return {title: docTitle, blocks: parseEurLexText(lines, docTitle)};
}

async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("Could not load PDF.js"));
    document.head.appendChild(s);
  });
}

async function parseEurLexPdf(arrayBuffer) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument({data:arrayBuffer}).promise;
  const lines = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    let line = "";
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 3) {
        if (line.trim()) lines.push(line.trim());
        line = "";
      }
      line += item.str;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
  }
  // Detect title from first meaningful lines
  let docTitle = "EUR-Lex Import";
  for (const l of lines.slice(0, 20)) {
    if (l.length > 20 && /(regulation|directive|verordening|richtlijn)/i.test(l)) { docTitle = l.slice(0,120); break; }
  }
  return {title: docTitle, blocks: parseEurLexText(lines, docTitle)};
}

/* EUR-LEX IMPORT MODAL */
function EurLexModal({onImport, onClose, T}) {
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(""); setLoading(true); setParsed(null);
    try {
      const name = file.name.toLowerCase();
      if (name.endsWith(".pdf")) {
        const buf = await file.arrayBuffer();
        const result = await parseEurLexPdf(buf);
        setParsed(result);
      } else {
        const html = await file.text();
        const result = parseEurLexHtml(html);
        setParsed(result);
      }
    } catch (e) { setError("Could not parse file: " + e.message); }
    setLoading(false);
  };

  const stats = parsed ? {
    h1: parsed.blocks.filter(b=>b.type==="h1").length,
    h2: parsed.blocks.filter(b=>b.type==="h2").length,
    p: parsed.blocks.filter(b=>b.type==="p").length,
  } : null;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
      <div onClick={e=>e.stopPropagation()} style={{width:580,maxHeight:"85vh",background:T.surface,borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:"1px solid "+T.border,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontFamily:T.mf,fontWeight:700}}>EU</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontFamily:T.hf,color:T.fg}}>Import EUR-Lex Legislation</div><div style={{fontSize:11,color:T.fgFaint,fontFamily:T.uf}}>Upload PDF or HTML — single page with proper headers</div></div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:T.fgFaint,fontSize:18,cursor:"pointer"}}>×</button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {!parsed ? (<div>
            <div style={{fontSize:13,color:T.fgMuted,marginBottom:14,lineHeight:1.7,fontFamily:T.uf}}>
              Upload a PDF or HTML file from EUR-Lex. The entire regulation will be imported as a <b>single page</b> with automatic header recognition.
            </div>

            <div style={{background:T.hover,borderRadius:6,padding:"12px 16px",marginBottom:14,fontSize:11,color:T.fgMuted,fontFamily:T.uf,lineHeight:1.7}}>
              <div style={{fontWeight:600,color:T.fg,marginBottom:4,fontSize:12}}>Automatic structure recognition:</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 16px"}}>
                <span>TITLE I, II, III…</span><span style={{color:T.ac}}>→ H1</span>
                <span>CHAPTER 1, 2, 3…</span><span style={{color:T.ac}}>→ H1</span>
                <span>Section 1, 2, 3…</span><span style={{color:T.ac}}>→ H1</span>
                <span>ANNEX I, II…</span><span style={{color:T.ac}}>→ H1</span>
                <span>Whereas / Recitals</span><span style={{color:T.ac}}>→ H1</span>
                <span>Article 1, 2, 3…</span><span style={{color:T.ac}}>→ H2</span>
              </div>
              <div style={{marginTop:6,fontSize:10,color:T.fgFaint}}>References to articles and regulations are automatically bolded. EUR-Lex headers/footers are filtered out.</div>
            </div>

            {/* Quick links */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:600,color:T.fgFaint,fontFamily:T.mf,marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Quick links to EUR-Lex (save as PDF or HTML)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {[{c:"32014L0059",l:"BRRD"},{c:"32014R0806",l:"SRM"},{c:"32023R1114",l:"MiCAR"},{c:"32022R2554",l:"DORA"},{c:"32013R0575",l:"CRR"},{c:"32016R0679",l:"GDPR"},{c:"32014L0065",l:"MiFID II"}].map(ex=>
                  <a key={ex.c} href={"https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:"+ex.c} target="_blank" rel="noopener"
                    style={{padding:"3px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:20,fontSize:10,color:T.fgMuted,cursor:"pointer",fontFamily:T.mf,textDecoration:"none"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>{ex.l}</a>
                )}
              </div>
            </div>

            {error && <div style={{padding:"8px 12px",background:"#fef2f2",borderLeft:"2px solid #dc2626",borderRadius:"0 4px 4px 0",color:"#dc2626",fontSize:12,marginBottom:12,fontFamily:T.uf}}>{error}</div>}

            {loading ? (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"32px 0"}}>
                <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:T.ac,animation:"pulse 1.2s "+i*0.2+"s infinite"}} />)}</div>
                <span style={{fontSize:12,color:T.fgMuted,fontFamily:T.uf}}>Parsing legislation…</span>
              </div>
            ) : (
              <div onClick={()=>fileRef.current?.click()}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f)}}
                style={{border:"2px dashed "+T.border,borderRadius:6,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:"transparent",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.background=T.hover}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="transparent"}}>
                <div style={{fontSize:24,opacity:.3,marginBottom:6}}>⬆</div>
                <div style={{fontSize:14,fontFamily:T.hf,color:T.fg}}>Drop PDF or HTML file here</div>
                <div style={{fontSize:11,color:T.fgFaint,marginTop:4,fontFamily:T.uf}}>Accepts .pdf and .html files from EUR-Lex</div>
                <input ref={fileRef} type="file" accept=".pdf,.html,.htm" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleFile(e.target.files[0])}} />
              </div>
            )}
          </div>) : (<div>
            {/* Preview */}
            <div style={{fontSize:15,fontFamily:T.hf,color:T.fg,marginBottom:4}}>{parsed.title.slice(0,100)}{parsed.title.length>100?"…":""}</div>
            <div style={{display:"flex",gap:12,marginBottom:14}}>
              <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>{stats.h1} sections (H1)</span>
              <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>{stats.h2} articles (H2)</span>
              <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>{stats.p} paragraphs</span>
            </div>
            <div style={{maxHeight:300,overflowY:"auto",marginBottom:14,border:"1px solid "+T.border,borderRadius:6,padding:8}}>
              {parsed.blocks.slice(0,60).map((b,i) => (
                <div key={i} style={{padding:"3px 8px",fontSize:b.type==="h1"?13:b.type==="h2"?12:11,fontWeight:b.type==="h1"||b.type==="h2"?600:400,
                  color:b.type==="h1"?T.ac:b.type==="h2"?T.fg:T.fgMuted,fontFamily:b.type==="p"?T.bf:T.uf,
                  paddingLeft:b.type==="h2"?20:b.type==="p"?32:8,
                  borderLeft:b.type==="h1"?"3px solid "+T.ac:b.type==="h2"?"2px solid "+T.fgFaint:"2px solid transparent",
                  marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                  dangerouslySetInnerHTML={{__html:(b.text||"").slice(0,120)}} />
              ))}
              {parsed.blocks.length>60&&<div style={{padding:"8px",textAlign:"center",fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>…and {parsed.blocks.length-60} more blocks</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setParsed(null);setError("")}} style={{flex:1,padding:"8px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",color:T.fgMuted,fontSize:12,fontFamily:T.uf}}>Back</button>
              <button onClick={()=>onImport(parsed)} style={{flex:1,padding:"8px",background:T.ac,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.uf}}>Import as single page ({parsed.blocks.length} blocks)</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}

/* PANEL RESIZE HANDLE */
function PanelHandle({onResize, T}) {
  const startWRef = useRef(0);
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    startWRef.current = 0;
    const onMove = (ev) => { const dx = ev.clientX - startX; onResize(dx); };
    const onUp = () => { document.removeEventListener("mousemove",onMove); document.removeEventListener("mouseup",onUp); document.body.style.cursor=""; document.body.style.userSelect=""; };
    document.addEventListener("mousemove",onMove);
    document.addEventListener("mouseup",onUp);
    document.body.style.cursor="col-resize";
    document.body.style.userSelect="none";
  };
  return (
    <div onMouseDown={handleMouseDown}
      style={{width:5,cursor:"col-resize",background:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}
      onMouseEnter={e=>e.currentTarget.style.background=T.ac+"22"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{width:1,height:32,background:T.border,borderRadius:1}} />
    </div>
  );
}

/* VERSION HISTORY */
function VersionHistory({versions, onRestore, onClose, T}) {
  const [selected, setSelected] = useState(null);
  if (!versions || versions.length === 0) return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
      <div onClick={e=>e.stopPropagation()} style={{width:420,background:T.surface,borderRadius:8,padding:"32px",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:"1px solid "+T.border}}>
        <div style={{fontSize:16,fontFamily:T.hf,color:T.fg,marginBottom:8}}>No versions yet</div>
        <div style={{fontSize:13,color:T.fgMuted,fontFamily:T.uf,marginBottom:16}}>Versions are saved each time you publish.</div>
        <button onClick={onClose} style={{padding:"8px 20px",background:T.ac,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:T.uf}}>Close</button>
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000}}>
      <div onClick={e=>e.stopPropagation()} style={{width:500,maxHeight:"80vh",background:T.surface,borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:"1px solid "+T.border,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{fontSize:16,fontFamily:T.hf,color:T.fg,flex:1}}>Version History</div>
          <span style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf}}>{versions.length} versions</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:T.fgFaint,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
          {[...versions].reverse().map((v,i) => {
            const d = new Date(v.date);
            const pageCount = Object.keys(v.pages).length;
            const isSel = selected === versions.length-1-i;
            return (
              <div key={i} onClick={()=>setSelected(versions.length-1-i)}
                style={{padding:"10px 14px",borderRadius:6,marginBottom:2,cursor:"pointer",border:"1px solid "+(isSel?T.ac:"transparent"),background:isSel?T.acLight:"transparent",transition:"all .1s"}}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=T.hover}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=isSel?T.acLight:"transparent"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:T.fg,fontFamily:T.uf}}>
                      {d.toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})} — {d.toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                    <div style={{fontSize:11,color:T.fgFaint,fontFamily:T.mf,marginTop:2}}>{pageCount} pages</div>
                  </div>
                  {i===0 && <span style={{fontSize:9,color:T.ac,fontFamily:T.mf,background:T.acLight,padding:"2px 8px",borderRadius:10}}>Latest</span>}
                </div>
              </div>
            );
          })}
        </div>
        {selected!==null && (
          <div style={{padding:"12px 20px",borderTop:"1px solid "+T.border,display:"flex",gap:8}}>
            <button onClick={onClose} style={{flex:1,padding:"8px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",color:T.fgMuted,fontSize:12,fontFamily:T.uf}}>Cancel</button>
            <button onClick={()=>{onRestore(versions[selected]);onClose()}} style={{flex:1,padding:"8px",background:T.ac,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.uf}}>Restore this version</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* MOBILE HOOK */
function useIsMobile(breakpoint) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < (breakpoint||768));
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < (breakpoint||768));
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return isMobile;
}

/* SIDEBAR NAV ITEM (collapsible) */
function NavItem({pid, pages, act, setAct, depth, T}) {
  const p = pages[pid];
  if (!p) return null;
  const hasCh = p.children?.length > 0;
  const isA = act === pid;
  const childActive = hasCh && p.children.some(cid => act === cid || pages[cid]?.children?.some(gc => act === gc));
  const [exp, setExp] = useState(isA || childActive);

  useEffect(() => { if (isA || childActive) setExp(true); }, [act]);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        {hasCh ? (
          <button onClick={(e)=>{e.stopPropagation();setExp(!exp)}}
            style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:isA?T.ac:T.fgFaint,fontSize:7,flexShrink:0,transform:exp?"rotate(90deg)":"none",transition:"all .2s",marginLeft:depth*12}}>▸</button>
        ) : <span style={{width:20,marginLeft:depth*12}} />}
        <div onClick={()=>setAct(pid)}
          style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:0,cursor:"pointer",marginBottom:0,background:"transparent",color:isA?T.ac:T.sText,fontWeight:isA?600:400,fontSize:depth===0?14:13,fontFamily:T.bf,borderLeft:isA?"2px solid "+T.ac:"2px solid transparent",transition:"all .15s",letterSpacing:isA?".01em":"0"}}
          onMouseEnter={e=>{if(!isA){e.currentTarget.style.color=T.ac;e.currentTarget.style.borderLeftColor=T.border}}}
          onMouseLeave={e=>{if(!isA){e.currentTarget.style.color=T.sText;e.currentTarget.style.borderLeftColor="transparent"}}}>
          
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</span>
          {hasCh && <span style={{fontSize:9,color:T.fgFaint,fontFamily:T.mf,flexShrink:0,opacity:.6}}>{p.children.length}</span>}
        </div>
      </div>
      {hasCh && exp && p.children.map(cid =>
        <NavItem key={cid} pid={cid} pages={pages} act={act} setAct={setAct} depth={depth+1} T={T} />
      )}
    </div>
  );
}

/* READER */
function Reader({pages, secs, meta, onEdit, role, onLogout, T, onToggleDark, isDark}) {
  const scr = useScreen();
  const [act, setAct] = useState(secs[0]?.pages[0]||"");
  const [srch, setSrch] = useState(false);
  const [q, setQ] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [tab, setTab] = useState("search");
  const [printMode, setPrintMode] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [sideW, setSideW] = useState(260);
  const [sideOpen, setSideOpen] = useState(!scr.isMobile);
  const [tocW, setTocW] = useState(200);
  const [tocOpen, setTocOpen] = useState(scr.isDesktop);
  const sRef = useRef(null);
  const sideWRef = useRef(260);
  const tocWRef = useRef(200);
  useEffect(()=>{sideWRef.current=sideW},[sideW]);
  useEffect(()=>{tocWRef.current=tocW},[tocW]);
  // Auto-close panels on resize
  useEffect(()=>{
    if(scr.isMobile){setSideOpen(false);setTocOpen(false)}
    else if(scr.isTablet){setTocOpen(false)}
    else{setTocOpen(true)}
  },[scr.isMobile,scr.isTablet]);
  // Close mobile sidebar on page nav
  useEffect(()=>{if(scr.isMobile)setSideOpen(false)},[act]);
  const pg = pages[act];
  useEffect(()=>{if(sRef.current){sRef.current.scrollTop=0;setScrollPct(0)};setSummary(null);setSummaryLoading(false)},[act]);
  const allP = Object.values(pages);

  const doSummary = async () => {
    if (!pg) return;
    setSummaryLoading(true); setSummary(null);
    const text = pg.blocks.map(b => {
      const t = (b.text||"").replace(/<[^>]+>/g,"");
      if (b.items) return b.items.map(it=>it.replace(/<[^>]+>/g,"")).join(". ");
      if (b.rows) return b.rows.map(r=>r.join(", ")).join(". ");
      if (b.type==="code"||b.type==="divider"||b.type==="image"||b.type==="embed") return "";
      return t;
    }).filter(Boolean).join("\n\n");
    try {
      const res = await fetch("/api/ai", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:"You are Difilex AI. Summarize the page in a short bullet-point overview. Rules: start each bullet with '• ', use **bold** for key terms, max 5-8 bullets, keep each bullet to 1 sentence, no headers, no intro text, just the bullets. Answer in the same language as the content.",
          messages:[{role:"user",content:"Summarize this page titled '"+pg.title+"':\n\n"+text}]
        }),
      });
      if (!res.ok) { setSummary("AI niet beschikbaar (HTTP " + res.status + ")"); setSummaryLoading(false); return; }
      const data = await res.json();
      if (data.error) { setSummary("AI fout: " + (data.error.message || "onbekend")); setSummaryLoading(false); return; }
      setSummary(data.content?.map(c=>c.text||"").join("")||"No summary generated.");
    } catch (e) { console.error("Summary error:", e); setSummary("Kon geen verbinding maken met AI. Probeer opnieuw."); }
    setSummaryLoading(false);
  };
  const res = q ? allP.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())||p.blocks.some(b=>(b.text||"").replace(/<[^>]+>/g,"").toLowerCase().includes(q.toLowerCase()))) : [];
  const findPar = pid => allP.find(p=>p.children?.includes(pid));
  const crumb = (()=>{const t=[];let c=act;let s=10;while(c&&s-->0){t.unshift(pages[c]);c=findPar(c)?.id}return t.filter(Boolean)})();
  const allIds = secs.flatMap(s=>s.pages).flatMap(pid=>[pid,...(pages[pid]?.children||[])]);
  const ci = allIds.indexOf(act);
  const prev = ci>0?pages[allIds[ci-1]]:null;
  const next = ci<allIds.length-1?pages[allIds[ci+1]]:null;
  const doAsk = (question) => { setAiLoading(true);setAiAnswer(null);askAI(question,pages).then(a=>{setAiAnswer(a);setAiLoading(false)}); };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:T.bf,background:T.bg,color:T.fg}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:scr.isMobile?"10px 14px":"14px 24px",borderBottom:"1px solid "+T.border,flexShrink:0,background:T.bg,fontFamily:T.uf,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:scr.isMobile?8:12}}>
          {scr.isMobile && (
            <button onClick={()=>setSideOpen(!sideOpen)} style={{background:"transparent",border:"1px solid "+T.border,borderRadius:6,padding:"6px 8px",cursor:"pointer",color:T.fgMuted,fontSize:16,display:"flex",alignItems:"center"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>☰</button>
          )}
          <img src={LOGO} alt="Difilex" style={{height:scr.isMobile?32:56,...(isDark?{filter:"invert(1)"}:{})}} />
        </div>
        <div style={{display:"flex",alignItems:"center",gap:scr.isMobile?6:10}}>
          <div onClick={()=>setSrch(true)} style={{display:"flex",alignItems:"center",gap:8,padding:scr.isMobile?"6px 10px":"7px 16px",background:"transparent",borderRadius:8,cursor:"pointer",border:"1px solid "+T.border,...(scr.isMobile?{}:{minWidth:220})}}>
            <span style={{color:T.ac,fontSize:13}}>✦</span>{!scr.isMobile&&<span style={{fontSize:13,color:T.fgFaint,fontFamily:T.uf}}>Search & Ask AI…</span>}
          </div>
          {!scr.isMobile && <button onClick={onToggleDark} style={{fontSize:14,color:T.fgFaint,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",padding:"6px 10px",borderRadius:7}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>{isDark?"☀":"☾"}</button>}
          {!role && onEdit && (
            <button onClick={onEdit} style={{fontSize:11,color:T.fgFaint,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",fontFamily:T.uf,padding:"6px 12px",borderRadius:7}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>Login</button>
          )}
          {role==="client" && !scr.isMobile && (
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",border:"1px solid "+T.border,borderRadius:7}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontFamily:T.uf}}>C</div>
                <span style={{fontSize:11,color:T.fgMuted,fontFamily:T.uf}}>Client</span>
              </div>
              <button onClick={onLogout} style={{fontSize:11,color:T.fgFaint,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",fontFamily:T.uf,padding:"6px 12px",borderRadius:7}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>Logout</button>
            </div>
          )}
          {role==="client" && scr.isMobile && (
            <button onClick={onLogout} style={{fontSize:11,color:T.fgFaint,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",fontFamily:T.uf,padding:"6px 10px",borderRadius:7}}>↪</button>
          )}
        </div>
      </div>
      {/* Body */}
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
        {/* Mobile sidebar overlay */}
        {scr.isMobile && sideOpen && (
          <div onClick={()=>setSideOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",zIndex:20}} />
        )}
        {/* Sidebar toggle (desktop collapsed) */}
        {!scr.isMobile && !sideOpen && (
          <div style={{width:32,flexShrink:0,borderRight:"1px solid "+T.border,background:T.sBg,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12}}>
            <button onClick={()=>setSideOpen(true)} title="Show sidebar"
              style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>▸</button>
          </div>
        )}
        {/* Sidebar */}
        {sideOpen && <>
          <div style={{width:scr.isMobile?"85vw":sideW,maxWidth:scr.isMobile?320:400,background:T.sBg,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",flexShrink:0,minWidth:160,position:scr.isMobile?"absolute":"relative",top:0,left:0,bottom:0,zIndex:scr.isMobile?21:0,boxShadow:scr.isMobile?"4px 0 16px rgba(0,0,0,.1)":"none"}}>
            <button onClick={()=>setSideOpen(false)} title="Hide sidebar"
              style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:4,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>◂</button>
            {scr.isMobile && <div style={{padding:"10px 12px",borderBottom:"1px solid "+T.border}}>
              <button onClick={onToggleDark} style={{fontSize:12,color:T.fgFaint,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",padding:"5px 10px",borderRadius:6,fontFamily:T.uf,width:"100%"}}>{isDark?"☀ Light mode":"☾ Dark mode"}</button>
            </div>}
            <div style={{flex:1,overflowY:"auto",padding:"12px 8px"}}>
              {secs.map(sec=>(
                <div key={sec.id} style={{marginBottom:6}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:T.fgFaint,padding:"10px 10px 4px",fontFamily:T.mf}}>{sec.label}</div>
                  {sec.pages.map(pid=>
                    <NavItem key={pid} pid={pid} pages={pages} act={act} setAct={setAct} depth={0} T={T} />
                  )}
                </div>
              ))}
            </div>
          </div>
          {!scr.isMobile && <PanelHandle T={T} onResize={dx=>{setSideW(Math.max(160,Math.min(400,sideWRef.current+dx)))}} />}
        </>}
        {/* TOC toggle (desktop only) */}
        {!scr.isMobile && !tocOpen && (
          <div style={{width:32,flexShrink:0,borderRight:"1px solid "+T.border,background:T.surface,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12}}>
            <button onClick={()=>setTocOpen(true)} title="Show table of contents"
              style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>▸</button>
          </div>
        )}
        {/* On this page (desktop/tablet only) */}
        {!scr.isMobile && tocOpen && <>
          <div style={{width:tocW,flexShrink:0,borderRight:"1px solid "+T.border,background:T.surface,overflowY:"auto",padding:"12px 0",minWidth:120,maxWidth:320,position:"relative"}}>
            <button onClick={()=>setTocOpen(false)} title="Hide table of contents"
              style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:4,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>◂</button>
            <div style={{position:"sticky",top:0}}>
              <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.fgFaint,marginBottom:10,padding:"0 16px",fontFamily:T.mf}}>On this page</div>
              {(pg?.blocks||[]).filter(b=>b.type==="h1"||b.type==="h2"||b.type==="h3").map(h=>{const plain=(h.text||"").replace(/<[^>]+>/g,"");const indent=h.type==="h1"?0:h.type==="h2"?10:20;
                return <div key={h.id} onClick={()=>{const n=document.getElementById("hd-"+h.id);if(n)n.scrollIntoView({behavior:"smooth",block:"start"})}}
                  style={{fontSize:h.type==="h1"?12:11,color:T.fgFaint,fontFamily:T.bf,padding:"5px 14px",paddingLeft:14+indent,cursor:"pointer",borderLeft:"2px solid transparent",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.5}}
                  onMouseEnter={e=>{e.currentTarget.style.color=T.ac;e.currentTarget.style.background=T.hover}}
                  onMouseLeave={e=>{e.currentTarget.style.color=T.fgFaint;e.currentTarget.style.background="transparent"}}>{plain}</div>
              })}
            </div>
          </div>
          <PanelHandle T={T} onResize={dx=>{setTocW(Math.max(120,Math.min(320,tocWRef.current+dx)))}} />
        </>}
        {/* Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Progress bar */}
          <div style={{height:3,background:T.border,flexShrink:0}}>
            <div style={{height:"100%",background:T.ac,width:scrollPct+"%",transition:"width .1s",borderRadius:"0 2px 2px 0"}} />
          </div>
          <div ref={sRef} style={{flex:1,overflowY:"auto",background:T.card}} onScroll={e=>{const el=e.currentTarget;const pct=el.scrollHeight<=el.clientHeight?100:Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight))*100);setScrollPct(pct)}}>
          <div style={{maxWidth:700,margin:"0 auto",padding:scr.isMobile?"12px 16px 60px":"12px 40px 80px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:T.fgMuted}}>
                {crumb.map((p,i)=><span key={p.id} style={{display:"flex",alignItems:"center",gap:6}}>
                  {i>0&&<span style={{color:T.fgFaint}}>›</span>}
                  <span onClick={()=>setAct(p.id)} style={{cursor:"pointer",color:i===crumb.length-1?T.fg:T.fgMuted}} onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=i===crumb.length-1?T.fg:T.fgMuted}>{p.title}</span>
                </span>)}
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={doSummary} disabled={summaryLoading}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"transparent",border:"1px solid "+T.border,borderRadius:7,cursor:"pointer",fontSize:12,color:summaryLoading?T.fgFaint:T.fgMuted,fontFamily:T.uf,flexShrink:0}}
                  onMouseEnter={e=>{if(!summaryLoading){e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=summaryLoading?T.fgFaint:T.fgMuted}}>
                  {summaryLoading?"Summarizing…":"✦ AI Summary"}
                </button>
                <button onClick={()=>setPrintMode(true)}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:"transparent",border:"1px solid "+T.border,borderRadius:7,cursor:"pointer",fontSize:12,color:T.fgMuted,fontFamily:T.uf,flexShrink:0}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>
                  ↓ PDF
                </button>
              </div>
            </div>
            <TTSPlayer page={pg} T={T} />
            {/* AI Summary panel */}
            {(summary || summaryLoading) && (
              <div style={{marginBottom:16,padding:"16px 20px",background:T.acLight,border:"1px solid "+T.border,borderRadius:6}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:summaryLoading?0:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:20,height:20,borderRadius:5,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontFamily:T.mf,fontWeight:700}}>✦</div>
                    <span style={{fontSize:11,fontWeight:600,color:T.ac,fontFamily:T.mf}}>AI SUMMARY</span>
                  </div>
                  <button onClick={()=>{setSummary(null);setSummaryLoading(false)}} style={{background:"transparent",border:"none",color:T.fgFaint,fontSize:14,cursor:"pointer",padding:"2px 6px",borderRadius:4}}
                    onMouseEnter={e=>e.currentTarget.style.color=T.fg} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>×</button>
                </div>
                {summaryLoading ? (
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0"}}>
                    <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:T.ac,animation:"pulse 1.2s "+i*0.2+"s infinite"}} />)}</div>
                    <span style={{fontSize:12,color:T.fgMuted,fontFamily:T.uf}}>Generating summary…</span>
                  </div>
                ) : (
                  <div style={{fontSize:13,lineHeight:1.8,color:T.fgBody,fontFamily:T.bf}}>
                    {(summary||"").split("\n").filter(l=>l.trim()).map((line,i) => {
                      const txt = line.replace(/^[•\-\*]\s*/,"").replace(/\*\*([^*]+)\*\*/g,'<b style="color:'+T.ac+'">$1</b>');
                      return <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                        <span style={{color:T.ac,fontSize:8,lineHeight:"22px",flexShrink:0}}>●</span>
                        <span dangerouslySetInnerHTML={{__html:txt}} />
                      </div>;
                    })}
                  </div>
                )}
              </div>
            )}
            {pg?.children?.length>0 && <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:28}}>
              {pg.children.map(cid=>{const c=pages[cid];if(!c)return null;const desc=c.blocks.find(b=>b.type==="p")?.text?.replace(/<[^>]+>/g,"").slice(0,100);return(
                <div key={cid} onClick={()=>setAct(cid)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:"transparent",cursor:"pointer",borderLeft:"2px solid transparent",borderBottom:"1px solid "+T.border,transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderLeftColor=T.ac;e.currentTarget.style.color=T.ac}}
                  onMouseLeave={e=>{e.currentTarget.style.borderLeftColor="transparent";e.currentTarget.style.color=T.fg}}>
                  
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:500,color:"inherit",fontFamily:T.bf}}>{c.title}</div>
                  {desc&&<div style={{fontSize:12,color:T.fgFaint,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{desc}…</div>}</div>
                  <span style={{color:T.fgFaint,fontSize:12}}>→</span>
                </div>)})}
            </div>}
            <div id="page-content">{pg?.blocks.map(b=><Block key={b.id} b={b} ed={false} T={T} pages={pages} onNav={pid=>setAct(pid)} />)}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:48,paddingTop:20,borderTop:"1px solid "+T.border}}>
              {prev?<button onClick={()=>setAct(prev.id)} style={{background:T.card,border:"1px solid "+T.border,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13,color:T.fgMuted,fontFamily:T.bf,textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{fontSize:10,color:T.fgFaint,fontFamily:T.mf,marginBottom:2}}>← Previous</div>{prev.title}</button>:<div/>}
              {next?<button onClick={()=>setAct(next.id)} style={{background:T.card,border:"1px solid "+T.border,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13,color:T.fgMuted,fontFamily:T.bf,textAlign:"right"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{fontSize:10,color:T.fgFaint,fontFamily:T.mf,marginBottom:2}}>Next →</div>{next.title}</button>:<div/>}
            </div>
          </div>
        </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{display:"flex",alignItems:scr.isMobile?"flex-start":"center",justifyContent:"space-between",flexDirection:scr.isMobile?"column":"row",gap:scr.isMobile?6:0,padding:scr.isMobile?"10px 16px":"10px 24px",borderTop:"1px solid "+T.border,flexShrink:0,background:T.bg,fontSize:11,color:T.fgFaint,fontFamily:T.uf}}>
        <span>© {new Date().getFullYear()} Difilex. All rights reserved.</span>
        <div style={{display:"flex",alignItems:"center",gap:scr.isMobile?10:16,flexWrap:"wrap"}}>
          {[{l:"About",h:"#"},{l:"Legal",h:"#"},{l:"Terms of Use",h:"#"},{l:"Privacy",h:"#"},{l:"Contact",h:"#"},{l:"difilex.nl",h:"https://difilex.nl"}].map((lk,i)=>
            <a key={i} href={lk.h} onClick={e=>{if(lk.h==="#")e.preventDefault()}} style={{color:T.fgFaint,textDecoration:"none",fontSize:11,fontFamily:T.uf}}
              onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>{lk.l}</a>
          )}
        </div>
      </div>

      {srch && <div onClick={()=>{setSrch(false);setQ("");setAiAnswer(null);setTab("search")}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:scr.isMobile?20:80,zIndex:1000}}>
        <div onClick={e=>e.stopPropagation()} style={{width:scr.isMobile?"95vw":580,background:T.surface,borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.1)",border:"1px solid "+T.border,overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:"70vh"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid "+T.border}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{color:T.ac,fontSize:15}}>✦</span>
              <input autoFocus value={q} onChange={e=>{setQ(e.target.value);setAiAnswer(null)}}
                onKeyDown={e=>{if(e.key==="Enter"&&q.trim()&&tab==="ai"){e.preventDefault();doAsk(q.trim())}}}
                placeholder={tab==="search"?"Search pages…":"Ask about the documentation…"}
                style={{flex:1,border:"none",outline:"none",fontSize:16,fontFamily:T.bf,color:T.fg,background:"transparent"}} />
            </div>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>{setTab("search");setAiAnswer(null)}} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontFamily:T.bf,fontWeight:tab==="search"?600:400,background:tab==="search"?T.card:"transparent",color:tab==="search"?T.ac:T.fgFaint,boxShadow:tab==="search"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>⌕ Search</button>
              <button onClick={()=>{setTab("ai");setAiAnswer(null)}} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontFamily:T.bf,fontWeight:tab==="ai"?600:400,background:tab==="ai"?T.card:"transparent",color:tab==="ai"?T.ac:T.fgFaint,boxShadow:tab==="ai"?"0 1px 3px rgba(0,0,0,.08)":"none"}}>✦ Ask AI</button>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:6}}>
            {tab==="search" ? (q?res.length>0?res.map(p=><div key={p.id} onClick={()=>{setAct(p.id);setSrch(false);setQ("")}} style={{padding:"12px 16px",borderRadius:8,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontSize:14,fontWeight:500,color:T.fg,fontFamily:T.hf}}>{p.title}</div>
              <div style={{fontSize:12,color:T.fgFaint,marginTop:2}}>{(p.blocks.find(b=>b.text)?.text||"").replace(/<[^>]+>/g,"").slice(0,90)}…</div>
            </div>):<div style={{padding:20,textAlign:"center",color:T.fgFaint,fontStyle:"italic"}}>No results</div>
              :<div style={{padding:20,textAlign:"center",color:T.fgFaint,fontStyle:"italic"}}>Start typing…</div>
            ) : (
            <div style={{padding:"12px 16px"}}>
              {!aiAnswer&&!aiLoading&&<div>
                <div style={{fontSize:13,color:T.fgMuted,marginBottom:14,lineHeight:1.6}}>Ask any question about the documentation.</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{["What is bail-in?","Explain NCWO","MREL requirements","Resolution tools overview","What does this book cover?"].map((s,i)=><button key={i} onClick={()=>{setQ(s);doAsk(s)}}
                  style={{padding:"5px 12px",background:T.card,border:"1px solid "+T.border,borderRadius:20,fontSize:11,color:T.fgMuted,cursor:"pointer",fontFamily:T.bf}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>{s}</button>)}</div>
                {q.trim()&&<button onClick={()=>doAsk(q.trim())} style={{width:"100%",padding:"10px",background:T.ac,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.bf,marginTop:10}}>Ask: “{q.trim().slice(0,50)}”</button>}
              </div>}
              {aiLoading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"28px 0"}}>
                <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:T.ac,animation:"pulse 1.2s "+i*0.2+"s infinite"}} />)}</div>
                <div style={{fontSize:13,color:T.fgMuted,fontFamily:T.hf,fontStyle:"italic"}}>Reading documentation…</div>
              </div>}
              {aiAnswer&&(()=>{
                // Extract [SOURCE: ...] references
                const sourceMatches = aiAnswer.match(/\[SOURCE:\s*([^\]]+)\]/g) || [];
                const sourceNames = sourceMatches.map(s => s.replace(/\[SOURCE:\s*/, "").replace(/\]$/, "").trim());
                const cleanAnswer = aiAnswer.replace(/\n?\[SOURCE:[^\]]+\]/g, "").trim();
                // Match source names to page IDs
                const sourcePages = sourceNames.map(name => {
                  const match = allP.find(p => p.title === name || p.title.includes(name) || name.includes(p.title));
                  return match ? { id: match.id, title: match.title } : null;
                }).filter(Boolean);
                // Deduplicate
                const uniqueSources = sourcePages.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);

                return <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <div style={{width:24,height:24,borderRadius:6,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontFamily:T.mf,fontWeight:700}}>✦</div>
                    <span style={{fontSize:12,fontWeight:600,color:T.ac,fontFamily:T.mf}}>DIFILEX AI</span>
                  </div>
                  <div style={{fontSize:15,lineHeight:1.75,color:T.fgBody,fontFamily:T.bf,padding:"18px 22px",background:T.card,borderRadius:4,border:"1px solid "+T.border}}
                    dangerouslySetInnerHTML={{__html:cleanAnswer.replace(/^#{1,3}\s+(.+)$/gm,'**$1**').replace(/\*\*([^*]+)\*\*/g,'<b style="color:'+T.ac+'">$1</b>').replace(/\n\n/g,'</p><p style="margin:0 0 12px">').replace(/^/,'<p style="margin:0 0 12px">').replace(/$/,'</p>')}} />

                  {/* Source reference buttons */}
                  {uniqueSources.length > 0 && (
                    <div style={{marginTop:14,padding:"12px 14px",background:T.hover,borderRadius:6,border:"1px solid "+T.border}}>
                      <div style={{fontSize:10,fontWeight:600,color:T.fgFaint,fontFamily:T.mf,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>References from this website</div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {uniqueSources.map(src => (
                          <button key={src.id} onClick={() => { setAct(src.id); setSrch(false); setQ(""); setAiAnswer(null); }}
                            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:T.card,border:"1px solid "+T.border,borderRadius:4,cursor:"pointer",fontSize:13,color:T.fg,fontFamily:T.bf,fontWeight:400,transition:"all .12s",textAlign:"left"}}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.ac; e.currentTarget.style.color = T.ac; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.fg; }}>
                            
                            <span style={{flex:1}}>{src.title}</span>
                            <span style={{fontSize:11,color:T.fgFaint}}>→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={()=>{setAiAnswer(null);setQ("")}} style={{marginTop:12,padding:"6px 14px",background:T.hover,border:"1px solid "+T.border,borderRadius:7,cursor:"pointer",fontSize:12,color:T.fgMuted,fontFamily:T.bf}}>← Ask another</button>
                </div>;
              })()}
            </div>
            )}
          </div>
        </div>
      </div>}

      {/* Print Preview */}
      {printMode && (
        <div style={{position:"fixed",inset:0,background:T.bg,zIndex:3000,overflowY:"auto"}}>
          <div style={{position:"sticky",top:0,zIndex:1,background:T.bg,borderBottom:"1px solid "+T.border,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src={LOGO} alt="Difilex" style={{height:20,...(isDark?{filter:"invert(1)"}:{})}} />
              <span style={{fontSize:12,color:T.fgMuted,fontFamily:T.mf}}>Print Preview</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>window.print()}
                style={{padding:"7px 18px",background:T.ac,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.bf}}>
                Print / Save as PDF
              </button>
              <button onClick={()=>setPrintMode(false)}
                style={{padding:"7px 14px",background:"transparent",border:"1px solid "+T.border,borderRadius:7,cursor:"pointer",fontSize:13,color:T.fgMuted,fontFamily:T.bf}}>
                Close
              </button>
            </div>
          </div>
          <div id="print-area" style={{maxWidth:680,margin:"0 auto",padding:"40px 48px 80px",fontFamily:T.bf}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,paddingBottom:16,borderBottom:"2px solid "+T.ac}}>
              <div style={{fontFamily:T.mf,fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:T.ac}}>Difilex — Living Regulatory Book</div>
              <div style={{fontFamily:T.mf,fontSize:10,color:T.fgFaint}}>{new Date().toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
            {pg?.blocks.map(b => <Block key={b.id} b={b} ed={false} T={T} pages={pages} onNav={null} />)}
            <div style={{marginTop:40,paddingTop:16,borderTop:"1px solid "+T.border,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <img src={LOGO} alt="Difilex" style={{height:22,opacity:0.4}} />
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                <span style={{fontSize:9,color:T.fgFaint,fontFamily:T.mf}}>© {new Date().getFullYear()} Difilex. All rights reserved.</span>
                <span style={{fontSize:9,color:T.fgFaint,fontFamily:T.mf}}>difilex.nl</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{"*{box-sizing:border-box;outline-color:"+T.ac+"}code{background:"+T.hover+";padding:1px 6px;border-radius:3px;font-family:"+T.mf+";font-size:.88em;color:"+T.ac+"}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:"+T.border+";border-radius:3px}@keyframes pulse{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}[data-placeholder]:empty:before{content:attr(data-placeholder);color:"+T.fgFaint+";pointer-events:none;font-style:italic}@media print{body *{visibility:hidden}#print-area,#print-area *{visibility:visible}#print-area{position:absolute;left:0;top:0;width:100%;padding:32px 48px}}"}</style>
    </div>
  );
}

/* EDITOR SECTION */
function EditorSection({sec,pages,act,setAct,onAddPage,onRenameSec,onDeleteSec,onAddSub,onRenPage,onDelPage,onMovePage,T}) {
  const [exp,setExp]=useState(true);const [hov,setHov]=useState(false);const [ren,setRen]=useState(false);const [rv,setRv]=useState(sec.label);
  const [dropHere,setDropHere]=useState(false);
  const [dropHeader,setDropHeader]=useState(false);
  return <div style={{marginBottom:6}}>
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onDragOver={e=>{e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect="move";setDropHeader(true)}}
      onDragLeave={()=>setDropHeader(false)}
      onDrop={e=>{e.preventDefault();e.stopPropagation();setDropHeader(false);const src=e.dataTransfer.getData("text/plain");if(src){onMovePage(src,null,sec.id);setExp(true)}}}
      style={{display:"flex",alignItems:"center",padding:"8px 10px 4px",gap:4,borderRadius:4,border:dropHeader?"2px dashed "+T.ac:"2px solid transparent",background:dropHeader?T.acLight:"transparent",transition:"all .12s"}}>
      <button onClick={()=>setExp(!exp)} style={{width:12,height:12,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:7,transform:exp?"rotate(90deg)":"none",transition:"transform .12s"}}>▸</button>
      {ren?<input autoFocus value={rv} onChange={e=>setRv(e.target.value)} onBlur={()=>{if(rv.trim())onRenameSec(sec.id,rv.trim());setRen(false)}} onKeyDown={e=>{if(e.key==="Enter"){if(rv.trim())onRenameSec(sec.id,rv.trim());setRen(false)}if(e.key==="Escape")setRen(false)}}
        style={{flex:1,border:"none",outline:"none",background:T.sActive,color:T.ac,fontSize:10,fontWeight:700,fontFamily:T.mf,padding:"1px 4px",borderRadius:3,textTransform:"uppercase",letterSpacing:".06em"}} />
        :<span onDoubleClick={()=>{setRen(true);setRv(sec.label)}} style={{flex:1,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:dropHeader?T.ac:T.fgFaint,fontFamily:T.mf}}>{sec.label}{dropHeader?" — drop here":""}</span>}
      {hov&&!ren&&!dropHeader&&<div style={{display:"flex",gap:2}}>
        <button onClick={()=>onAddPage(sec.id)} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:13}} onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>+</button>
        <button onClick={()=>{setRen(true);setRv(sec.label)}} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:9}} onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>✎</button>
        <button onClick={()=>onDeleteSec(sec.id)} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:10}} onMouseEnter={e=>e.currentTarget.style.color="#dc2626"} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>×</button>
      </div>}
    </div>
    {exp&&sec.pages.map(pid=><EditorPageItem key={pid} pid={pid} pages={pages} act={act} setAct={setAct} depth={0} onAddSub={onAddSub} onRen={onRenPage} onDel={onDelPage} onMove={onMovePage} T={T} />)}
  </div>;
}

function EditorPageItem({pid,pages,act,setAct,depth,onAddSub,onRen,onDel,onMove,T}) {
  const p=pages[pid];if(!p)return null;
  const [exp,setExp]=useState(true);const [hov,setHov]=useState(false);const [ren,setRen]=useState(false);const [rv,setRv]=useState(p.title);
  const [dropTarget,setDropTarget]=useState(false);
  const isA=act===pid;const hasCh=p.children?.length>0;

  const handleDragStart=(e)=>{
    e.dataTransfer.setData("text/plain",pid);
    e.dataTransfer.effectAllowed="move";
  };
  const handleDragOver=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    const src=e.dataTransfer.types.includes("text/plain");
    if(src){e.dataTransfer.dropEffect="move";setDropTarget(true)}
  };
  const handleDrop=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(false);
    const srcId=e.dataTransfer.getData("text/plain");
    if(srcId&&srcId!==pid){
      // Don't allow dropping a parent onto its own child
      const isChild=(parentId,childId)=>{const pg=pages[parentId];if(!pg)return false;if(pg.children?.includes(childId))return true;return pg.children?.some(c=>isChild(c,childId))||false};
      if(!isChild(srcId,pid)) onMove(srcId,pid,null);
    }
  };

  return <div>
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      draggable={!ren} onDragStart={handleDragStart}
      onDragOver={handleDragOver} onDragLeave={()=>setDropTarget(false)} onDrop={handleDrop}>
      <div onClick={()=>{if(!ren)setAct(pid)}}
        style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px 6px "+(10+depth*16)+"px",borderRadius:6,cursor:"pointer",marginBottom:1,
          background:dropTarget?T.acLight:isA?T.sActive:"transparent",
          color:isA?T.sActText:T.fgMuted,fontSize:13,
          border:dropTarget?"2px dashed "+T.ac:"2px solid transparent",
          transition:"all .1s"}}
        onMouseEnter={e=>{if(!isA&&!dropTarget)e.currentTarget.style.background=T.hover}}
        onMouseLeave={e=>{if(!isA&&!dropTarget)e.currentTarget.style.background="transparent"}}>
        {hasCh?<button onClick={e=>{e.stopPropagation();setExp(!exp)}} style={{width:12,height:12,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:7,transform:exp?"rotate(90deg)":"none"}}>▸</button>:<span style={{width:12}} />}
        {ren?<input autoFocus value={rv} onChange={e=>setRv(e.target.value)} onClick={e=>e.stopPropagation()} onBlur={()=>{if(rv.trim())onRen(pid,rv.trim());setRen(false)}} onKeyDown={e=>{if(e.key==="Enter"){if(rv.trim())onRen(pid,rv.trim());setRen(false)}if(e.key==="Escape")setRen(false)}}
          style={{flex:1,border:"none",outline:"none",background:T.sActive,color:T.sActText,fontSize:13,fontFamily:T.bf,padding:"1px 4px",borderRadius:3,minWidth:0}} />
          :<span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</span>}
        {hov&&!ren&&<div style={{display:"flex",gap:1,flexShrink:0}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>onAddSub(pid)} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:13}} onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>+</button>
          <button onClick={()=>{setRen(true);setRv(p.title)}} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:9}} onMouseEnter={e=>e.currentTarget.style.color=T.ac} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>✎</button>
          <button onClick={()=>onDel(pid)} style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:T.fgFaint,fontSize:10}} onMouseEnter={e=>e.currentTarget.style.color="#dc2626"} onMouseLeave={e=>e.currentTarget.style.color=T.fgFaint}>×</button>
        </div>}
        {dropTarget&&<span style={{fontSize:9,color:T.ac,fontFamily:T.mf,flexShrink:0}}>Drop as sub</span>}
      </div>
    </div>
    {hasCh&&exp&&p.children.map(cid=><EditorPageItem key={cid} pid={cid} pages={pages} act={act} setAct={setAct} depth={depth+1} onAddSub={onAddSub} onRen={onRen} onDel={onDel} onMove={onMove} T={T} />)}
  </div>;
}

/* EDITOR */
function Editor({pages,setPages,secs,setSecs,meta,onPub,onExit,T,isDark,onToggleDark,undoStack,setUndoStack,redoStack,setRedoStack}) {
  const [act,setAct]=useState(secs[0]?.pages[0]||"");
  const [saving,setSaving]=useState(false);
  const [addingSec,setAddingSec]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const [importOpen,setImportOpen]=useState(false);
  const [eurLexOpen,setEurLexOpen]=useState(false);
  const [versionsOpen,setVersionsOpen]=useState(false);
  const [addMenu,setAddMenu]=useState(null);
  const [scrollPct,setScrollPct]=useState(0);
  const isMobile = useIsMobile(768);
  const [sideW,setSideW]=useState(260);
  const [sideOpen,setSideOpen]=useState(true);
  const [tocW,setTocW]=useState(200);
  const [tocOpen,setTocOpen]=useState(true);

  // Auto-collapse on mobile
  useEffect(()=>{if(isMobile){setSideOpen(false);setTocOpen(false)}else{setSideOpen(true);setTocOpen(true)}},[isMobile]);
  const sRef=useRef(null);
  const sideWRef=useRef(260);
  const tocWRef=useRef(200);
  useEffect(()=>{sideWRef.current=sideW},[sideW]);
  useEffect(()=>{tocWRef.current=tocW},[tocW]);
  const pg=pages[act];
  useEffect(()=>{if(sRef.current){sRef.current.scrollTop=0;setScrollPct(0)}},[act]);

  // Undo / Redo
  const snap = () => ({pages:JSON.parse(JSON.stringify(pages)),secs:JSON.parse(JSON.stringify(secs))});
  const pushUndo = () => { setUndoStack(s=>[...s.slice(-29),snap()]); setRedoStack([]); };
  const undo = () => {
    if(undoStack.length===0)return;
    setRedoStack(s=>[...s.slice(-29),snap()]);
    const prev=undoStack[undoStack.length-1];
    setPages(prev.pages); setSecs(prev.secs);
    setUndoStack(s=>s.slice(0,-1));
  };
  const redo = () => {
    if(redoStack.length===0)return;
    setUndoStack(s=>[...s.slice(-29),snap()]);
    const next=redoStack[redoStack.length-1];
    setPages(next.pages); setSecs(next.secs);
    setRedoStack(s=>s.slice(0,-1));
  };
  useEffect(()=>{const h=e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();undo()}
    if((e.ctrlKey||e.metaKey)&&e.key==="z"&&e.shiftKey){e.preventDefault();redo()}
    if((e.ctrlKey||e.metaKey)&&e.key==="y"){e.preventDefault();redo()}
  };document.addEventListener("keydown",h);return()=>document.removeEventListener("keydown",h)},[undoStack,redoStack,pages,secs]);

  const upB=(pid,bid,u)=>{pushUndo();setPages(p=>({...p,[pid]:{...p[pid],blocks:p[pid].blocks.map(b=>b.id===bid?u:b)}}))};
  const delB=(pid,bid)=>{pushUndo();setPages(p=>({...p,[pid]:{...p[pid],blocks:p[pid].blocks.filter(b=>b.id!==bid)}}))};
  const addB=(pid,after,type)=>{pushUndo();const nb={id:"b"+Date.now(),type};if(type==="ul"||type==="ol")nb.items=["Item"];else if(type==="callout"){nb.text="Callout";nb.variant="info"}else if(type==="code"){nb.code="";nb.language=""}else if(type==="table"){nb.rows=[["Header 1","Header 2"],["",""]]}else if(type==="image"){nb.src="";nb.alt="";nb.caption=""}else if(type==="embed"){nb.html="";nb.filename="";nb.interactive=false}else if(type==="pagelink"){nb.targetId="";nb.label=""}else if(type==="expandable"){nb.title="Click to expand";nb.text="";nb.open=true}else if(type==="steps"){nb.steps=[{title:"Step 1",text:""},{title:"Step 2",text:""},{title:"Step 3",text:""}]}else if(type!=="divider")nb.text="";setPages(p=>{const bl=[...p[pid].blocks];bl.splice(bl.findIndex(b=>b.id===after)+1,0,nb);return{...p,[pid]:{...p[pid],blocks:bl}}})};

  const moveBlock=(pid,bid,dir)=>{pushUndo();setPages(p=>{const bl=[...p[pid].blocks];const i=bl.findIndex(b=>b.id===bid);if(i<0)return p;const ni=i+dir;if(ni<0||ni>=bl.length)return p;const tmp=bl[i];bl[i]=bl[ni];bl[ni]=tmp;return{...p,[pid]:{...p[pid],blocks:bl}}})};
  const reorderBlock=(pid,srcId,targetId)=>{if(srcId===targetId)return;pushUndo();setPages(p=>{const bl=[...p[pid].blocks];const si=bl.findIndex(b=>b.id===srcId);const ti=bl.findIndex(b=>b.id===targetId);if(si<0||ti<0)return p;const [item]=bl.splice(si,1);bl.splice(ti,0,item);return{...p,[pid]:{...p[pid],blocks:bl}}})};
  const dupBlock=(pid,bid)=>{pushUndo();setPages(p=>{const bl=[...p[pid].blocks];const i=bl.findIndex(b=>b.id===bid);if(i<0)return p;const nb={...JSON.parse(JSON.stringify(bl[i])),id:"b"+Date.now()};bl.splice(i+1,0,nb);return{...p,[pid]:{...p[pid],blocks:bl}}})};

  const createPage=(title,parentId,secId)=>{pushUndo();const id="pg_"+Date.now();const np={id,title,icon:"§",children:[],blocks:[{id:"b"+Date.now(),type:"h1",text:title},{id:"b"+(Date.now()+1),type:"p",text:""}]};setPages(p=>{const r={...p,[id]:np};if(parentId&&r[parentId])r[parentId]={...r[parentId],children:[...r[parentId].children,id]};return r});if(!parentId&&secId)setSecs(s=>s.map(sec=>sec.id===secId?{...sec,pages:[...sec.pages,id]}:sec));setAct(id)};
  const renPage=(pid,title)=>{pushUndo();setPages(p=>({...p,[pid]:{...p[pid],title}}))};
  const delPage=(pid)=>{pushUndo();setPages(p=>{const np={...p};Object.values(np).forEach(pg=>{if(pg.children?.includes(pid))pg.children=pg.children.filter(c=>c!==pid)});const td=[pid];const g=id=>(np[id]?.children||[]).forEach(c=>{td.push(c);g(c)});g(pid);td.forEach(d=>delete np[d]);return np});setSecs(s=>s.map(sec=>({...sec,pages:sec.pages.filter(p=>p!==pid)})));if(act===pid)setAct(Object.keys(pages).find(k=>k!==pid)||"")};
  const addSec=l=>{pushUndo();setSecs(s=>[...s,{id:"sec_"+Date.now(),label:l,pages:[]}])};
  const renSec=(sid,l)=>{pushUndo();setSecs(s=>s.map(sec=>sec.id===sid?{...sec,label:l}:sec))};
  const delSec=sid=>{pushUndo();setSecs(s=>s.filter(sec=>sec.id!==sid))};

  // Move page: remove from old parent/section, add as child of newParent or top-level in targetSec
  const movePage=(srcId, newParentId, targetSecId)=>{
    pushUndo();
    setPages(p=>{
      const np={...p};
      // Remove srcId from any parent's children
      Object.values(np).forEach(pg=>{
        if(pg.children?.includes(srcId)) np[pg.id]={...pg,children:pg.children.filter(c=>c!==srcId)};
      });
      // Add as child of newParent
      if(newParentId && np[newParentId]){
        np[newParentId]={...np[newParentId],children:[...(np[newParentId].children||[]),srcId]};
      }
      return np;
    });
    // Remove from all sections
    setSecs(s=>{
      let ns=s.map(sec=>({...sec,pages:sec.pages.filter(p=>p!==srcId)}));
      // If moving to top-level in a section
      if(!newParentId && targetSecId){
        ns=ns.map(sec=>sec.id===targetSecId?{...sec,pages:[...sec.pages,srcId]}:sec);
      }
      return ns;
    });
  };

  const processFiles=async(fileList)=>{if(!act||!pg)return;pushUndo();const files=Array.from(fileList);const nbs=[];for(const file of files){const name=file.name.toLowerCase();const ts=Date.now()+Math.random();if(/\.(png|jpe?g|gif|webp)$/i.test(name)){const url=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(file)});nbs.push({id:"b"+ts,type:"image",src:url,alt:file.name,caption:""})}else if(/\.svg$/i.test(name)){nbs.push({id:"b"+ts,type:"embed",html:await file.text(),filename:file.name})}else if(/\.html?$/i.test(name)){const t=await file.text();const isInteractive=t.includes("<script")||t.includes("<!DOCTYPE")||t.includes("<html");nbs.push({id:"b"+ts,type:"embed",html:t,filename:file.name,interactive:isInteractive})}else if(/\.(txt|md)$/i.test(name)){nbs.push(...parseMd(await file.text()))}}if(nbs.length)setPages(p=>({...p,[act]:{...p[act],blocks:[...p[act].blocks,...nbs]}}))};

  const handleImport=(files)=>{pushUndo();const np={};const ids=[];for(const f of files){const id="pg_"+Date.now()+"_"+Math.random().toString(36).slice(2,5);np[id]={id,title:f.title,icon:"§",children:[],blocks:f.blocks};ids.push(id)}setPages(p=>({...p,...np}));setSecs(s=>[...s,{id:"sec_"+Date.now(),label:"Imported",pages:ids}]);if(ids[0])setAct(ids[0]);setImportOpen(false)};

  const handleEurLexImport=(parsed)=>{
    pushUndo();
    const id = "pg_"+Date.now()+"_el";
    const newPage = {id, title:parsed.title.slice(0,80), icon:"§", children:[], blocks:parsed.blocks};
    setPages(p=>({...p,[id]:newPage}));
    setSecs(s=>[...s,{id:"sec_"+Date.now(),label:parsed.title.slice(0,40),pages:[id]}]);
    setAct(id);
    setEurLexOpen(false);
  };

  const pub=async()=>{setSaving(true);await onPub();setSaving(false)};
  const restoreVersion=(v)=>{pushUndo();setPages(v.pages);setSecs(v.secs)};
  const OPTS=[{t:"p",l:"Paragraph"},{t:"h1",l:"H1"},{t:"h2",l:"H2"},{t:"h3",l:"H3"},{t:"quote",l:"Quote"},{t:"ul",l:"Bullets"},{t:"ol",l:"Numbered"},{t:"callout",l:"Callout"},{t:"expandable",l:"Expandable"},{t:"steps",l:"Step Plan"},{t:"code",l:"Code"},{t:"table",l:"Table"},{t:"pagelink",l:"Page Link"},{t:"image",l:"Image"},{t:"embed",l:"HTML/SVG"},{t:"divider",l:"Divider"}];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:T.bf,background:T.bg}}>
      {/* Full-width editor header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid "+T.border,flexShrink:0,background:T.bg,fontFamily:T.uf}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src={LOGO} alt="Difilex" style={{height:48,...(isDark?{filter:"invert(1)"}:{})}} />
          <div style={{fontSize:11,color:T.fgMuted,fontFamily:T.uf}}>Editor · {Object.keys(pages).length} pages</div>
          <div style={{display:"flex",alignItems:"center",gap:2,marginLeft:4}}>
            <button onClick={undo} disabled={undoStack.length===0} title="Undo (Ctrl+Z)"
              style={{padding:"4px 8px",background:"transparent",border:"1px solid "+(undoStack.length>0?T.border:T.hover),borderRadius:5,cursor:undoStack.length>0?"pointer":"default",fontSize:12,color:undoStack.length>0?T.fgMuted:T.hover,fontFamily:T.uf}}
              onMouseEnter={e=>{if(undoStack.length>0)e.currentTarget.style.borderColor=T.ac}} onMouseLeave={e=>e.currentTarget.style.borderColor=undoStack.length>0?T.border:T.hover}>↩</button>
            <button onClick={redo} disabled={redoStack.length===0} title="Redo (Ctrl+Shift+Z)"
              style={{padding:"4px 8px",background:"transparent",border:"1px solid "+(redoStack.length>0?T.border:T.hover),borderRadius:5,cursor:redoStack.length>0?"pointer":"default",fontSize:12,color:redoStack.length>0?T.fgMuted:T.hover,fontFamily:T.uf}}
              onMouseEnter={e=>{if(redoStack.length>0)e.currentTarget.style.borderColor=T.ac}} onMouseLeave={e=>e.currentTarget.style.borderColor=redoStack.length>0?T.border:T.hover}>↪</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:isMobile?"wrap":"nowrap"}}>
          {!isMobile&&<><button onClick={()=>setImportOpen(true)} style={{padding:"6px 12px",background:"transparent",border:"1px solid "+T.border,color:T.fgMuted,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:T.uf}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>↑ Import</button>
          <button onClick={()=>setEurLexOpen(true)} style={{padding:"6px 12px",background:"transparent",border:"1px solid "+T.border,color:T.fgMuted,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:T.uf}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>EU EUR-Lex</button></>}
          <button onClick={()=>setVersionsOpen(true)} style={{padding:"6px 12px",background:"transparent",border:"1px solid "+T.border,color:T.fgMuted,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:T.uf}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgMuted}}>History{meta.versions?.length>0?" ("+meta.versions.length+")":""}</button>
          <button onClick={onToggleDark} style={{padding:"6px 10px",background:"transparent",border:"1px solid "+T.border,color:T.fgMuted,borderRadius:7,cursor:"pointer",fontSize:12}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>{isDark?"☀":"☾"}</button>
          <button onClick={pub} style={{padding:"6px 16px",background:T.ac,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.uf}}>{saving?"Publishing…":"⬆ Publish"}</button>
          <button onClick={onExit} style={{padding:"6px 12px",background:"transparent",border:"1px solid "+T.border,color:T.fgMuted,borderRadius:7,cursor:"pointer",fontSize:11,fontFamily:T.uf}}>← Back</button>
        </div>
      </div>
      {/* Body: sidebar + toc + content */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {!sideOpen && (
          <div style={{width:32,flexShrink:0,borderRight:"1px solid "+T.border,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12}}>
            <button onClick={()=>setSideOpen(true)} title="Show sidebar"
              style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>▸</button>
          </div>
        )}
        {sideOpen && <>
          <div style={{width:sideW,background:T.bg,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",flexShrink:0,minWidth:160,maxWidth:400,position:"relative"}}>
            <button onClick={()=>setSideOpen(false)} title="Hide sidebar"
              style={{position:"absolute",top:8,right:8,width:20,height:20,borderRadius:4,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>◂</button>
            <div style={{flex:1,overflowY:"auto",padding:"12px 8px"}}>
              {secs.map(sec=><EditorSection key={sec.id} sec={sec} pages={pages} act={act} setAct={setAct} onAddPage={sid=>createPage("Untitled",null,sid)} onRenameSec={renSec} onDeleteSec={delSec} onAddSub={pid=>createPage("Untitled Sub",pid)} onRenPage={renPage} onDelPage={delPage} onMovePage={movePage} T={T} />)}
              {addingSec!==null?<div style={{padding:"4px 8px"}}><input autoFocus value={addingSec} onChange={e=>setAddingSec(e.target.value)} onBlur={()=>{if(addingSec.trim())addSec(addingSec.trim());setAddingSec(null)}} onKeyDown={e=>{if(e.key==="Enter"){if(addingSec.trim())addSec(addingSec.trim());setAddingSec(null)}if(e.key==="Escape")setAddingSec(null)}} placeholder="Section name…"
                style={{width:"100%",border:"1px solid "+T.ac,outline:"none",background:T.sActive,color:T.ac,fontSize:10,fontFamily:T.mf,padding:"5px 8px",borderRadius:5,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",boxSizing:"border-box"}} /></div>
                :<button onClick={()=>setAddingSec("")} style={{width:"calc(100% - 16px)",margin:"6px 8px",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",background:"transparent",border:"1px dashed "+T.border,borderRadius:6,cursor:"pointer",color:T.fgFaint,fontSize:11,fontFamily:T.bf}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.fgMuted}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>+ Add collection</button>}
            </div>
          </div>
          <PanelHandle T={T} onResize={dx=>{setSideW(Math.max(160,Math.min(400,sideWRef.current+dx)))}} />
        </>}
        {!tocOpen && (
          <div style={{width:32,flexShrink:0,borderRight:"1px solid "+T.border,background:T.surface,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12}}>
            <button onClick={()=>setTocOpen(true)} title="Show TOC"
              style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,cursor:"pointer",color:T.fgFaint,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>▸</button>
          </div>
        )}
        {tocOpen && <>
          <PageToc page={pg} scrollRef={sRef} T={T} tocW={tocW} setTocOpen={setTocOpen} />
          <PanelHandle T={T} onResize={dx=>{setTocW(Math.max(120,Math.min(320,tocWRef.current+dx)))}} />
        </>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{height:3,background:T.border,flexShrink:0}}>
            <div style={{height:"100%",background:T.ac,width:scrollPct+"%",transition:"width .1s",borderRadius:"0 2px 2px 0"}} />
          </div>
          <div ref={sRef} style={{flex:1,overflowY:"auto",background:T.card}} onScroll={e=>{setAddMenu(null);const el=e.currentTarget;const pct=el.scrollHeight<=el.clientHeight?100:Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight))*100);setScrollPct(pct)}} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={e=>{e.preventDefault();setDragOver(false)}} onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files.length)processFiles(e.dataTransfer.files)}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"12px 40px 80px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,padding:"8px 14px",background:T.acLight,borderRadius:8,border:"1px solid "+T.border,fontSize:12,color:T.ac}}>
              <span style={{fontWeight:700}}>✎ Editing</span> — Click text to edit. Drag files to add. <b>Ctrl+Z</b> undo · <b>Ctrl+Shift+Z</b> redo. <b>Publish</b> to update readers.
            </div>
            <TTSPlayer page={pg} T={T} />
            {dragOver&&<div style={{padding:"40px 20px",border:"2px dashed "+T.ac,borderRadius:4,background:T.acLight,textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:28,opacity:.5}}>⬇</div>
              <div style={{fontSize:15,fontFamily:T.hf,color:T.ac}}>Drop files here</div>
              <div style={{fontSize:12,color:T.fgMuted,marginTop:4}}>Images · SVG · HTML · Markdown</div>
            </div>}
            <div id="page-content">
            {pg?.blocks.map((b,bi)=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:4,marginBottom:2,position:"relative"}}
                draggable onDragStart={e=>{e.dataTransfer.setData("block-id",b.id);e.dataTransfer.effectAllowed="move"}}
                onDragOver={e=>{e.preventDefault();e.stopPropagation();e.currentTarget.style.borderTop="2px solid "+T.ac}}
                onDragLeave={e=>{e.currentTarget.style.borderTop="2px solid transparent"}}
                onDrop={e=>{e.preventDefault();e.currentTarget.style.borderTop="2px solid transparent";const srcId=e.dataTransfer.getData("block-id");if(srcId)reorderBlock(act,srcId,b.id)}}
                style={{borderTop:"2px solid transparent",transition:"border-color .1s"}}>
                <div style={{display:"flex",gap:2,flexShrink:0}}>
                  <button onClick={e=>{e.stopPropagation();if(addMenu===b.id){setAddMenu(null)}else{const r=e.currentTarget.getBoundingClientRect();setAddMenu({id:b.id,x:r.right+4,y:r.top})}}}
                    style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",background:addMenu?.id===b.id?T.ac:T.hover,borderRadius:3,color:addMenu?.id===b.id?"#fff":T.fgFaint,fontSize:13,border:"1px solid "+(addMenu?.id===b.id?T.ac:T.border),cursor:"pointer",transition:"all .1s"}}
                    onMouseEnter={e=>{if(addMenu?.id!==b.id){e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}}}
                    onMouseLeave={e=>{if(addMenu?.id!==b.id){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}}>+</button>
                  <button onClick={e=>{e.stopPropagation();delB(act,b.id)}}
                    style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"1px solid "+T.border,borderRadius:3,cursor:"pointer",color:T.fgFaint,fontSize:10,transition:"all .1s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.color="#dc2626";e.currentTarget.style.borderColor="#fca5a5"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.fgFaint;e.currentTarget.style.borderColor=T.border}}>×</button>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <Block b={b} ed={true} onUp={u=>upB(act,b.id,u)} T={T} pages={pages} onNav={pid=>setAct(pid)} />
                </div>
              </div>
            ))}
            </div>
            {/* Floating add-block dropdown */}
            {addMenu&&<div onClick={()=>setAddMenu(null)} style={{position:"fixed",inset:0,zIndex:99}}>
              <div onClick={e=>e.stopPropagation()} style={{position:"fixed",left:addMenu.x,top:addMenu.y,zIndex:100,background:T.card,border:"1px solid "+T.border,borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,.12)",padding:4,minWidth:150,maxHeight:320,overflowY:"auto"}}>
                {OPTS.map(o=>(
                  <button key={o.t} onClick={()=>{addB(act,addMenu.id,o.t);setAddMenu(null)}}
                    style={{display:"block",width:"100%",padding:"7px 14px",background:"transparent",border:"none",borderRadius:4,cursor:"pointer",fontSize:12,color:T.fg,fontFamily:T.uf,textAlign:"left"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.hover}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{o.l}</button>
                ))}
              </div>
            </div>}
            <button onClick={()=>{const lb=pg?.blocks[pg.blocks.length-1];if(lb)addB(act,lb.id,"p")}}
              style={{width:"100%",padding:"12px",marginTop:16,background:"transparent",border:"1px dashed "+T.border,borderRadius:8,cursor:"pointer",color:T.fgFaint,fontSize:13,fontFamily:T.bf}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.color=T.ac}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.fgFaint}}>+ Add block</button>
          </div>
        </div>
        </div>
      </div>
      {/* Full-width footer */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 24px",borderTop:"1px solid "+T.border,flexShrink:0,background:T.bg,fontSize:11,color:T.fgFaint,fontFamily:T.uf}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
<span>© {new Date().getFullYear()} Difilex</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          {["About","Legal","Terms of Use","Privacy","Contact"].map((lk,i)=>
            <span key={i} style={{color:T.fgFaint,fontSize:11,fontFamily:T.uf}}>{lk}</span>
          )}
        </div>
      </div>

      {importOpen&&<ImportModal onImport={handleImport} onClose={()=>setImportOpen(false)} T={T} />}
      {eurLexOpen&&<EurLexModal onImport={handleEurLexImport} onClose={()=>setEurLexOpen(false)} T={T} />}
      {versionsOpen&&<VersionHistory versions={meta.versions||[]} onRestore={restoreVersion} onClose={()=>setVersionsOpen(false)} T={T} />}
      <style>{"*{box-sizing:border-box;outline-color:"+T.ac+"}code{background:"+T.hover+";padding:1px 6px;border-radius:3px;font-family:"+T.mf+";font-size:.88em;color:"+T.ac+"}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:"+T.border+";border-radius:3px}.edb:hover .edc{opacity:1 !important}[data-placeholder]:empty:before{content:attr(data-placeholder);color:"+T.fgFaint+";pointer-events:none;font-style:italic}"}</style>
    </div>
  );
}

/* LOGIN */
function Login({onOk,onNo,T}) {
  const [pw,setPw]=useState("");
  const [err,setErr]=useState(false);
  const [step,setStep]=useState("pw"); // "pw" or "role"
  const tryLogin=()=>{
    if(pw==="admin"||pw===T._pw){setStep("role")}
    else setErr(true);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
      <div style={{width:400,background:T.surface,borderRadius:8,padding:"36px 32px",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <img src={LOGO} alt="Difilex" style={{height:80,marginBottom:20}} />

        {step==="pw" && <>
          <h2 style={{fontSize:22,fontFamily:T.hf,fontWeight:400,margin:"0 0 6px",color:T.fg}}>Login</h2>
          <p style={{fontSize:14,color:T.fgMuted,margin:"0 0 20px",fontFamily:T.uf}}>Enter your password to continue.</p>
          {err&&<div style={{padding:"8px 12px",background:"#fef2f2",borderLeft:"2px solid #dc2626",borderRadius:"0 4px 4px 0",color:"#dc2626",fontSize:13,marginBottom:14,fontFamily:T.uf}}>Incorrect password</div>}
          <div>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>{if(e.key==="Enter")tryLogin()}} placeholder="Password" autoFocus
              style={{width:"100%",padding:"10px 14px",border:"1px solid "+(err?"#fca5a5":T.border),borderRadius:6,fontSize:15,fontFamily:T.uf,outline:"none",marginBottom:16,boxSizing:"border-box",background:"transparent",color:T.fg}} />
            <div style={{display:"flex",gap:8}}>
              <button onClick={onNo} style={{flex:1,padding:"10px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",fontSize:14,color:T.fgMuted,fontFamily:T.uf}}>Cancel</button>
              <button onClick={tryLogin} style={{flex:1,padding:"10px",background:T.ac,color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:T.uf}}>Login</button>
            </div>
          </div>
        </>}

        {step==="role" && <>
          <h2 style={{fontSize:22,fontFamily:T.hf,fontWeight:400,margin:"0 0 6px",color:T.fg}}>Welcome</h2>
          <p style={{fontSize:14,color:T.fgMuted,margin:"0 0 24px",fontFamily:T.uf}}>Choose how you want to continue.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>onOk("client")}
              style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",textAlign:"left",transition:"all .12s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.background=T.hover}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="transparent"}}>
              <div style={{width:36,height:36,borderRadius:8,background:T.acLight,display:"flex",alignItems:"center",justifyContent:"center",color:T.ac,fontSize:16,flexShrink:0}}>👤</div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:T.fg,fontFamily:T.uf}}>Client</div>
                <div style={{fontSize:12,color:T.fgMuted,fontFamily:T.uf,marginTop:2}}>Read documentation with your account</div>
              </div>
            </button>
            <button onClick={()=>onOk("editor")}
              style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",textAlign:"left",transition:"all .12s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.ac;e.currentTarget.style.background=T.hover}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="transparent"}}>
              <div style={{width:36,height:36,borderRadius:8,background:T.acLight,display:"flex",alignItems:"center",justifyContent:"center",color:T.ac,fontSize:16,flexShrink:0}}>✎</div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:T.fg,fontFamily:T.uf}}>Editor</div>
                <div style={{fontSize:12,color:T.fgMuted,fontFamily:T.uf,marginTop:2}}>Edit and publish documentation</div>
              </div>
            </button>
          </div>
          <button onClick={onNo} style={{width:"100%",marginTop:14,padding:"8px",background:"transparent",border:"1px solid "+T.border,borderRadius:6,cursor:"pointer",fontSize:12,color:T.fgMuted,fontFamily:T.uf}}>Cancel</button>
        </>}

        <p style={{fontSize:10,color:T.fgFaint,textAlign:"center",marginTop:14,fontFamily:T.mf}}>Default: admin</p>
      </div>
    </div>
  );
}

/* MAIN */
export default function Difilex() {
  const [mode,setMode]=useState("reader");
  const [pages,setPages]=useState(DP);
  const [secs,setSecs]=useState(DS);
  const [meta,setMeta]=useState(DM);
  const [isDark,setIsDark]=useState(false);
  const [undoStack,setUndoStack]=useState([]);
  const [redoStack,setRedoStack]=useState([]);
  const [ok,setOk]=useState(false);
  const T = isDark ? DARK : LIGHT;
  T._pw = meta.pw;

  useEffect(()=>{(async()=>{
    const pub=await ldPub();if(pub){setPages(pub.pages||DP);setSecs(pub.secs||DS);setMeta(pub.meta||DM)}
    const dr=await ldDraft();if(dr){setPages(dr.pages||DP);setSecs(dr.secs||DS)}
    const dk=await ldPref("difilex-dark");if(dk!==null)setIsDark(dk);
    setOk(true);
  })()},[]);

  useEffect(()=>{if(ok&&mode==="editor"){const t=setTimeout(()=>svDraft({pages,secs}),500);return()=>clearTimeout(t)}},[pages,secs,mode,ok]);
  useEffect(()=>{if(ok)svPref("difilex-dark",isDark)},[isDark,ok]);

  const pub=async()=>{
    const version={date:new Date().toISOString(),pages:JSON.parse(JSON.stringify(pages)),secs:JSON.parse(JSON.stringify(secs))};
    const versions=[...(meta.versions||[]).slice(-19),version];
    const m={...meta,pub:new Date().toISOString(),versions};
    setMeta(m);await svPub({pages,secs,meta:m});await svDraft({pages,secs});
  };
  const handleLogin=(role)=>{setMode(role)};
  const toggleDark=()=>setIsDark(d=>!d);

  if(!ok)return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.hf,color:T.ac,background:T.bg}}>Loading…</div>;

  return <>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
    {mode==="reader"&&<Reader pages={pages} secs={secs} meta={meta} onEdit={()=>setMode("login")} role={null} onLogout={null} T={T} isDark={isDark} onToggleDark={toggleDark} />}
    {mode==="login"&&<><Reader pages={pages} secs={secs} meta={meta} onEdit={()=>{}} role={null} onLogout={null} T={T} isDark={isDark} onToggleDark={toggleDark} /><Login onOk={handleLogin} onNo={()=>setMode("reader")} T={T} /></>}
    {mode==="client"&&<Reader pages={pages} secs={secs} meta={meta} onEdit={null} role="client" onLogout={()=>setMode("reader")} T={T} isDark={isDark} onToggleDark={toggleDark} />}
    {mode==="editor"&&<Editor pages={pages} setPages={setPages} secs={secs} setSecs={setSecs} meta={meta} onPub={pub} onExit={()=>setMode("client")} T={T} isDark={isDark} onToggleDark={toggleDark} undoStack={undoStack} setUndoStack={setUndoStack} redoStack={redoStack} setRedoStack={setRedoStack} />}
  </>;
}
