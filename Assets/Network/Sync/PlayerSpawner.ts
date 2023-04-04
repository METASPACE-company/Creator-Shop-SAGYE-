import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import PlayerManager from './PlayerManager';

export default class PlayerSpawner extends ZepetoScriptBehaviour {
  @SerializeField()
  private spawnPlayersAutomatically: boolean;

  public Start(): void {
    PlayerManager.Instance.SetSpawning(this.spawnPlayersAutomatically);
  }
}
