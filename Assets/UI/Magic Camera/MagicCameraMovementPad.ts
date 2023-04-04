import { Button } from 'UnityEngine.UI';
import { ZepetoScreenTouchpad } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class MagicCameraMovementPad extends ZepetoScriptBehaviour {
  @SerializeField()
  private touchPad: ZepetoScreenTouchpad;
  @SerializeField()
  private okButton: Button;

  public get TouchPad(): ZepetoScreenTouchpad {
    return this.touchPad;
  }

  public get OkButton(): Button {
    return this.okButton;
  }
}
