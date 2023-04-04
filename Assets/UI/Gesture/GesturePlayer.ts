import { Quaternion, Vector3 } from 'UnityEngine';
import {
  SpawnInfo,
  ZepetoCharacter,
  ZepetoPlayer,
  ZepetoPlayers,
} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import PlayerManager from '../../Network/Sync/PlayerManager';

export default class GesturePlayer extends ZepetoScriptBehaviour {
  private sessionId: string;
  private zepetoPlayer: ZepetoPlayer;

  public get ZepetoPlayer(): ZepetoPlayer {
    return this.zepetoPlayer;
  }

  public get ZepetoCharacter(): ZepetoCharacter {
    return this.zepetoPlayer.character;
  }

  public Activate(sessionId: string, zepetoPlayer: ZepetoPlayer): void {
    this.sessionId = sessionId;
    this.zepetoPlayer = zepetoPlayer;
  }

  public Deactivate(): void {
    ZepetoPlayers.instance.RemovePlayer(this.sessionId);
  }

  public static Spawn(userId: string): Promise<GesturePlayer> {
    const spawnInfo = new SpawnInfo();
    spawnInfo.position = new Vector3(0, 10000, 0);
    spawnInfo.rotation = Quaternion.identity;

    const id = `__GESTURE_MODEL__${Math.random()}`;

    return new Promise((resolve) => {
      PlayerManager.Instance.AddAddedRemotePlayerHook((player, sessionId) => {
        if (sessionId !== id) return;

        const gesturePlayer =
          player.character.gameObject.AddComponent<GesturePlayer>();
        gesturePlayer.Activate(sessionId, player);

        resolve(gesturePlayer);
      });

      ZepetoPlayers.instance.CreatePlayerWithUserId(
        id,
        userId,
        spawnInfo,
        false,
      );
    });
  }
}
