import type { OrbitalElements } from '../domain/astronomy'

export type PlanetId = 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'

export interface Planet extends OrbitalElements {
  id: PlanetId
  name: string
  nameZh: string
  radiusKm: number
  massEarths: number
  rotationPeriodHours: number
  axialTiltDeg: number
  temperature: string
  color: number
  size: number
  description: string
}

export const sun: Planet = { id:'sun', name:'Sun', nameZh:'太阳', radiusKm:696340, massEarths:332946, rotationPeriodHours:609.12, axialTiltDeg:7.25, temperature:'光球约 5,500 °C', color:0xffc45c, size:0, description:'太阳系中心的恒星，包含整个太阳系约 99.86% 的质量。', semiMajorAxisAu:0, eccentricity:0, inclinationDeg:0, ascendingNodeDeg:0, longitudeOfPerihelionDeg:0, meanLongitudeDegAtEpoch:0, orbitalPeriodDays:1 }

export const planets: Planet[] = [
  { id:'mercury', name:'Mercury', nameZh:'水星', radiusKm:2439.7, massEarths:0.0553, rotationPeriodHours:1407.6, axialTiltDeg:0.03, temperature:'−180—430 °C', color:0x9b938b, size:0.65, description:'离太阳最近、昼夜温差极大的岩石行星。', semiMajorAxisAu:0.387099, eccentricity:0.205636, inclinationDeg:7.005, ascendingNodeDeg:48.339, longitudeOfPerihelionDeg:77.457, meanLongitudeDegAtEpoch:252.251, orbitalPeriodDays:87.969 },
  { id:'venus', name:'Venus', nameZh:'金星', radiusKm:6051.8, massEarths:0.815, rotationPeriodHours:-5832.5, axialTiltDeg:177.4, temperature:'约 465 °C', color:0xd6aa6d, size:0.95, description:'被浓厚二氧化碳大气包裹的逆向自转世界。', semiMajorAxisAu:0.723336, eccentricity:0.00678, inclinationDeg:3.3947, ascendingNodeDeg:76.68, longitudeOfPerihelionDeg:131.602, meanLongitudeDegAtEpoch:181.98, orbitalPeriodDays:224.701 },
  { id:'earth', name:'Earth', nameZh:'地球', radiusKm:6371, massEarths:1, rotationPeriodHours:23.934, axialTiltDeg:23.44, temperature:'−89—58 °C', color:0x3d78c5, size:1, description:'拥有液态海洋与已知生命的蓝色行星。', semiMajorAxisAu:1.000003, eccentricity:0.016711, inclinationDeg:0.0001, ascendingNodeDeg:-11.261, longitudeOfPerihelionDeg:102.938, meanLongitudeDegAtEpoch:100.464, orbitalPeriodDays:365.256 },
  { id:'mars', name:'Mars', nameZh:'火星', radiusKm:3389.5, massEarths:0.107, rotationPeriodHours:24.623, axialTiltDeg:25.19, temperature:'−125—20 °C', color:0xb65336, size:0.78, description:'遍布氧化铁尘埃、拥有太阳系最大火山的红色行星。', semiMajorAxisAu:1.52371, eccentricity:0.093394, inclinationDeg:1.85, ascendingNodeDeg:49.559, longitudeOfPerihelionDeg:336.057, meanLongitudeDegAtEpoch:355.453, orbitalPeriodDays:686.98 },
  { id:'jupiter', name:'Jupiter', nameZh:'木星', radiusKm:69911, massEarths:317.8, rotationPeriodHours:9.925, axialTiltDeg:3.13, temperature:'约 −110 °C', color:0xc49a72, size:2.25, description:'太阳系最大的气态巨行星，大红斑是一场持久风暴。', semiMajorAxisAu:5.202887, eccentricity:0.048386, inclinationDeg:1.304, ascendingNodeDeg:100.474, longitudeOfPerihelionDeg:14.728, meanLongitudeDegAtEpoch:34.397, orbitalPeriodDays:4332.59 },
  { id:'saturn', name:'Saturn', nameZh:'土星', radiusKm:58232, massEarths:95.16, rotationPeriodHours:10.656, axialTiltDeg:26.73, temperature:'约 −140 °C', color:0xd5bd82, size:1.95, description:'由无数冰与岩石颗粒构成的行星环最为醒目。', semiMajorAxisAu:9.536676, eccentricity:0.053862, inclinationDeg:2.486, ascendingNodeDeg:113.662, longitudeOfPerihelionDeg:92.599, meanLongitudeDegAtEpoch:50.077, orbitalPeriodDays:10759.22 },
  { id:'uranus', name:'Uranus', nameZh:'天王星', radiusKm:25362, massEarths:14.54, rotationPeriodHours:-17.24, axialTiltDeg:97.77, temperature:'约 −195 °C', color:0x86d8df, size:1.42, description:'几乎侧躺着逆向自转的冰巨行星。', semiMajorAxisAu:19.189165, eccentricity:0.047257, inclinationDeg:0.772, ascendingNodeDeg:74.017, longitudeOfPerihelionDeg:170.954, meanLongitudeDegAtEpoch:314.055, orbitalPeriodDays:30688.5 },
  { id:'neptune', name:'Neptune', nameZh:'海王星', radiusKm:24622, massEarths:17.15, rotationPeriodHours:16.11, axialTiltDeg:28.32, temperature:'约 −200 °C', color:0x315dc6, size:1.38, description:'遥远、深蓝，并拥有太阳系中最快的行星风。', semiMajorAxisAu:30.069923, eccentricity:0.00859, inclinationDeg:1.77, ascendingNodeDeg:131.784, longitudeOfPerihelionDeg:44.964, meanLongitudeDegAtEpoch:304.348, orbitalPeriodDays:60182 },
]

export const celestialBodies: Planet[] = [sun, ...planets]
