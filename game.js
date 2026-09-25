const c=document.getElementById("game"),ctx=c.getContext("2d");
let W,H,dpr,grid=24,cols,rows,cell,snake,dir,nextDir,food,score,best=+localStorage.getItem("deetzzSnakeBest")||0,running=false,timer,lastTime=0,speed;
const $=id=>document.getElementById(id);

function resize(){
 dpr=devicePixelRatio;W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+"px";c.style.height=H+"px";
 ctx.setTransform(dpr,0,0,dpr,0,0);
 cell=Math.max(16,Math.min(28,Math.floor(Math.min(W,H-115)/24)));
 cols=Math.floor(W/cell);rows=Math.floor((H-75)/cell);
 draw();
}
addEventListener("resize",resize);

function reset(){
 snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)},{x:Math.floor(cols/2)-1,y:Math.floor(rows/2)},{x:Math.floor(cols/2)-2,y:Math.floor(rows/2)}];
 dir={x:1,y:0};nextDir={x:1,y:0};score=0;speed=145;placeFood();updateHud();
}
function placeFood(){
 do{food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}
 while(snake.some(s=>s.x===food.x&&s.y===food.y));
}
function start(){
 reset();running=true;hide();lastTime=performance.now();timer=0;requestAnimationFrame(loop);
}
function hide(){["menu","howScreen","gameOver"].forEach(id=>$(id).classList.add("hidden"))}
function end(){
 running=false;best=Math.max(best,score);localStorage.setItem("deetzzSnakeBest",best);
 $("finalScore").textContent=score;$("finalBest").textContent=best;$("gameOver").classList.remove("hidden");
}
function updateHud(){$("score").textContent=score;$("best").textContent=best}
function setDir(x,y){
 if(x===-dir.x&&y===-dir.y)return;
 nextDir={x,y};
}
function step(){
 dir=nextDir;
 const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
 if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some((s,i)=>i>0&&s.x===head.x&&s.y===head.y)){end();return}
 snake.unshift(head);
 if(head.x===food.x&&head.y===food.y){
   score+=10;speed=Math.max(65,speed-2);placeFood();showToast("+10 ⭐");updateHud();
 }else snake.pop();
}
function loop(now){
 if(!running)return;
 timer+=now-lastTime;lastTime=now;
 if(timer>=speed){timer=0;step()}
 draw();requestAnimationFrame(loop);
}
function draw(){
 ctx.clearRect(0,0,W,H);
 const top=58,bottom=92;
 let g=ctx.createLinearGradient(0,top,0,H);g.addColorStop(0,"#102b32");g.addColorStop(1,"#07141e");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle="#ffffff08";ctx.lineWidth=1;
 for(let x=0;x<=cols;x++){ctx.beginPath();ctx.moveTo(x*cell,top);ctx.lineTo(x*cell,H-bottom);ctx.stroke()}
 for(let y=0;y<=rows;y++){ctx.beginPath();ctx.moveTo(0,top+y*cell);ctx.lineTo(W,top+y*cell);ctx.stroke()}
 // food
 if(food){
   const fx=food.x*cell+cell/2,fy=top+food.y*cell+cell/2;
   ctx.fillStyle="#ff5a5f";ctx.beginPath();ctx.arc(fx,fy,cell*.34,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#69d36f";ctx.beginPath();ctx.ellipse(fx+4,fy-cell*.35,5,3,-.4,0,Math.PI*2);ctx.fill();
 }
 snake.forEach((s,i)=>{
   const x=s.x*cell+2,y=top+s.y*cell+2,r=cell-4;
   ctx.fillStyle=i===0?"#7df28b":"#37c96b";
   roundRect(x,y,r,r,Math.min(7,r*.22));ctx.fill();
   if(i===0){
     ctx.fillStyle="#12301d";ctx.beginPath();ctx.arc(x+r*.32,y+r*.34,2.3,0,Math.PI*2);ctx.arc(x+r*.68,y+r*.34,2.3,0,Math.PI*2);ctx.fill();
   }
 });
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function showToast(t){const e=$("toast");e.textContent=t;e.style.opacity=1;clearTimeout(showToast.t);showToast.t=setTimeout(()=>e.style.opacity=0,500)}

addEventListener("keydown",e=>{
 if(e.key==="ArrowUp"||e.key==="w")setDir(0,-1);
 if(e.key==="ArrowDown"||e.key==="s")setDir(0,1);
 if(e.key==="ArrowLeft"||e.key==="a")setDir(-1,0);
 if(e.key==="ArrowRight"||e.key==="d")setDir(1,0);
});
document.querySelectorAll("#touch button").forEach(b=>b.addEventListener("pointerdown",e=>{
 e.preventDefault();const d=b.dataset.dir;
 if(d==="up")setDir(0,-1);if(d==="down")setDir(0,1);if(d==="left")setDir(-1,0);if(d==="right")setDir(1,0);
}));
$("play").onclick=start;$("again").onclick=start;
$("how").onclick=()=>{$("menu").classList.add("hidden");$("howScreen").classList.remove("hidden")};
$("back").onclick=()=>{$("howScreen").classList.add("hidden");$("menu").classList.remove("hidden")};
$("home").onclick=()=>{$("gameOver").classList.add("hidden");$("menu").classList.remove("hidden")};
resize();reset();
