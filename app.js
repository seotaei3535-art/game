"use strict";
const game=Game2048;
const STORAGE="chance-2048-v1";
const $=id=>document.getElementById(id);
let state=game.newGame();
let winPrompt=false;
let storageOK=true;
let lastMove=0;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({version:1,state}));}catch{storageOK=false;}$("save-state").textContent=storageOK?"자동 저장":"저장 불가 · 이 창에서만 플레이";}
try{const stored=JSON.parse(localStorage.getItem(STORAGE));if(stored?.version===1&&game.isValid(stored.state)){state={...stored.state,paused:!stored.state.over,over:!game.canMove(stored.state.board)};}}catch{storageOK=false;}
function announce(text){$("status").textContent=text;}
function render(fresh=null,moved=false){
 $("score").textContent=state.score.toLocaleString("ko-KR");$("best").textContent=state.best.toLocaleString("ko-KR");$("coupons").textContent=state.coupons.toLocaleString("ko-KR");
 $("record-progress").textContent=state.rewarded?"이번 게임 최고기록 달성 · 쿠폰 5장 지급 완료":state.runBest>0?"목표 "+(state.runBest+1).toLocaleString("ko-KR")+"점 · 첫 갱신 시 쿠폰 +5":"최고기록 첫 갱신 시 쿠폰 +5";
 const board=$("board");board.innerHTML="";
 state.board.forEach((row,r)=>row.forEach((value,c)=>{const tile=document.createElement("div");tile.className="tile"+(value>2048?" high":"")+(fresh?.[0]===r&&fresh?.[1]===c?" fresh":"");tile.dataset.value=value;tile.textContent=value||"";tile.setAttribute("aria-label",(r+1)+"행 "+(c+1)+"열 "+(value||"빈칸"));board.append(tile);}));
 board.classList.toggle("moved",moved);
 $("pause").textContent=state.paused?"계속하기":"일시정지";$("pause").disabled=state.over||winPrompt;
 $("chance").disabled=state.coupons<1||state.paused||winPrompt;$("chance").textContent=state.coupons>0?"쿠폰 1장 사용":"최고기록을 깨고 받기";
 document.querySelectorAll("[data-direction]").forEach(b=>b.disabled=state.paused||state.over||winPrompt);
 const overlay=$("overlay");overlay.hidden=!(state.paused||state.over||winPrompt);
 if(winPrompt){$("overlay-label").textContent="YOU MADE IT";$("overlay-title").textContent="2048 달성!";$("overlay-desc").textContent="멋진 한 수였어요. 더 큰 숫자에 도전해볼까요?";$("resume").textContent="계속 도전";$("resume").hidden=false;}
 else if(state.over){$("overlay-label").textContent="ONE MORE CHANCE";$("overlay-title").textContent="더 움직일 곳이 없어요.";$("overlay-desc").textContent=state.coupons>0?"쿠폰을 사용하면 "+state.score.toLocaleString("ko-KR")+"점을 유지하며 다시 이어갈 수 있어요.":"새 게임에서 다시 도전하세요. 최고기록은 저장돼요.";$("resume").textContent=state.coupons>0?"쿠폰으로 다시 도전":"새 게임";$("resume").hidden=false;}
 else if(state.paused){$("overlay-label").textContent="TAKE A BREAK";$("overlay-title").textContent="잠깐 쉬어가세요.";$("overlay-desc").textContent="점수와 쿠폰은 저장됐어요. 준비되면 다시 시작하세요.";$("resume").textContent="계속하기";$("resume").hidden=false;}
 save();
}
function move(direction){if(winPrompt||$("new-dialog").open||state.paused||state.over)return;const now=Date.now();if(now-lastMove<85)return;lastMove=now;const result=game.move(state,direction);if(!result.changed){announce("이 방향으로는 움직일 수 없어요.");return;}state=result.state;winPrompt=result.wonNow;render(result.fresh,true);if(result.reward)announce("최고기록 갱신! 찬스 쿠폰 5장을 받았어요.");else if(state.over)announce(state.coupons>0?"이동할 수 없어요. 쿠폰으로 다시 도전해보세요.":"게임 종료. 새 게임으로 다시 도전해보세요.");else if(result.wonNow)announce("2048 달성! 계속 도전할 수 있어요.");else announce(result.state.score?"현재 "+state.score.toLocaleString("ko-KR")+"점. 다음 한 수를 골라보세요.":"같은 숫자를 합쳐보세요.");}
function pause(){if(state.over||winPrompt||$("new-dialog").open)return;state.paused=!state.paused;render();announce(state.paused?"일시정지했어요. 진행 상황을 저장했습니다.":"다시 시작합니다.");}
function coupon(){const next=game.useCoupon(state);if(next===state||winPrompt)return;state=next;render();announce("쿠폰 1장 사용. "+state.score.toLocaleString("ko-KR")+"점은 그대로, 보드를 새로 시작합니다.");$("board").focus({preventScroll:true});}
$("pause").addEventListener("click",pause);$("chance").addEventListener("click",coupon);
$("resume").addEventListener("click",()=>{if(winPrompt){winPrompt=false;render();}else if(state.over){if(state.coupons>0)coupon();else askNew();}else{state.paused=false;render();announce("이어서 플레이합니다.");}$("board").focus({preventScroll:true});});
function askNew(){$("new-dialog").returnValue="cancel";$("new-dialog").showModal();}
$("new-game").addEventListener("click",askNew);
$("new-dialog").addEventListener("close",()=>{if($("new-dialog").returnValue==="start"){state=game.newGame(state.best,state.coupons);winPrompt=false;render();announce("새 게임 시작! 최고기록과 쿠폰은 유지됩니다.");$("board").focus({preventScroll:true});}});
const keyMap={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"left",d:"right",w:"up",s:"down"};
document.addEventListener("keydown",event=>{if(event.ctrlKey||event.metaKey||event.altKey||$("new-dialog").open||["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName))return;const key=event.key.length===1?event.key.toLowerCase():event.key;if(keyMap[key]){event.preventDefault();move(keyMap[key]);}else if(event.code==="Space"&&event.target.tagName!=="BUTTON"&&event.target.tagName!=="SUMMARY"){event.preventDefault();if(!event.repeat)pause();}});
document.querySelectorAll("[data-direction]").forEach(b=>b.addEventListener("click",()=>move(b.dataset.direction)));
let pointer=null;
$("board").addEventListener("pointerdown",e=>{if(e.isPrimary&&e.button===0){pointer={x:e.clientX,y:e.clientY,id:e.pointerId};$("board").setPointerCapture(e.pointerId);}});
$("board").addEventListener("pointerup",e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.max(Math.abs(dx),Math.abs(dy))<25)return;move(Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up"));});
$("board").addEventListener("pointercancel",()=>pointer=null);
document.addEventListener("visibilitychange",()=>{if(document.hidden&&!state.over&&!state.paused){state.paused=true;winPrompt=false;render();}});
window.addEventListener("pagehide",save);
render();
if(state.paused)announce("저장된 게임을 불러왔어요. 계속하기를 누르세요.");