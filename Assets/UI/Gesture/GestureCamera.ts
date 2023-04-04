import {
  AnimationClip,
  Camera,
  HumanBodyBones,
  RenderTexture,
  Vector3,
  WaitForSeconds,
} from 'UnityEngine';
import { GraphicsFormat } from 'UnityEngine.Experimental.Rendering';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import GesturePlayer from './GesturePlayer';

export default class GestureCamera extends ZepetoScriptBehaviour {
  private camera: Camera;

  public Awake(): void {
    this.camera = this.GetComponent<Camera>();
  }

  public Capture(
    player: GesturePlayer,
    clips: AnimationClip[],
    cb: (rts: RenderTexture[]) => void,
  ): void {
    this.StartCoroutine(this.CaptureAnimationClips(player, clips, cb));
  }

  private *CaptureAnimationClips(
    player: GesturePlayer,
    clips: AnimationClip[],
    cb: (rts: RenderTexture[]) => void,
  ) {
    const waiter = new WaitForSeconds(0.1);
    let rts: RenderTexture[] = [];

    for (const animation of clips) {
      const rt = RenderTexture.GetTemporary(
        256,
        256,
        16,
        GraphicsFormat.R8G8B8A8_UNorm,
      );
      rts.push(rt);
      this.camera.targetTexture = rt;
      player.ZepetoCharacter.SetGesture(animation);

      yield waiter;

      this.camera.transform.position = new Vector3(
        0,
        player.ZepetoCharacter.ZepetoAnimator.GetBoneTransform(
          HumanBodyBones.Head,
        ).transform.position.y,
        1,
      );
      this.camera.Render();
    }

    cb(rts);
  }
}
