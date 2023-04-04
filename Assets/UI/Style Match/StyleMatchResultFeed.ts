import {
  Camera,
  CharacterController,
  GameObject,
  Material,
  RenderTexture,
  Transform,
  Vector3,
  WaitForEndOfFrame,
} from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import Gesture from '../Gesture/Gesture';

import { StyleMatchResult } from './StyleMatchState';

export default class StyleMatchResultFeed extends ZepetoScriptBehaviour {
  @SerializeField()
  private feedCamera: Camera;
  @SerializeField()
  private backgroundImage: Image;
  @SerializeField()
  private feedImageCamera: Camera;
  @SerializeField()
  private feedImageBGMat: Material;
  @SerializeField()
  private typoImage: Image;
  @SerializeField()
  private feedImageCharacterHeadLocator: Transform;
  @SerializeField()
  private feedImageArea: GameObject;

  public SetResult(result: StyleMatchResult): void {
    this.backgroundImage.color = result.FeedBGColor;
    this.typoImage.sprite = result.FeedTypoSprite;
    this.feedImageBGMat.SetTexture('_MainTex', result.FeedImageBG);
  }

  public TakeScreenShot(cb: (rt: RenderTexture) => void): void {
    this.StartCoroutine(this.TakeScreenShotCoroutine(cb));
  }

  private *TakeScreenShotCoroutine(cb: (rt: RenderTexture) => void) {
    const characterTrsf =
      ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject
        .transform;
    const characterController =
      characterTrsf.GetComponent<CharacterController>();
    const headBoneTrsf = characterTrsf.Find(
      'Zepeto Context/hips/spine/chest/chestUpper/neck/head',
    );

    characterController.enabled = false;
    this.feedImageArea.SetActive(true);

    const contents = Gesture.Instance.Contents;

    if (contents) {
      const poseContents = contents.filter((content) =>
        [
          'ZW_POSE_007',
          'ZW_POSE_020',
          'ZW_POSE_050',
          'ZW_POSE_048',
          'ZW_POSE_027',
        ].includes(content.Id),
      );

      if (poseContents.length)
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.SetGesture(
          poseContents[Math.floor(Math.random() * poseContents.length)]
            .AnimationClip,
        );
    }

    const headBoneCloneTrsf = (
      GameObject.Instantiate(
        headBoneTrsf.gameObject,
        characterTrsf,
        true,
      ) as GameObject
    ).transform;
    const headOffset = characterTrsf.position.y - headBoneCloneTrsf.position.y;
    GameObject.Destroy(headBoneCloneTrsf.gameObject);

    const playerPosMemory = characterTrsf.position;
    const playerAngleMemory = characterTrsf.localEulerAngles;

    characterTrsf.position =
      this.feedImageCharacterHeadLocator.position +
      new Vector3(0, headOffset, 0);
    characterTrsf.localEulerAngles =
      this.feedImageCharacterHeadLocator.localEulerAngles;

    yield null;
    yield new WaitForEndOfFrame();

    this.feedImageCamera.Render();

    characterTrsf.position = playerPosMemory;
    characterTrsf.localEulerAngles = playerAngleMemory;
    characterController.enabled = true;
    this.feedImageArea.SetActive(false);

    ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.CancelGesture();

    yield null;
    yield new WaitForEndOfFrame();

    this.feedCamera.Render();
    cb(this.feedCamera.targetTexture);
  }
}
