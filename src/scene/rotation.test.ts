import { describe, expect, it } from 'vitest'
import { spinDeltaRadians } from './rotation'

describe('planet rotation', () => {
  it('rotates prograde bodies in the positive local Y direction', () => {
    expect(spinDeltaRadians(1, 24)).toBeGreaterThan(0)
  })

  it('rotates retrograde bodies in the negative local Y direction', () => {
    expect(spinDeltaRadians(1, -24)).toBeLessThan(0)
  })
})