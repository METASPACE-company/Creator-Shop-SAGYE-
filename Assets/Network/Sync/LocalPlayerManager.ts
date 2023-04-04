import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import Gesture from '../../UI/Gesture/Gesture';
import LocalPlayer from './LocalPlayer';
import PlayerManager from './PlayerManager';

export default class LocalPlayerManager extends ZepetoScriptBehaviour {
  @Header('Prefabs')
  @SerializeField()
  private localPlayerPrefab: GameObject;

  public Start(): void {
    PlayerManager.Instance.AddAddedLocalPlayerHook(
      async (player, sessionId) => {
        const localPlayerObject = GameObject.Instantiate<GameObject>(
          this.localPlayerPrefab,
          player.zepetoPlayer.character.transform,
          false,
        );
        const localPlayer = localPlayerObject.GetComponent<LocalPlayer>();
        localPlayer.Activate(sessionId, player.zepetoPlayer);
        await Gesture.Instance.Prepare(localPlayer);
      },
    );
    PlayerManager.Instance.AddAddedRemotePlayerHook((player) => {
      player.character.gameObject.tag = 'RemotePlayer';
    });
  }
}
