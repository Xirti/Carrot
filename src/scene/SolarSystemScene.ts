import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { celestialBodies, planets, type Planet, type PlanetId } from '../data/bodies'
import { dateToJulianDate, orbitalPositionAtJulianDate, sampleOrbitAtEqualMeanAnomaly } from '../domain/astronomy'
import { auToSceneDistance, radiusKmToSceneRadius } from './sceneScale'
import { createPlanetTexture, createRingTexture } from './planetTextures'
import { spinDeltaRadians } from './rotation'

interface BodyVisual { body: Planet; group: THREE.Group; tiltGroup: THREE.Group; mesh: THREE.Mesh; orbit?: THREE.Line }

export class SolarSystemScene {
  readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 1800)
  private readonly controls: OrbitControls
  private readonly clock = new THREE.Clock()
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2()
  private readonly visuals = new Map<PlanetId, BodyVisual>()
  private selected: BodyVisual | null = null
  private julianDate = dateToJulianDate(new Date())
  private timeScale = 86400
  private paused = false
  private focusProgress = 1
  private focusStart = new THREE.Vector3()
  private focusDestination = new THREE.Vector3()
  private pointerDown = new THREE.Vector2()
  private pointerDragged = false
  onSelect?: (body: Planet) => void

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 2.2
    container.append(this.renderer.domElement)
    this.camera.position.set(0, 75, 112)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.055
    this.controls.minDistance = .35
    this.controls.maxDistance = 950
    this.controls.zoomSpeed = 1.35
    this.buildScene()
    addEventListener('resize', this.resize)
    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown)
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove)
    this.renderer.domElement.addEventListener('pointerup', this.pick)
    this.animate()
  }

  private buildScene() {
    this.scene.add(new THREE.HemisphereLight(0xb8ddff, 0x2d1648, 1.75))
    this.scene.add(new THREE.AmbientLight(0xd5e9ff, 1.05))
    this.scene.add(new THREE.PointLight(0xffe8bd, 6200, 430, 1.4))
    this.addStellarBackground(); this.addSolarDust()
    this.addSun(celestialBodies[0])
    planets.forEach((planet) => this.addPlanet(planet))
  }

  private addStellarBackground() {
    const createField = (count: number, minRadius: number, spread: number, color: number, size: number, opacity: number) => {
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < positions.length; i += 3) {
        const radius = minRadius + Math.random() * spread
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        positions[i] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i + 1] = radius * Math.cos(phi)
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta)
      }
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent:true, opacity, sizeAttenuation:true, depthWrite:false })))
    }
    createField(6500, 210, 520, 0xbdd8f2, .44, .82)
    createField(900, 170, 410, 0xffd3ad, .78, .72)

    // 银河带：围绕黄道倾斜的高密度、低透明星群。
    const galaxyPositions = new Float32Array(5200 * 3)
    const tilt = .55
    for (let i = 0; i < galaxyPositions.length; i += 3) {
      const longitude = Math.random() * Math.PI * 2
      const latitude = (Math.random() + Math.random() + Math.random() - 1.5) * .16
      const radius = 360 + Math.random() * 250
      const x = radius * Math.cos(latitude) * Math.cos(longitude)
      const y = radius * Math.sin(latitude)
      const z = radius * Math.cos(latitude) * Math.sin(longitude)
      galaxyPositions[i] = x
      galaxyPositions[i + 1] = y * Math.cos(tilt) - z * Math.sin(tilt)
      galaxyPositions[i + 2] = y * Math.sin(tilt) + z * Math.cos(tilt)
    }
    const galaxyGeometry = new THREE.BufferGeometry()
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3))
    this.scene.add(new THREE.Points(galaxyGeometry, new THREE.PointsMaterial({ color:0xc0d1ff, size:.95, transparent:true, opacity:.72, blending:THREE.AdditiveBlending, depthWrite:false })))
    this.addNebulaCloud(0x607ebd, new THREE.Vector3(-320, 110, -520), 240, 3.8, .2)
    this.addNebulaCloud(0xa56f91, new THREE.Vector3(360, -90, -460), 190, 4.2, .18)
    this.addNebulaCloud(0x5faaa6, new THREE.Vector3(100, 240, -620), 180, 3.5, .16)
    this.addNebulaCloud(0x806ba4, new THREE.Vector3(-105, 35, -175), 82, 2.1, .15)
    this.addNebulaCloud(0x547f92, new THREE.Vector3(125, -25, -230), 105, 2.4, .13)
  }

  private addNebulaCloud(color: number, center: THREE.Vector3, spread: number, size: number, opacity: number) {
    const positions = new Float32Array(1500 * 3)
    for (let i=0;i<positions.length;i+=3) {
      positions[i]=center.x+(Math.random()+Math.random()+Math.random()-1.5)*spread
      positions[i+1]=center.y+(Math.random()+Math.random()+Math.random()-1.5)*spread*.55
      positions[i+2]=center.z+(Math.random()+Math.random()+Math.random()-1.5)*spread*.32
    }
    const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    this.scene.add(new THREE.Points(geometry,new THREE.PointsMaterial({color,size,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true})))
  }

  private addSolarDust() {
    const n=3600,p=new Float32Array(n*3); for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,r=12+Math.pow(Math.random(),.72)*82;p[i*3]=Math.cos(a)*r;p[i*3+1]=(Math.random()+Math.random()-1)*2.8;p[i*3+2]=Math.sin(a)*r} const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));this.scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xa5ceff,size:.12,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false})))
  }

  private addSun(body: Planet) {
    const group = new THREE.Group()
    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg)
    const size = radiusKmToSceneRadius(body.radiusKm)
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 64, 48), new THREE.MeshBasicMaterial({ color:body.color, map:createPlanetTexture(body) }))
    mesh.userData.planetId = body.id
    tiltGroup.add(mesh)
    group.add(tiltGroup)
    const halo = new THREE.Mesh(new THREE.SphereGeometry(size * 1.22, 40, 32), new THREE.MeshBasicMaterial({ color:0xff9d32, transparent:true, opacity:.14, side:THREE.BackSide, depthWrite:false }))
    group.add(halo)
    this.scene.add(group)
    this.visuals.set(body.id, { body, group, tiltGroup, mesh })
  }

  private addPlanet(body: Planet) {
    const group = new THREE.Group()
    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg)
    const size = radiusKmToSceneRadius(body.radiusKm)
    const material = new THREE.MeshStandardMaterial({ color:0xffffff, map:createPlanetTexture(body), roughness:.62, metalness:.01, emissive:new THREE.Color(body.color), emissiveIntensity:.07 })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 40, 32), material)
    mesh.userData.planetId = body.id
    tiltGroup.add(mesh)
    group.add(tiltGroup)
    if (body.id === 'saturn') {
      const ringGeometry = new THREE.RingGeometry(size * 1.35, size * 2.18, 128)
      const positions = ringGeometry.attributes.position
      const uvs = ringGeometry.attributes.uv
      for (let i=0;i<positions.count;i+=1) {
        const radius=Math.hypot(positions.getX(i),positions.getY(i))
        uvs.setXY(i,(radius-size*1.35)/(size*.83),.5)
      }
      const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ map:createRingTexture(), transparent:true, opacity:.8, side:THREE.DoubleSide, depthWrite:false }))
      ring.rotation.x = Math.PI / 2
      tiltGroup.add(ring)
    }
    if (body.id === 'uranus') {
      const ring = new THREE.Mesh(new THREE.RingGeometry(size*1.55,size*2.55,96),new THREE.MeshBasicMaterial({color:0xc5e6e3,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}))
      ring.rotation.x=Math.PI/2
      tiltGroup.add(ring)
    }
    this.scene.add(group)
    const points: THREE.Vector3[] = []
    for (const p of sampleOrbitAtEqualMeanAnomaly(body, 720)) {
      const physicalRadius = Math.hypot(p.x, p.y, p.z)
      const scale = auToSceneDistance(physicalRadius) / physicalRadius
      points.push(new THREE.Vector3(p.x * scale, p.z * scale, p.y * scale))
    }
    const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineDashedMaterial({ color:body.color, dashSize:.45, gapSize:.32, transparent:true, opacity:.36 }))
    orbit.computeLineDistances()
    this.scene.add(orbit)
    this.scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(points),new THREE.PointsMaterial({color:body.color,size:.075,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})))
    this.visuals.set(body.id, { body, group, tiltGroup, mesh, orbit })
  }

  private updatePositions(delta: number) {
    if (!this.paused) this.julianDate += delta * this.timeScale / 86400
    this.visuals.forEach(({ body, group, mesh }) => {
      if (body.id !== 'sun') {
        const p = orbitalPositionAtJulianDate(body, this.julianDate)
        const radius = Math.hypot(p.x, p.y, p.z)
        const scale = auToSceneDistance(radius) / radius
        group.position.set(p.x * scale, p.z * scale, p.y * scale)
      }
      mesh.rotation.y += spinDeltaRadians(delta, body.rotationPeriodHours)
    })
  }

  private handlePointerDown = (event: PointerEvent) => { this.pointerDown.set(event.clientX, event.clientY); this.pointerDragged = false }
  private handlePointerMove = (event: PointerEvent) => { if (event.buttons === 1 && this.pointerDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 5) this.pointerDragged = true }
  private pick = (event: PointerEvent) => {
    if (this.pointerDragged || event.button !== 0) return
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hit = this.raycaster.intersectObjects([...this.visuals.values()].map(({ mesh }) => mesh), false)[0]
    if (hit) this.focus(hit.object.userData.planetId as PlanetId)
  }

  focus(id: PlanetId) {
    const visual = this.visuals.get(id)
    if (!visual) return
    if (this.selected?.orbit) (this.selected.orbit.material as THREE.LineBasicMaterial).opacity = .28
    this.selected = visual
    if (visual.orbit) (visual.orbit.material as THREE.LineBasicMaterial).opacity = .95
    this.focusStart.copy(this.camera.position)
    const direction = this.camera.position.clone().sub(this.controls.target).normalize()
    const size = radiusKmToSceneRadius(visual.body.radiusKm)
    this.focusDestination.copy(visual.group.position).add(direction.multiplyScalar(size * 3.5 + 3))
    this.focusProgress = 0
    this.onSelect?.(visual.body)
  }

  showOverview() {
    this.selected = null
    this.controls.target.set(0, 0, 0)
    this.focusStart.copy(this.camera.position)
    this.focusDestination.set(0, 75, 112)
    this.focusProgress = 0
    this.visuals.forEach(({ orbit }) => { if (orbit) (orbit.material as THREE.LineBasicMaterial).opacity = .28 })
  }

  private animate = () => {
    requestAnimationFrame(this.animate)
    const delta = Math.min(this.clock.getDelta(), .05)
    this.updatePositions(delta)
    if (this.selected) this.controls.target.lerp(this.selected.group.position, .075)
    if (this.focusProgress < 1) {
      this.focusProgress = Math.min(1, this.focusProgress + delta * 1.25)
      this.camera.position.lerpVectors(this.focusStart, this.focusDestination, 1 - Math.pow(1 - this.focusProgress, 3))
    }
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private resize = () => { this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight) }
  setPaused(paused: boolean) { this.paused = paused }
  isPaused() { return this.paused }
  setTimeScale(scale: number) { this.timeScale = scale }
  getJulianDate() { return this.julianDate }
  getBodyPosition(id: PlanetId) { const v=this.visuals.get(id); return !v||id==='sun'?{x:0,y:0,z:0}:orbitalPositionAtJulianDate(v.body,this.julianDate) }
}
