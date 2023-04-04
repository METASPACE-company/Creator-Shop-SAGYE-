import { Collider } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldContent } from 'ZEPETO.World';

import LoadingCover from '../../UI/Loading Cover/LoadingCover';
import GlobalCoroutineManager from '../../Utility/GlobalCoroutineManager';
import EventTracker from '../Tracking/EventTracker';

export default class Portal extends ZepetoScriptBehaviour {
  @SerializeField()
  private worldId: string;

  public OnTriggerEnter(other: Collider): void {
    if (other.tag !== 'LocalPlayer') return;
    EventTracker.Instance.CountEnterPortal();
    LoadingCover.Instance.Unreveal();
    GlobalCoroutineManager.Instance.RunAfter(2, () => {
      ZepetoWorldContent.MoveToWorld(this.worldId, () => {});
    });
  }
}
