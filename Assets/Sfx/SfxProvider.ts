import { AudioClip } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class SfxProvider extends ZepetoScriptBehaviour {
  private static instance: SfxProvider;

  public static get Instance(): SfxProvider {
    return SfxProvider.instance;
  }

  @SerializeField()
  private uiClick: AudioClip;
  @SerializeField()
  private uiPopupShowing: AudioClip;

  public get UIClick(): AudioClip {
    return this.uiClick;
  }

  public get UIPopupShowing(): AudioClip {
    return this.uiPopupShowing;
  }

  public Awake(): void {
    SfxProvider.instance = this;
  }
}
