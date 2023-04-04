import { Collider, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import PlayerManager from '../../Network/Sync/PlayerManager';
import LoadingCover from '../../UI/Loading Cover/LoadingCover';
import GlobalCoroutineManager from '../../Utility/GlobalCoroutineManager';

export default class Teleporter extends ZepetoScriptBehaviour {
  private static isTeleporting: boolean = false;

  @SerializeField()
  private target: Transform;

  public OnTriggerEnter(other: Collider): void {
    if (other.tag !== 'LocalPlayer') return;
    if (Teleporter.isTeleporting) return;

    Teleporter.isTeleporting = true;

    LoadingCover.Instance.RunWithCover(() => {
      PlayerManager.Instance.LocalSyncer.Teleport(
        this.target.position,
        this.target.rotation,
      );
    });
    GlobalCoroutineManager.Instance.RunAfter(2, () => {
      Teleporter.isTeleporting = false;
    });
  }
}
