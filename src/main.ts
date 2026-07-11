import './style.css'
import { celestialBodies, type Planet } from './data/bodies'
import { SolarSystemScene } from './scene/SolarSystemScene'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <main id="space" aria-label="交互式太阳系模型"></main>
  <div class="brand"><span>ORBITAL</span> ATLAS <small>轨道星图</small></div>
  <button class="ghost top-right" id="explore" aria-label="打开行星介绍">探索行星</button>
  <section class="discovery" id="discovery" aria-live="polite">
    <button class="back" id="back">← 纯预览</button>
    <div class="planet-heading"><p id="eyebrow">BODY 04 / 09</p><h1><span id="name-en">Earth</span><em id="name-zh">地球</em></h1></div>
    <article class="info">
      <p class="description" id="description"></p>
      <dl id="facts"></dl><div class="live-position"><span>近似日心坐标 · AU</span><output id="coordinates">X 0 · Y 0 · Z 0</output></div>
      <p class="notice">位置为 J2000 开普勒两体近似 · 视觉比例经过夸张</p>
    </article>
  </section>
  <nav class="planet-nav" id="planet-nav" aria-label="选择行星"></nav>
  <div class="timebar">
    <button id="pause">暂停</button>
    <label>时间倍率 <select id="speed"><option value="86400">1 天/秒</option><option value="604800">7 天/秒</option><option value="2592000">30 天/秒</option><option value="31557600">1 年/秒</option></select></label>
    <output id="jd"></output>
  </div>
  <div class="hint">拖拽旋转 · 滚轮缩放 · 点击行星探索</div>
`

const scene = new SolarSystemScene(document.querySelector('#space')!)
const discovery = document.querySelector<HTMLElement>('#discovery')!
const nav = document.querySelector<HTMLElement>('#planet-nav')!
let selected: Planet | null = null
const savedPlanetId = localStorage.getItem('orbital-atlas:selected-planet') as Planet['id'] | null

nav.innerHTML = celestialBodies.map((p, i) => `<button data-id="${p.id}"><b>${String(i + 1).padStart(2, '0')}</b>${p.nameZh}<small>${p.name}</small></button>`).join('')

function showPlanet(planet: Planet) {
  selected = planet
  localStorage.setItem('orbital-atlas:selected-planet', planet.id)
  document.body.classList.add('is-discovery')
  document.querySelector('#name-en')!.textContent = planet.name
  document.querySelector('#name-zh')!.textContent = planet.nameZh
  document.querySelector('#eyebrow')!.textContent = `BODY ${String(celestialBodies.indexOf(planet) + 1).padStart(2, '0')} / 09`
  document.querySelector('#description')!.textContent = planet.description
  document.querySelector('#facts')!.innerHTML = `
    <div><dt>平均半径</dt><dd>${planet.radiusKm.toLocaleString()} km</dd></div>
    <div><dt>地球质量</dt><dd>${planet.massEarths} M⊕</dd></div>
    <div><dt>${planet.id === 'sun' ? '系统位置' : '距日半长轴'}</dt><dd>${planet.id === 'sun' ? '太阳系中心' : `${planet.semiMajorAxisAu.toFixed(3)} AU`}</dd></div>
    <div><dt>公转周期</dt><dd>${planet.id === 'sun' ? '—' : `${planet.orbitalPeriodDays.toLocaleString()} 天`}</dd></div>
    <div><dt>自转周期</dt><dd>${Math.abs(planet.rotationPeriodHours).toLocaleString()} 小时${planet.rotationPeriodHours < 0 ? ' · 逆行' : ''}</dd></div>
    <div><dt>轴倾角</dt><dd>${planet.axialTiltDeg}°</dd></div>
    <div><dt>温度</dt><dd>${planet.temperature}</dd></div>`
  nav.querySelectorAll('button').forEach((b) => b.classList.toggle('active', (b as HTMLElement).dataset.id === planet.id))
}

scene.onSelect = showPlanet
nav.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]')
  if (button) scene.focus(button.dataset.id as Planet['id'])
})
document.querySelector('#explore')!.addEventListener('click', () => scene.focus(selected?.id ?? savedPlanetId ?? 'earth'))
document.querySelector('#back')!.addEventListener('click', () => { document.body.classList.remove('is-discovery'); scene.showOverview() })
document.querySelector('#pause')!.addEventListener('click', (event) => {
  scene.setPaused(!scene.isPaused())
  ;(event.currentTarget as HTMLButtonElement).textContent = scene.isPaused() ? '继续' : '暂停'
})
document.querySelector<HTMLSelectElement>('#speed')!.addEventListener('change', (event) => scene.setTimeScale(Number((event.target as HTMLSelectElement).value)))
addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { document.body.classList.remove('is-discovery'); scene.showOverview() }
  if (event.code === 'Space' && event.target === document.body) { event.preventDefault(); (document.querySelector('#pause') as HTMLButtonElement).click() }
})
setInterval(() => {
  document.querySelector('#jd')!.textContent = `JD ${scene.getJulianDate().toFixed(2)}`
  if (selected) {
    const position = scene.getBodyPosition(selected.id)
    document.querySelector('#coordinates')!.textContent = `X ${position.x.toFixed(4)} · Y ${position.y.toFixed(4)} · Z ${position.z.toFixed(4)}`
  }
}, 250)
void discovery
