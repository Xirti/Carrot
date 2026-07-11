import { describe, expect, it } from 'vitest'
import { celestialBodies, planets } from './bodies'

describe('reviewed celestial-body data', () => {
  it('contains the Sun and eight unique planets', () => {
    expect(celestialBodies).toHaveLength(9)
    expect(new Set(celestialBodies.map(body => body.id)).size).toBe(9)
  })

  it('uses NASA sidereal rotation and orbital periods', () => {
    const values = Object.fromEntries(celestialBodies.map(body => [body.id, body]))
    expect(values.mercury.rotationPeriodHours).toBe(1407.6)
    expect(values.venus.rotationPeriodHours).toBe(-5832.5)
    expect(values.earth.rotationPeriodHours).toBe(23.9345)
    expect(values.mars.rotationPeriodHours).toBe(24.6229)
    expect(values.jupiter.rotationPeriodHours).toBe(9.925)
    expect(values.saturn.rotationPeriodHours).toBe(10.656)
    expect(values.uranus.rotationPeriodHours).toBe(-17.24)
    expect(values.neptune.rotationPeriodHours).toBe(16.11)
    expect(planets.map(p => p.orbitalPeriodDays)).toEqual([87.969,224.701,365.256,686.98,4332.589,10759.22,30685.4,60189])
  })

  it('uses JPL J2000 approximate orbital elements', () => {
    const mercury=planets[0], earth=planets[2], neptune=planets[7]
    expect(mercury.semiMajorAxisAu).toBeCloseTo(.38709927,8)
    expect(mercury.ascendingNodeDeg).toBeCloseTo(48.33076593,8)
    expect(earth.inclinationDeg).toBeCloseTo(-.00001531,8)
    expect(neptune.meanLongitudeDegAtEpoch).toBeCloseTo(-55.12002969,8)
  })

  it('records provenance and separate science and mythology copy', () => {
    for(const body of celestialBodies){
      expect(body.science.length).toBeGreaterThan(30)
      expect(body.mythology.length).toBeGreaterThan(30)
      expect(body.sources.length).toBeGreaterThanOrEqual(2)
      expect(body.temperature.label.length).toBeGreaterThanOrEqual(4)
    }
  })
})
