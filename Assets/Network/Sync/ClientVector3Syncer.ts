import { Time, Vector3 } from "UnityEngine";

export class ClientVector3Syncer {
  private t: number;
  private c: number;

  constructor(
    private from: Vector3,
    private to: Vector3,
    private duration: number
  ) {
    this.t = Time.timeSinceLevelLoad;
    this.c = Time.timeSinceLevelLoad;
  }

  isDone(): boolean {
    return this.c - this.t >= this.duration;
  }

  update(): Vector3 {
    const v = Vector3.Lerp(
      this.from,
      this.to,
      ease(Math.min((this.c - this.t) / this.duration, 1))
    );
    this.c = Time.timeSinceLevelLoad;
    return v;
  }
}

function ease(t: number): number {
  return t;
}
