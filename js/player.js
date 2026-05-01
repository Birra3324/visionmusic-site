const FALLBACK_TRACKS=[
{id:"markato",title:"Markato",artist:"Ali Birra",cover:"assets/covers/ali-birra.jpg",audio:"assets/audio/markato.mp3",tab:"Popular"},
{id:"hirphaa",title:"Hirphaa",artist:"Hirphaa Gaanfuree",cover:"assets/covers/default.png",audio:"assets/audio/hirphaa.mp3",tab:"Popular"},
{id:"yosan",title:"3Obsaa",artist:"Yosan Getahun",cover:"assets/covers/yosan-getahun.jpg",audio:"assets/audio/yosan_getahun.mp3",tab:"Recently"},
{id:"lagaa",title:"Lagaa",artist:"Davo",cover:"assets/covers/davo.jpg",audio:"assets/audio/lagaa.mp3",tab:"Trending"},
{id:"shagoye",title:"Marartuu",artist:"Shukri Jamal",cover:"assets/covers/shukri-jamal.jpg",audio:"assets/audio/shagoye.mp3",tab:"Similar"},
{id:"kuyubisaa",title:"Kuyubisaa",artist:"Asanti",cover:"assets/covers/asanti.jpg",audio:"assets/audio/kuyubisaa.mp3",tab:"Trending"},
{id:"alibiyyanqabaa",title:"Alibiyyanqabaa",artist:"Naaima Abdurahman",cover:"assets/covers/naaima-abdurahman.jpg",audio:"assets/audio/alibiyyanqabaa.mp3",tab:"Recently"},
{id:"gumgume",title:"Gumgume",artist:"Andualem Gosa",cover:"assets/covers/andualem-gosa.jpg",audio:"assets/audio/gungume.mp3",tab:"Popular"},
{id:"daraara",title:"Daraara Laga",artist:"Ali Birra",cover:"assets/covers/ali-birra.jpg",audio:"assets/audio/daraara-lagaa.mp3",tab:"Similar"}
];

let TRACKS=[...FALLBACK_TRACKS];
let currentIndex=0,isPlaying=false,isShuffle=false,repeatMode=0,queue=[...TRACKS],activeTab="All";
const audio=new Audio();
audio.preload="metadata";

const $=id=>document.getElementById(id);

function fmt(s){
  if(isNaN(s))return"0:00";
  const m=Math.floor(s/60);
  const sec=Math.floor(s%60);
  return`${m}:${sec.toString().padStart(2,"0")}`;
}

function loadTrack(i){
  if(i<0||i>=queue.length)return;
  currentIndex=i;
  const t=queue[i];
  audio.src=t.audio;
  $("pcover").src=t.cover;
  $("ptitle").textContent=t.title;
  $("partist").textContent=t.artist;
  document.title=`${t.title} · ${t.artist} — Vision Music`;
  updateQueue();
}

function playTrack(i){
  console.log('playTrack called:',i);
  loadTrack(i);
  const playPromise=audio.play();
  if(playPromise!==undefined){
    playPromise.then(()=>{
      isPlaying=true;
      updatePlayBtn();
      console.log('Audio playing successfully');
    }).catch(err=>{
      console.error('Play error:',err);
      toast("Tap to play audio");
      isPlaying=false;
      updatePlayBtn();
    });
  }
}

function togglePlay(){
  console.log('togglePlay called, isPlaying:',isPlaying,'src:',audio.src);
  if(!audio.src){
    loadTrack(0);
  }
  if(isPlaying){
    audio.pause();
    isPlaying=false;
    updatePlayBtn();
  }else{
    const playPromise=audio.play();
    if(playPromise!==undefined){
      playPromise.then(()=>{
        isPlaying=true;
        updatePlayBtn();
        console.log('Audio playing successfully');
      }).catch(err=>{
        console.error('Toggle play error:',err);
        toast("Tap to play audio");
        isPlaying=false;
        updatePlayBtn();
      });
    }
  }
}

function updatePlayBtn(){
  $("playBtn").innerHTML=isPlaying
    ?'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
    :'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}

function nextTrack(){
  if(isShuffle)currentIndex=Math.floor(Math.random()*queue.length);
  else currentIndex=(currentIndex+1)%queue.length;
  playTrack(currentIndex);
}

function prevTrack(){
  if(audio.currentTime>3){audio.currentTime=0;return;}
  currentIndex=(currentIndex-1+queue.length)%queue.length;
  playTrack(currentIndex);
}

function toggleShuffle(){
  isShuffle=!isShuffle;
  $("shuffleBtn").classList.toggle("active",isShuffle);
}

function cycleRepeat(){
  repeatMode=(repeatMode+1)%3;
  $("repeatBtn").innerHTML=repeatMode===2?'<span>↻₁</span>':'<span>↻</span>';
  $("repeatBtn").classList.toggle("active",repeatMode!==0);
}

function updateProgress(){
  if(!audio.duration)return;
  $("pbar2").style.width=(audio.currentTime/audio.duration*100)+"%";
  $("ctime").textContent=fmt(audio.currentTime);
  $("tdur").textContent=fmt(audio.duration);
}

function seek(e){
  const r=$("pcont").getBoundingClientRect();
  audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
}

function setVolume(v){audio.volume=v;}

function toggleQueue(){
  $("qpanel").classList.toggle("open");
  renderQueue();
}

function renderQueue(){
  $("qlist").innerHTML=queue.map((t,i)=>
    `<div class="qi ${i===currentIndex?'qa':''}" data-i="${i}">
      <img src="${t.cover}" class="qthumb">
      <div class="qinfo">
        <div class="qt">${t.title}</div>
        <div class="qa2">${t.artist}</div>
      </div>
      ${i===currentIndex?'<span class="qp">▶</span>':''}
    </div>`
  ).join("");
  document.querySelectorAll(".qi").forEach(el=>{
    el.addEventListener("click",()=>playTrack(parseInt(el.dataset.i)));
  });
}

function updateQueue(){renderQueue();}

function renderTracks(){
  const f=activeTab==="All"?TRACKS:TRACKS.filter(t=>t.tab===activeTab);
  $("tgrid").innerHTML=f.map((t,i)=>`
    <article class="tc" data-i="${TRACKS.indexOf(t)}">
      <div class="tcw">
        <img src="${t.cover}" alt="${t.title}" class="tcov">
        <button class="tpb" data-i="${TRACKS.indexOf(t)}" aria-label="Play ${t.title}">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <h3 class="tt">${t.title}</h3>
      <p class="ta">${t.artist}</p>
    </article>`
  ).join("");
  
  // Add click handlers to play buttons only (not the whole card)
  document.querySelectorAll(".tpb").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.stopPropagation();
      playTrack(parseInt(btn.dataset.i));
    });
  });
}

function setTab(n){
  activeTab=n;
  document.querySelectorAll(".tb").forEach(b=>b.classList.toggle("tba",b.dataset.tab===n));
  renderTracks();
}

function toast(m){
  const t=document.createElement("div");
  t.className="toast";
  t.textContent=m;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

// Event listeners
$("playBtn").addEventListener("click",togglePlay);
$("prevBtn").addEventListener("click",prevTrack);
$("nextBtn").addEventListener("click",nextTrack);
$("shuffleBtn").addEventListener("click",toggleShuffle);
$("repeatBtn").addEventListener("click",cycleRepeat);
$("qbtn").addEventListener("click",toggleQueue);
$("cq").addEventListener("click",toggleQueue);
$("pcont").addEventListener("click",seek);
$("vol").addEventListener("input",e=>setVolume(e.target.value));

audio.addEventListener("timeupdate",updateProgress);
audio.addEventListener("ended",()=>{
  if(repeatMode===2){audio.currentTime=0;audio.play();}
  else nextTrack();
});
audio.addEventListener("loadedmetadata",updateProgress);
audio.addEventListener("error",(e)=>{
  console.error('Audio error:',e);
  toast("Error loading audio");
});

document.querySelectorAll(".tb").forEach(b=>{
  b.addEventListener("click",()=>setTab(b.dataset.tab));
});

document.addEventListener("keydown",e=>{
  if(e.code==="Space"&&e.target.tagName!=="INPUT"){
    e.preventDefault();
    togglePlay();
  }
  if(e.code==="ArrowRight"&&e.ctrlKey)nextTrack();
  if(e.code==="ArrowLeft"&&e.ctrlKey)prevTrack();
});

// Load tracks from JSON if available
async function loadTracks(){
  try{
    const r=await fetch('data/songs.json');
    if(!r.ok)throw new Error('HTTP '+r.status);
    const data=await r.json();
    if(Array.isArray(data)&&data.length>0){
      TRACKS=data;
      queue=[...TRACKS];
      console.log('Loaded tracks from JSON:',TRACKS.length);
    }
  }catch(e){
    console.warn('Using fallback tracks:',e.message);
  }
}

// Initialize
loadTracks().then(()=>{
  renderTracks();
  loadTrack(0);
  updatePlayBtn();
  console.log('Player initialized');
});
