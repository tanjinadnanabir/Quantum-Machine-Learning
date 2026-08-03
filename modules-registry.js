/* ============================================================
   QML Curriculum — Shared Module Registry
   Single source of truth for every page on this site.
   To publish a new module tutorial: add its file + stateKey +
   chapters here. The landing page, progress hub, and every
   tutorial's prev/next nav pick it up automatically.
   ============================================================ */

const QML_MODULES = [
  {id:1,  level:'Beginner',     title:'Introduction to Artificial Intelligence',                file:'module1-tutorial.html', stateKey:'qml_module1_state', chapters:0},
  {id:2,  level:'Beginner',     title:'Why Machine Learning?',                                  file:'module2-tutorial.html', stateKey:'qml_module1_state', chapters:1},
  {id:3,  level:'Beginner',     title:'Classical Machine Learning',                             file:'module3-tutorial.html', stateKey:'qml_module1_state', chapters:2},
  {id:4,  level:'Beginner',     title:'Why Quantum Computing?',                                 file:'module4-tutorial.html', stateKey:'qml_module1_state', chapters:3},
  {id:5,  level:'Beginner',     title:'Quantum Computing Foundations',                          file:'module5-tutorial.html', stateKey:'qml_module1_state', chapters:4},
  {id:6,  level:'Intermediate', title:'Intersection Between ML and Quantum Computing',          file:'module6-tutorial.html', stateKey:'qml_module6_state', chapters:5},
  {id:7,  level:'Intermediate', title:'Why Quantum Machine Learning?',                          file:'module7-tutorial.html', stateKey:'qml_module7_state', chapters:6},
  {id:8,  level:'Intermediate', title:'Quantum Data Encoding',                                  file:'module8-tutorial.html', stateKey:'qml_module8_state', chapters:7},
  {id:9,  level:'Intermediate', title:'Variational Quantum Circuits & Core QML Algorithms',     file:'module9-tutorial.html', stateKey:'qml_module9_state', chapters:8},
  {id:10, level:'Advanced',     title:'Real-World QML Applications',                            file:'module10-tutorial.html', stateKey:'qml_module10_state', chapters:9},
  {id:11, level:'Advanced',     title:'Advanced Quantum Machine Learning',                      file:'module11-tutorial.html', stateKey:'qml_module11_state', chapters:10},
  {id:12, level:'Advanced',     title:'Research & Capstone Project',                            file:'module12-tutorial.html', stateKey:'qml_module12_state', chapters:11},
];

/* ---- shared helpers, used by landing page, tutorials, and the progress hub ---- */

function qmlReadState(key){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

function qmlAnalyzeModule(mod){
  if(!mod.file){
    return Object.assign({}, mod, {
      available:false, started:false, xp:0, mastered:0, attempted:0,
      finalDone:false, perfect:false, chapters: mod.chapters || 0
    });
  }
  const state = qmlReadState(mod.stateKey);
  if(!state){
    return Object.assign({}, mod, {
      available:true, started:false, xp:0, mastered:0, attempted:0,
      finalDone:false, perfect:false
    });
  }
  const chapterKeys = Object.keys(state.chapters || {});
  let mastered = 0, attempted = 0, hadAnyMiss = false;
  chapterKeys.forEach(k=>{
    const c = state.chapters[k];
    if(c.done){
      attempted++;
      if(c.hadMiss){ hadAnyMiss = true; } else { mastered++; }
    }
  });
  const perfect = !!state.finalDone && mastered === mod.chapters && !hadAnyMiss;
  return Object.assign({}, mod, {
    available:true, started: attempted > 0 || (state.xp || 0) > 0,
    xp: state.xp || 0, mastered, attempted, finalDone: !!state.finalDone, perfect
  });
}

function qmlGetAnalyzedModules(){
  return QML_MODULES.map(qmlAnalyzeModule);
}

function qmlGetModuleById(id){
  return QML_MODULES.find(m=>m.id===id) || null;
}

/* Returns {prev, next} raw registry entries (not analyzed) relative to a module id.
   Skips nothing — prev/next always point to the numerically adjacent module,
   even if that module isn't published yet (the caller decides how to render that). */
function qmlGetAdjacentModules(currentId){
  const prev = QML_MODULES.find(m=>m.id === currentId-1) || null;
  const next = QML_MODULES.find(m=>m.id === currentId+1) || null;
  return {prev, next};
}
