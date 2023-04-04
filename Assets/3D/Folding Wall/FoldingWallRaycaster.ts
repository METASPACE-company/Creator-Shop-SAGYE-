import { Camera, GameObject, Renderer, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class FoldingWallRaycaster extends ZepetoScriptBehaviour {
  private walls: Renderer[];

  public Awake(): void {
    this.walls = GameObject.FindGameObjectsWithTag('FoldingWall').map((wall) =>
      wall.GetComponent<Renderer>(),
    );
  }

  public Update(): void {
    const cameraAvailability = !!Camera.main;

    for (const wall of this.walls) {
      const visibility =
        !cameraAvailability ||
        70 <=
          Vector3.Angle(Camera.main.transform.forward, wall.transform.forward);
      if (wall.enabled !== visibility) wall.enabled = visibility;
    }
  }
}
