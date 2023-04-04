import { Button, Slider } from 'UnityEngine.UI';
import { ZepetoScreenTouchpad } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import VirtualPadController from '../Virtual Pad/VirtualPadController';

export default class MagicCameraAdjustmentPad extends ZepetoScriptBehaviour {
  @SerializeField()
  private touchPad: ZepetoScreenTouchpad;
  @SerializeField()
  private elevationUpButton: Button;
  @SerializeField()
  private elevationDownButton: Button;
  @SerializeField()
  private backButton: Button;
  @SerializeField()
  private zoomSlider: Slider;
  @SerializeField()
  private takeShotButton: Button;

  public get TouchPad(): ZepetoScreenTouchpad {
    return this.touchPad;
  }

  public get ElevationUpButton(): Button {
    return this.elevationUpButton;
  }

  public get ElevationDownButton(): Button {
    return this.elevationDownButton;
  }

  public get BackButton(): Button {
    return this.backButton;
  }

  public get ZoomSlider(): Slider {
    return this.zoomSlider;
  }

  public get TakeShotButton(): Button {
    return this.takeShotButton;
  }

  public Activate(): void {
    VirtualPadController.Instance.SetActive(false);
  }
}
