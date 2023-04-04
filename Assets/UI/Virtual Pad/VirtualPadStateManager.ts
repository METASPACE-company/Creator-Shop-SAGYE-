import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import VirtualPadController from './VirtualPadController';

export default class VirtualPadStateManager extends ZepetoScriptBehaviour {
  private static instance: VirtualPadStateManager;

  public static get Instance(): VirtualPadStateManager {
    return VirtualPadStateManager.instance;
  }

  private styleMatch = false;
  private gesture = false;
  private magicCamera = false;

  public get StyleMatch(): boolean {
    return this.styleMatch;
  }

  public get Gesture(): boolean {
    return this.gesture;
  }

  public get MagicCamera(): boolean {
    return this.magicCamera;
  }

  public set StyleMatch(value: boolean) {
    this.styleMatch = value;
    this.UpdateVirtualPad();
  }

  public set Gesture(value: boolean) {
    this.gesture = value;
    this.UpdateVirtualPad();
  }

  public set MagicCamera(value: boolean) {
    this.magicCamera = value;
    this.UpdateVirtualPad();
  }

  public Awake(): void {
    VirtualPadStateManager.instance = this;
  }

  private UpdateVirtualPad(): void {
    const flag = this.styleMatch || this.gesture || this.magicCamera;
    VirtualPadController.Instance.SetActive(!flag);
  }
}
