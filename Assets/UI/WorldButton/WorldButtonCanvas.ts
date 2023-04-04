import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class WorldButtonCanvas extends ZepetoScriptBehaviour {
  private static instance: WorldButtonCanvas;

  public static get Instance(): WorldButtonCanvas {
    return WorldButtonCanvas.instance;
  }

  public Awake(): void {
    WorldButtonCanvas.instance = this;
  }
}
