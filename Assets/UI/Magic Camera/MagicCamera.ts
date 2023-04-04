import { GameObject, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import EventTracker from '../../3D/Tracking/EventTracker';
import LocalPlayer from '../../Network/Sync/LocalPlayer';
import MenuGroup from '../Menu Group/MenuGroup';
import WorldButtonCanvas from '../WorldButton/WorldButtonCanvas';
import MagicCameraObject from './MagicCameraObject';
import MagicCameraPad from './MagicCameraPad';
import MagicCameraPreview from './MagicCameraPreview';
import MagicCameraShotTaking from './MagicCameraShotTaking';
import MagicCameraTutorial from './MagicCameraTutorial';

export default class MagicCamera extends ZepetoScriptBehaviour {
  private static instance: MagicCamera;

  public static get Instance(): MagicCamera {
    return MagicCamera.instance;
  }

  @Header('UI')
  @SerializeField()
  private _tutorial: GameObject;
  @SerializeField()
  private _pad: GameObject;
  @SerializeField()
  private _preview: GameObject;
  @SerializeField()
  private _shotTaking: GameObject;
  @Header('Camera')
  @SerializeField()
  private cameraPrefab: GameObject;

  private tutorial: MagicCameraTutorial;
  private pad: MagicCameraPad;
  private preview: MagicCameraPreview;
  private shotTaking: MagicCameraShotTaking;
  private camera: MagicCameraObject;

  public Awake(): void {
    this.tutorial = this._tutorial.GetComponent<MagicCameraTutorial>();
    this.pad = this._pad.GetComponent<MagicCameraPad>();
    this.preview = this._preview.GetComponent<MagicCameraPreview>();
    this.shotTaking = this._shotTaking.GetComponent<MagicCameraShotTaking>();
    MagicCamera.instance = this;
  }

  public Activate(): void {
    if (this.camera) {
      if (this.preview.gameObject.activeSelf)
        this.preview.OnClickCameraButton();
      return;
    }

    const player = LocalPlayer.Instance;
    if (!player) return;

    const transform = player.ZepetoCharacter.transform;
    const position = Vector3.op_Addition(
      transform.position,
      Vector3.op_Multiply(transform.forward, 0.75),
    );
    this.camera = GameObject.Instantiate<GameObject>(
      this.cameraPrefab,
      position,
      transform.rotation,
    ).GetComponent<MagicCameraObject>();
    this.camera.Activate();
    this.tutorial.Deactivate();
    this.pad.Activate(
      this.tutorial,
      this.preview,
      this.shotTaking,
      this.camera,
      true,
    );

    MenuGroup.Instance.gameObject.SetActive(false);
    GameObject.FindObjectsOfType<GameObject>(true)
      .filter((obj) => obj.name === 'iconImage')
      .forEach((obj) => obj.SetActive(false));
    WorldButtonCanvas.Instance.gameObject.SetActive(false);

    EventTracker.Instance.CountOpenMagicCamera();
  }

  public Deactivate(): void {
    if (!this.camera) return;

    this.camera.ExitPreview();
    GameObject.Destroy(this.camera.gameObject);
    this.camera = null;
    this.tutorial.Deactivate();
    this.pad.Deactivate();

    MenuGroup.Instance.gameObject.SetActive(true);
    GameObject.FindObjectsOfType<GameObject>(true)
      .filter((obj) => obj.name === 'iconImage')
      .forEach((obj) => obj.SetActive(true));
    WorldButtonCanvas.Instance.gameObject.SetActive(true);
  }
}
