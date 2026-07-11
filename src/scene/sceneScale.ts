// 距离来自真实 AU，使用统一的单调幂函数压缩以容纳完整太阳系。
export const auToSceneDistance = (au: number): number => au <= 0 ? 0 : 18 * Math.pow(au, 0.72)

// 八大行星严格使用同一个线性半径比例：地球半径 = 0.28 场景单位。
// 因而木星约为地球 10.97 倍、土星约为 9.14 倍；不单独美术缩放类木行星。
// 太阳若与压缩后的轨道距离同时线性绘制会吞没内行星，因此仅太阳单独压缩到 8 场景单位。
export const radiusKmToSceneRadius = (radiusKm: number): number => radiusKm > 100000 ? 8 : 0.28 * radiusKm / 6371
