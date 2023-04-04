import { AnimationClip, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import SeatManager from './SeatManager';

export default class SeatLocator extends ZepetoScriptBehaviour {
  @SerializeField()
  private animationOverride: AnimationClip;

  private button: GameObject;

  public static ResetAllButton(): void {
    const seats = GameObject.FindObjectsOfType<SeatLocator>();
    for (const seat of seats) seat.button.SetActive(true);
  }

  public Start(): void {
    this.button = SeatManager.Instance.RegisterSeat(
      this.transform,
      this.animationOverride,
    );
  }
}
