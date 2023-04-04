import { Screen, Vector2, Vector3 } from 'UnityEngine';
import {
  EventTrigger,
  EventTriggerType,
  PointerEventData,
} from 'UnityEngine.EventSystems';
import { Entry } from 'UnityEngine.EventSystems.EventTrigger';
import { Button, Slider, Toggle } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import MagicCamera from './MagicCamera';
import MagicCameraObject from './MagicCameraObject';
import MagicCameraPreview from './MagicCameraPreview';
import MagicCameraShotTaking from './MagicCameraShotTaking';
import MagicCameraTutorial from './MagicCameraTutorial';
import VirtualPadStateManager from '../Virtual Pad/VirtualPadStateManager';
import MiddleMenuGroup from '../Middle Menu Group/MiddleMenuGroup';
import Gesture from '../Gesture/Gesture';

export default class MagicCameraPad extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  private rotationPadEventTrigger: EventTrigger;
  @SerializeField()
  private heightSlider: Slider;
  @SerializeField()
  private flashToggle: Toggle;
  @SerializeField()
  private helpButton: Button;
  @SerializeField()
  private backButton: Button;
  @SerializeField()
  private takeShotButton: Button;
  @SerializeField()
  private plantButton: Button;
  @SerializeField()
  private zoomButtons: Button[];
  @Header('Configurations')
  @SerializeField()
  private rotationSensitivity: number;

  private tutorial: MagicCameraTutorial;
  private preview: MagicCameraPreview;
  private shotTaking: MagicCameraShotTaking;
  private cameraObject: MagicCameraObject;

  public Awake(): void {
    {
      const entry = new Entry();
      entry.eventID = EventTriggerType.Drag;
      entry.callback.AddListener(this.OnDragRotatingPad.bind(this));
      this.rotationPadEventTrigger.triggers.Add(entry);
    }

    this.heightSlider.onValueChanged.AddListener(
      this.OnChangeHeightSlider.bind(this),
    );
    this.flashToggle.onValueChanged.AddListener(this.OnToggleFlash.bind(this));
    this.helpButton.onClick.AddListener(this.OnClickHelpButton.bind(this));
    this.backButton.onClick.AddListener(this.OnClickBackButton.bind(this));
    this.takeShotButton.onClick.AddListener(
      this.OnClickTakeShotButton.bind(this),
    );
    this.plantButton.onClick.AddListener(this.OnClickPlantButton.bind(this));

    for (let index = 0; index < this.zoomButtons.length; ++index)
      this.zoomButtons[index].onClick.AddListener(
        this.OnClickZoomButton.bind(this, index),
      );
  }

  public Start(): void {
    this.gameObject.SetActive(false);
  }

  public Activate(
    tutorial: MagicCameraTutorial,
    preview: MagicCameraPreview,
    shotTaking: MagicCameraShotTaking,
    cameraObject: MagicCameraObject,
    initialize: boolean,
  ): void {
    if (this.gameObject.activeSelf) return;

    this.gameObject.SetActive(true);
    this.tutorial = tutorial;
    this.preview = preview;
    this.shotTaking = shotTaking;
    this.cameraObject = cameraObject;
    VirtualPadStateManager.Instance.MagicCamera = true;
    MiddleMenuGroup.Instance.gameObject.SetActive(false);
    Gesture.Instance.UI.gameObject.SetActive(false);

    if (initialize) {
      this.cameraObject.ApplyElevationLevel((this.heightSlider.value = 0.5));
      this.cameraObject.ApplyFlash((this.flashToggle.isOn = false));
      this.OnClickZoomButton(1);
    }
  }

  public Deactivate(): void {
    if (!this.gameObject.activeSelf) return;

    this.gameObject.SetActive(false);
    VirtualPadStateManager.Instance.MagicCamera = false;
    MiddleMenuGroup.Instance.gameObject.SetActive(true);
  }

  private OnDragRotatingPad(event: PointerEventData): void {
    const deltaInInch = Vector2.op_Division(event.delta, Screen.dpi);
    const angle = Vector2.op_Multiply(deltaInInch, this.rotationSensitivity);
    this.cameraObject.ApplyRotation(angle.x, -angle.y);
  }

  private OnChangeHeightSlider(height: number): void {
    this.cameraObject.ApplyElevationLevel(height);
  }

  private OnToggleFlash(flash: boolean): void {
    this.cameraObject.ApplyFlash(flash);
  }

  private OnClickHelpButton(): void {
    this.tutorial.Activate();
  }

  private OnClickBackButton(): void {
    MagicCamera.Instance.Deactivate();
  }

  private OnClickTakeShotButton(): void {
    this.Deactivate();
    this.shotTaking.Activate(
      this.tutorial,
      this,
      this.preview,
      this.cameraObject,
    );
  }

  private OnClickPlantButton(): void {
    this.Deactivate();
    this.cameraObject?.ExitPreview();
    this.preview.Activate(
      this.tutorial,
      this,
      this.shotTaking,
      this.cameraObject,
    );
  }

  private OnClickZoomButton(level: number): void {
    for (let button of this.zoomButtons)
      button.transform.localScale = Vector3.one;

    this.zoomButtons[level].transform.localScale = Vector3.op_Multiply(
      Vector3.one,
      80 / 60,
    );
    this.cameraObject.ApplyZoomLevel(level);
  }
}
