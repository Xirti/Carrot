import { describe, expect, it } from 'vitest'
import { celestialBodies, planets } from './bodies'

describe('planet data', () => {
  it('contains the eight planets in solar order', () => {
    expect(planets.map((planet) => planet.id)).toEqual([
      'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
    ])
  })

  it('records retrograde rotation with a negative period', () => {
    expect(planets.find((planet) => planet.id === 'venus')?.rotationPeriodHours).toBeLessThan(0)
    expect(planets.find((planet) => planet.id === 'uranus')?.rotationPeriodHours).toBeLessThan(0)
  })

  it('includes the Sun as an inspectable body', () => {
    expect(celestialBodies[0].id).toBe('sun')
    expect(celestialBodies[0].radiusKm).toBeGreaterThan(planets[4].radiusKm)
  })
})