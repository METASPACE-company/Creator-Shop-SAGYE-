import {
  Camera,
  Canvas,
  RectTransform,
  Transform,
  Vector2,
  Vector3,
} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import LocalPlayer from '../../Network/Sync/LocalPlayer';
import UnityUtility from './UnityUtility';

export default class WorldButton extends ZepetoScriptBehaviour {
  public targetTrsf: Transform;
  public worldOffset: Vector3 = new Vector3(0, 0, 0);
  public maxDistance: float = 20;

  private rectTrsf: RectTransform;

  private isInitialized: bool;

  private Start() {
    this.rectTrsf = this.GetComponent<RectTransform>();
    this.rectTrsf.anchorMin = new Vector2(0, 0);
    this.rectTrsf.anchorMax = new Vector2(0, 0);

    this.isInitialized = true;
  }

  private Update() {
    if (!this.isInitialized) {
      return;
    }

    this.UpdatePosition();
  }

  private UpdatePosition() {
    if (ZepetoPlayers.instance == null) {
      return;
    }
    const targetCamera = Camera.main;

    if (
      !UnityUtility.IsRealExists(targetCamera) ||
      !UnityUtility.IsRealExists(this.targetTrsf) ||
      !UnityUtility.IsRealExists(ZepetoPlayers.instance.LocalPlayer) ||
      !UnityUtility.IsRealExists(
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character,
      )
    ) {
      this.rectTrsf.anchoredPosition = new Vector2(-100000, -100000);
      return;
    }

    const character = LocalPlayer.Instance?.ZepetoCharacter;
    if (character == null) {
      return;
    }
    const distanceFromTarget = Vector3.op_Subtraction(
      character.transform.position,
      this.targetTrsf.position,
    ).magnitude;
    let position;

    const FromCamDir =
      this.targetTrsf.position - targetCamera.transform.position;
    const forward = targetCamera.transform.forward;
    const dotProduct = Vector3.Dot(FromCamDir, forward);

    if (
      (this.maxDistance > 0 && distanceFromTarget > this.maxDistance) ||
      dotProduct < 0
    ) {
      position = new Vector2(-100000, -100000);
    } else {
      const parentCanvas = this.GetComponentInParent<Canvas>();
      if (!parentCanvas) return;
      const parentCanvasRect = parentCanvas.GetComponent<RectTransform>();

      const targetPosition: Vector3 = Vector3.op_Addition(
        this.targetTrsf.position,
        this.worldOffset,
      );
      const viewportPosition =
        targetCamera.WorldToViewportPoint(targetPosition);

      position = new Vector2(
        viewportPosition.x * parentCanvasRect.sizeDelta.x,
        viewportPosition.y * parentCanvasRect.sizeDelta.y,
      );
    }
    this.rectTrsf.anchoredPosition = position;
  }
}
