import { TMP_InputField, TMP_Text } from 'TMPro';
import {
  Animator,
  GameObject,
  Material,
  Mathf,
  RenderTexture,
  Time,
} from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldContent } from 'ZEPETO.World';

import MagicCameraObject from './MagicCameraObject';
import MagicCameraPad from './MagicCameraPad';
import MagicCameraPreview from './MagicCameraPreview';
import MagicCameraTutorial from './MagicCameraTutorial';
import VirtualPadController from '../Virtual Pad/VirtualPadController';
import GlobalCoroutineManager from '../../Utility/GlobalCoroutineManager';
import i18nManager from '../../i18n/i18nManager';

export default class MagicCameraShotTaking extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  private previewMaterial: Material;
  @SerializeField()
  private closeButton: Button;
  @SerializeField()
  private shareButton: Button;
  @SerializeField()
  private shareCompleteNoti: Animator;
  @Header('Popup UI')
  @SerializeField()
  private popup: GameObject;
  @SerializeField()
  private popupContent: TMP_InputField;
  @SerializeField()
  private popupOkButton: Button;
  @Header('RTs')
  @SerializeField()
  private rtForShotTaking: RenderTexture;

  private tutorial: MagicCameraTutorial;
  private pad: MagicCameraPad;
  private preview: MagicCameraPreview;
  private cameraObject: MagicCameraObject;

  // Animation states.
  private filmAnimationBeginAt: number;

  public Awake(): void {
    this.closeButton.onClick.AddListener(this.OnClickCloseButton.bind(this));
    this.shareButton.onClick.AddListener(this.OnClickShareButton.bind(this));
    this.popupOkButton.onClick.AddListener(
      this.OnClickPopupOkButton.bind(this),
    );
  }

  public Start(): void {
    i18nManager.Instance.Event.OnChange((lang) => {
      this.popupContent.placeholder.GetComponent<TMP_Text>().text =
        lang['ZM_MagicCamera_Hashtag'];
    });

    this.gameObject.SetActive(false);
  }

  public Update(): void {
    function ease(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    const length = 4;
    const now = Time.timeSinceLevelLoadAsDouble;
    const delta = (now - this.filmAnimationBeginAt) / length;
    const intensity = Mathf.Lerp(1, 0, ease(delta));
    this.previewMaterial.SetFloat('_BurnIntensity', intensity);
    this.previewMaterial.SetFloat('_BlurIntensity', intensity);

    if (length <= delta) this.enabled = false;
  }

  public Activate(
    tutorial: MagicCameraTutorial,
    pad: MagicCameraPad,
    preview: MagicCameraPreview,
    cameraObject: MagicCameraObject,
  ): void {
    this.tutorial = tutorial;
    this.pad = pad;
    this.preview = preview;
    this.cameraObject = cameraObject;

    GlobalCoroutineManager.RawInstance.StartCoroutine(
      function* () {
        yield GlobalCoroutineManager.RawInstance.StartCoroutine(
          cameraObject.TakeShotIntoRT(this.rtForShotTaking),
        );
        this.enabled = true;
        this.gameObject.SetActive(true);
        this.shareCompleteNoti.gameObject.SetActive(false);
        this.popup.SetActive(false);
        this.filmAnimationBeginAt = Time.timeSinceLevelLoadAsDouble;
        VirtualPadController.Instance.SetActive(false);
      }.bind(this)(),
    );
  }

  public Deactivate(): void {
    this.gameObject.SetActive(false);
    VirtualPadController.Instance.SetActive(true);

    if (this.pad)
      this.pad.Activate(
        this.tutorial,
        this.preview,
        this,
        this.cameraObject,
        false,
      );
  }

  private OnClickCloseButton(): void {
    this.Deactivate();
  }

  private OnClickShareButton(): void {
    this.popup.SetActive(true);
    this.popupContent.text = '';
  }

  private OnClickPopupOkButton(): void {
    let feedContent =
      this.popupContent.text.trim() ||
      this.popupContent.placeholder.GetComponent<TMP_Text>().text;

    if (
      !feedContent.toLowerCase().includes('magiccamerachallenge') ||
      !feedContent.toLowerCase().includes('zgm')
    ) {
      feedContent += '\n\n#Magiccamerachallenge #ZGM';
    }

    ZepetoWorldContent.CreateFeed(this.rtForShotTaking, feedContent, () => {
      this.shareCompleteNoti.gameObject.SetActive(true);
      this.shareCompleteNoti.SetTrigger('notify');
    });
    this.popup.SetActive(false);

    this.shareCompleteNoti.gameObject.SetActive(true);
    this.shareCompleteNoti.SetTrigger('notify');
  }
}
