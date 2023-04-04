import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import MagicCameraObject from './MagicCameraObject';
import MagicCameraPad from './MagicCameraPad';
import MagicCameraShotTaking from './MagicCameraShotTaking';
import MagicCameraTutorial from './MagicCameraTutorial';

export default class MagicCameraPreview extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  private cameraButton: Button;
  @SerializeField()
  private takeShotButton: Button;

  private tutorial: MagicCameraTutorial;
  private pad: MagicCameraPad;
  private shotTaking: MagicCameraShotTaking;
  private cameraObject: MagicCameraObject;

  public Awake(): void {
    this.cameraButton.onClick.AddListener(this.OnClickCameraButton.bind(this));
    this.takeShotButton.onClick.AddListener(
      this.OnClickTakeShotButton.bind(this),
    );
  }

  public Start(): void {
    this.gameObject.SetActive(false);
  }

  public Activate(
    tutorial: MagicCameraTutorial,
    pad: MagicCameraPad,
    shotTaking: MagicCameraShotTaking,
    cameraObject: MagicCameraObject,
  ): void {
    this.gameObject.SetActive(true);
    this.tutorial = tutorial;
    this.pad = pad;
    this.shotTaking = shotTaking;
    this.cameraObject = cameraObject;
  }

  public Deactivate(): void {
    this.gameObject.SetActive(false);
  }

  public OnClickCameraButton(): void {
    this.Deactivate();
    this.cameraObject.EnterPreview();
    this.pad.Activate(
      this.tutorial,
      this,
      this.shotTaking,
      this.cameraObject,
      false,
    );
  }

  public OnClickTakeShotButton(): void {
    this.shotTaking.Activate(this.tutorial, null, this, this.cameraObject);
  }
}
