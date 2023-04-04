import { Color, Gizmos, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class BGMReductionPoint extends ZepetoScriptBehaviour {
  private static points: BGMReductionPoint[] = [];

  public static get Points(): BGMReductionPoint[] {
    return this.points;
  }

  @SerializeField()
  private minDistance: number;
  @SerializeField()
  private maxDistance: number;
  @SerializeField()
  private minReductionRate: number;
  @SerializeField()
  private maxReductionRate: number;

  public Awake(): void {
    BGMReductionPoint.points.push(this);
  }

  public ComputeReductionRate(playerPosition: Vector3): number {
    const distance = Vector3.Distance(playerPosition, this.transform.position);

    if (distance <= this.minDistance) return this.maxReductionRate;
    if (this.maxDistance <= distance) return this.minReductionRate;

    const rate =
      (distance - this.minDistance) / (this.maxDistance - this.minDistance);
    const reductionRate = easeInQuad(1 - rate);

    return (
      this.minReductionRate +
      (this.maxReductionRate - this.minReductionRate) * reductionRate
    );
  }
}

function easeInQuad(x: number): number {
  return x * x;
}
