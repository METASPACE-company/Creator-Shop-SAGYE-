import { GameObject, Texture, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import VirtualPadStateManager from '../Virtual Pad/VirtualPadStateManager';
import GestureUISlot from './GestureUISlot';

export default class GestureUI extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  public slotParent: Transform;
  @Header('Prefab')
  @SerializeField()
  private slot: GameObject;

  public Awake(): void {
    this.gameObject.SetActive(false);
  }

  public OnEnable(): void {
    if (VirtualPadStateManager.Instance)
      VirtualPadStateManager.Instance.Gesture = true;
  }

  public OnDisable(): void {
    if (VirtualPadStateManager.Instance)
      VirtualPadStateManager.Instance.Gesture = false;
  }

  public AppendSlot(thumbnail: Texture, name: string): GestureUISlot {
    const slotObject = GameObject.Instantiate<GameObject>(
      this.slot,
      this.slotParent,
      false,
    );
    const slot = slotObject.GetComponent<GestureUISlot>();
    slot.Activate(thumbnail, name);
    return slot;
  }
}
