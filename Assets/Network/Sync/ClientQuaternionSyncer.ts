import { Quaternion, Time } from "UnityEngine";

export class ClientQuaternionSyncer {
  private t: number;
  private c: number;

  constructor(
    private from: Quaternion,
    private to: Quaternion,
    private duration: number
  ) {
    this.t = Time.timeSinceLevelLoad;
    this.c = Time.timeSinceLevelLoad;
  }

  isDone(): boolean {
    return this.c - this.t >= this.duration;
  }

  update(): Quaternion {
    const v = Quaternion.Lerp(
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
