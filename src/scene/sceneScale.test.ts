import { describe, expect, it } from 'vitest'
import { auToSceneDistance, radiusKmToSceneRadius } from './sceneScale'

describe('scientific display scales', () => {
  it('keeps orbital distance monotonic while compressing the real ratio', () => {
    expect(auToSceneDistance(30.07)).toBeGreaterThan(auToSceneDistance(5.2))
    expect(auToSceneDistance(30.07) / auToSceneDistance(1)).toBeLessThan(30.07)
  })

  it('derives body size from actual radius and preserves size ordering', () => {
    expect(radiusKmToSceneRadius(696340)).toBeGreaterThan(radiusKmToSceneRadius(69911))
    expect(radiusKmToSceneRadius(69911)).toBeGreaterThan(radiusKmToSceneRadius(6371))
    expect(radiusKmToSceneRadius(6371)).toBeGreaterThan(radiusKmToSceneRadius(2439.7))
  })

  it('uses one linear radius scale so gas giants keep their real relative size', () => {
    const earth = radiusKmToSceneRadius(6371)
    expect(radiusKmToSceneRadius(69911) / earth).toBeCloseTo(69911 / 6371, 10)
    expect(radiusKmToSceneRadius(58232) / earth).toBeCloseTo(58232 / 6371, 10)
  })
})
