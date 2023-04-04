import { ZepetoCharacter, ZepetoPlayer } from 'ZEPETO.Character.Controller';
import { MannequinInteractable } from 'ZEPETO.Mannequin';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import FoldingWallRaycaster from '../../3D/Folding Wall/FoldingWallRaycaster';
import EventTracker from '../../3D/Tracking/EventTracker';

export default class LocalPlayer extends ZepetoScriptBehaviour {
  private static instance: LocalPlayer;

  public static get Instance(): LocalPlayer {
    return LocalPlayer.instance;
  }

  private userId: string;
  private sessionId: string;
  private zepetoPlayer: ZepetoPlayer;

  public get UserId(): string {
    return this.userId;
  }

  public get SessionId(): string {
    return this.sessionId;
  }

  public get ZepetoPlayer(): ZepetoPlayer {
    return this.zepetoPlayer;
  }

  public get ZepetoCharacter(): ZepetoCharacter {
    return this.zepetoPlayer.character;
  }

  public Activate(sessionId: string, zepetoPlayer: ZepetoPlayer): void {
    LocalPlayer.instance = this;
    this.userId = zepetoPlayer.userId;
    this.sessionId = sessionId;
    this.zepetoPlayer = zepetoPlayer;
    this.ZepetoCharacter.gameObject.tag = 'LocalPlayer';

    this.ZepetoCharacter.gameObject.AddComponent<FoldingWallRaycaster>();
    this.ZepetoCharacter.gameObject.AddComponent<MannequinInteractable>();

    EventTracker.Instance.CountEnterWorld();
  }
}
