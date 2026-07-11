import * as THREE from 'three'
import type { Planet, PlanetId } from '../data/bodies'

const palettes: Record<PlanetId,[string,string,string]>={sun:['#ff6a0b','#ffc44f','#fff4bb'],mercury:['#121d4f','#52568d','#d7a64f'],venus:['#aaa69d','#e7ddc8','#fffdf5'],earth:['#061c48','#1767ad','#648b45'],mars:['#36262a','#a84729','#df7d4d'],jupiter:['#4e5b68','#b08060','#f1e6ce'],saturn:['#617580','#d4c187','#f5e8bd'],uranus:['#126d87','#4dc6d1','#c8ffff'],neptune:['#102462','#1747a9','#58a6ef']}
function hash(x:number,y:number,seed:number){const v=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return v-Math.floor(v)}
const rgba=(hex:string,alpha:number)=>`${hex}${Math.round(alpha*255).toString(16).padStart(2,'0')}`

export function createPlanetTexture(body:Planet):THREE.CanvasTexture{
 const w=1024,h=512,c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;const[d,m,l]=palettes[body.id]
 const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,d);g.addColorStop(.5,m);g.addColorStop(1,d);ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
 if(body.id==='venus'){
  for(let y=0;y<h;y+=6){const wave=Math.sin(y*.035)*26+Math.sin(y*.011)*40;ctx.fillStyle=y%29<14?'#fffdf27a':'#c9ae8350';ctx.fillRect(wave,y,w,5+hash(y,3,8)*12)}
 }else if(['jupiter','saturn','uranus','neptune'].includes(body.id)){
  for(let y=0;y<h;y+=4){const wave=Math.sin(y*.055)*12+Math.sin(y*.013)*22,alpha=.12+hash(0,y,body.radiusKm)*.28;ctx.fillStyle=y%21<9?rgba(l,alpha):rgba(d,.28);ctx.fillRect(0,y+wave,w,4+hash(2,y,7)*10)}
  if(body.id==='jupiter'){ctx.fillStyle='#9b422e';ctx.beginPath();ctx.ellipse(710,318,88,38,-.12,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e2a184bb';ctx.lineWidth=11;ctx.stroke();for(let i=0;i<5;i++){ctx.strokeStyle=rgba(i%2?'#dbe6ee':'#65443a',.18);ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(hash(i,1,3)*w,110+hash(i,2,4)*300,25+hash(i,3,5)*30,7+hash(i,4,6)*10,0,0,Math.PI*2);ctx.stroke()}}
  if(body.id==='neptune'){ctx.fillStyle='#bcecffbb';for(let i=0;i<12;i++){ctx.beginPath();ctx.ellipse(hash(i,1,2)*w,hash(i,3,4)*h,18+hash(i,4,2)*45,3+hash(i,5,2)*10,0,0,Math.PI*2);ctx.fill()}}
 }else{
  for(let i=0;i<600;i++){const x=hash(i,2,body.radiusKm)*w,y=hash(i,7,body.massEarths)*h,r=2+hash(i,11,body.axialTiltDeg)*(body.id==='earth'?30:19);ctx.fillStyle=rgba(hash(i,3,9)>.55?l:d,.1+hash(i,5,3)*.3);ctx.beginPath();ctx.ellipse(x,y,r*2.6,r,hash(i,8,1)*Math.PI,0,Math.PI*2);ctx.fill()}
  if(body.id==='mercury')for(let i=0;i<190;i++){const x=hash(i,21,5)*w,y=hash(i,22,8)*h,r=3+hash(i,23,9)*16;ctx.strokeStyle=i%5===0?'#edc352aa':'#080f2baa';ctx.lineWidth=2+hash(i,4,2)*4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}
  if(body.id==='earth'){ctx.fillStyle='#f8fbffaa';for(let i=0;i<100;i++){ctx.beginPath();ctx.ellipse(hash(i,31,2)*w,hash(i,32,4)*h,18+hash(i,2,1)*58,3+hash(i,7,5)*10,hash(i,5,2)*.5,0,Math.PI*2);ctx.fill()}}
 }
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;texture.wrapS=THREE.RepeatWrapping;return texture
}
export function createRingTexture(){const c=document.createElement('canvas');c.width=1024;c.height=32;const x=c.getContext('2d')!,g=x.createLinearGradient(0,0,1024,0);g.addColorStop(0,'#6f655000');g.addColorStop(.08,'#b5a685bb');g.addColorStop(.28,'#eee3cddd');g.addColorStop(.34,'#30291c33');g.addColorStop(.39,'#17130c08');g.addColorStop(.46,'#dccdadbb');g.addColorStop(.72,'#9b8c6aaa');g.addColorStop(1,'#534a3800');x.fillStyle=g;x.fillRect(0,0,1024,32);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
