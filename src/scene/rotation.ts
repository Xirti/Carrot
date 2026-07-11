export function spinDeltaRadians(deltaSeconds: number, rotationPeriodHours: number): number {
  const direction = Math.sign(rotationPeriodHours) || 1
  const relativeSpeed = 24 / Math.max(Math.abs(rotationPeriodHours), 1)
  return deltaSeconds * relativeSpeed * 0.45 * direction
}
