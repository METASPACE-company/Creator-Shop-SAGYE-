import { Collider } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import EventTracker from './EventTracker';

export default class EventTrackingArea extends ZepetoScriptBehaviour {
  @SerializeField()
  private areaName: string;

  public OnTriggerEnter(other: Collider): void {
    if (other.tag !== 'LocalPlayer') return;
    EventTracker.Instance.CountEnterArea(this.areaName);
  }
}
