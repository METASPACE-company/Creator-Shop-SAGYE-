import { GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class NPCBubbleTextProvider extends ZepetoScriptBehaviour {
  private static instance: NPCBubbleTextProvider;

  public static get Instance(): NPCBubbleTextProvider {
    return NPCBubbleTextProvider.instance;
  }

  @SerializeField()
  private npcBubbleText: GameObject;

  public get NPCBubbleText(): GameObject {
    return this.npcBubbleText;
  }

  public Awake(): void {
    NPCBubbleTextProvider.instance = this;
  }
}
