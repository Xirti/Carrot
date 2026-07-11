import { describe, expect, it } from 'vitest'
import { dateToJulianDate, orbitalPositionAtJulianDate, sampleOrbitAtEqualMeanAnomaly, solveKepler } from './astronomy'

describe('astronomy', () => {
  it('converts the J2000 epoch to Julian date 2451545.0', () => expect(dateToJulianDate(new Date('2000-01-01T12:00:00Z'))).toBe(2451545))
  it('solves a circular Kepler orbit as E equals M', () => expect(solveKepler(1.234, 0)).toBeCloseTo(1.234, 12))
  it('places a circular planar orbit at positive x for mean anomaly zero', () => {
    const position = orbitalPositionAtJulianDate({semiMajorAxisAu:2,eccentricity:0,inclinationDeg:0,ascendingNodeDeg:0,longitudeOfPerihelionDeg:0,meanLongitudeDegAtEpoch:0,orbitalPeriodDays:365},2451545)
    expect(position.x).toBeCloseTo(2,12);expect(position.y).toBeCloseTo(0,12);expect(position.z).toBeCloseTo(0,12)
  })
  it('samples a closed orbit from the same propagator without duplicating the first point', () => {
    const elements={semiMajorAxisAu:1,eccentricity:.2,inclinationDeg:7,ascendingNodeDeg:48,longitudeOfPerihelionDeg:77,meanLongitudeDegAtEpoch:252,orbitalPeriodDays:88}
    const points=sampleOrbitAtEqualMeanAnomaly(elements,720)
    expect(points).toHaveLength(720)
    expect(Math.hypot(points[0].x-points[719].x,points[0].y-points[719].y,points[0].z-points[719].z)).toBeGreaterThan(0)
  })
  it('preserves perihelion and aphelion distances a(1-e) and a(1+e)', () => {
    const elements={semiMajorAxisAu:2,eccentricity:.25,inclinationDeg:0,ascendingNodeDeg:0,longitudeOfPerihelionDeg:0,meanLongitudeDegAtEpoch:0,orbitalPeriodDays:100}
    const radii=sampleOrbitAtEqualMeanAnomaly(elements,1000).map(p=>Math.hypot(p.x,p.y,p.z))
    expect(Math.min(...radii)).toBeCloseTo(1.5,5);expect(Math.max(...radii)).toBeCloseTo(2.5,5)
  })
})
