import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import Gesture from '../Gesture/Gesture';
import MagicCamera from '../Magic Camera/MagicCamera';

export default class MiddleMenuGroup extends ZepetoScriptBehaviour {
  private static instance: MiddleMenuGroup;

  public static get Instance(): MiddleMenuGroup {
    return MiddleMenuGroup.instance;
  }

  @Header('UI')
  @SerializeField()
  private magicCamera: Button;
  @SerializeField()
  private gesture: Button;

  public Awake(): void {
    MiddleMenuGroup.instance = this;
    this.magicCamera.onClick.AddListener(() => {
      MagicCamera.Instance.Activate();
    });
    this.gesture.onClick.AddListener(() => {
      if (Gesture.Instance.IsPrepared)
        Gesture.Instance.UI.gameObject.SetActive(true);
    });
  }
}
