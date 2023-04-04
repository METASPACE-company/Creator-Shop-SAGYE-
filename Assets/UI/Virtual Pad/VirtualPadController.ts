import { Button } from 'UnityEngine.UI';
import { ZepetoScreenTouchpad } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import {
  VirtualPadControllerProxy,
  VirtualPadControllerProxyImpl,
} from './VirtualPadControllerProxy';

const PROXY = new VirtualPadControllerProxyImpl();

export default class VirtualPadController
  extends ZepetoScriptBehaviour
  implements VirtualPadControllerProxy
{
  private static instance: VirtualPadController;

  public static get Instance(): VirtualPadControllerProxy {
    return VirtualPadController.instance ?? PROXY;
  }

  public static get RawInstance(): VirtualPadController {
    return VirtualPadController.instance;
  }

  public static Detach(): void {
    VirtualPadController.instance = null;
  }

  @SerializeField()
  private initiallyEnabled: boolean;
  @SerializeField()
  private touchPad: ZepetoScreenTouchpad;
  @SerializeField()
  private jumpButton: Button;

  public get TouchPad(): ZepetoScreenTouchpad {
    return this.touchPad;
  }

  public get JumpButton(): Button {
    return this.jumpButton;
  }

  public Awake(): void {
    VirtualPadController.instance = this;
    this.SetActive(PROXY.isTouched ? PROXY.isActive : this.initiallyEnabled);

    for (const handler of PROXY.Handlers) handler(this);
  }

  public OnceInitialized(handler: (pad: VirtualPadController) => void): void {
    handler(this);
  }

  public SetActive(isActive: boolean): void {
    if (isActive === this.gameObject.activeSelf) return;
    this.touchPad.OnPointerUpEvent.Invoke();
    this.gameObject.SetActive(isActive);
  }
}
