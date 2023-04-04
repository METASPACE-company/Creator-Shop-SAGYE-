import { Time, Vector3 } from "UnityEngine";

import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class SpeedTracker extends ZepetoScriptBehaviour {
  public speed: number = 0;
  private lastPosition: Vector3;

  // NOTE: Let's use the Awake() instead of the Start(). It seems that the Start() is not called.
  Awake() {
    this.lastPosition = this.transform.position;
  }

  // NOTE: It is important to use LateUpdate() instead of Update(), because the order of execution of Update() is not guaranteed, resulting in a very high variance in the speed.
  LateUpdate() {
    const currentPosition = this.transform.position;
    const delta = Vector3.op_Subtraction(currentPosition, this.lastPosition);
    delta.y = 0;
    this.speed = delta.magnitude / Time.deltaTime;
    this.lastPosition = currentPosition;
  }
}
