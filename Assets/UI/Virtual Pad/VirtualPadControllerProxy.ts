import VirtualPadController from './VirtualPadController';

export interface VirtualPadControllerProxy {
  OnceInitialized(handler: (pad: VirtualPadController) => void): void;
  SetActive(isActive: boolean): void;
}

export class VirtualPadControllerProxyImpl
  implements VirtualPadControllerProxy
{
  private _isActive: null | boolean = null;
  private handlers: Array<(pad: VirtualPadController) => void> = [];

  public get isTouched(): boolean {
    return this._isActive !== null;
  }

  public get isActive(): boolean {
    return !!this._isActive;
  }

  public get Handlers(): Array<(pad: VirtualPadController) => void> {
    const handlers = this.handlers;
    this.handlers = [];
    return handlers;
  }

  OnceInitialized(handler: (pad: VirtualPadController) => void): void {
    this.handlers.push(handler);
  }

  SetActive(isActive: boolean): void {
    this._isActive = isActive;
  }
}
