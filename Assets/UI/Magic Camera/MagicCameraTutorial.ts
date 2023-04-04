import { GameObject } from 'UnityEngine';
import { Button, Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class MagicCameraTutorial extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  private button: Button;
  @SerializeField()
  private phase1: GameObject;
  @SerializeField()
  private phase2: GameObject;
  @SerializeField()
  private phase3: GameObject;
  @Header('External UI')
  @SerializeField()
  private padLeftPadding: Image;
  @SerializeField()
  private padRightPadding: Image;
  @SerializeField()
  private cameraFrames: GameObject[];

  private phase: number;

  public Awake(): void {
    this.button.onClick.AddListener(this.OnClickScreen.bind(this));
  }

  public Activate(): void {
    this.gameObject.SetActive(true);

    this.phase = 0;
    this.phase1.gameObject.SetActive(true);
    this.phase2.gameObject.SetActive(false);
    this.phase3.gameObject.SetActive(false);

    this.padLeftPadding.enabled = false;
    this.padRightPadding.enabled = false;
    for (const frame of this.cameraFrames) frame.SetActive(false);
  }

  public Deactivate(): void {
    this.phase1.gameObject.SetActive(false);
    this.phase2.gameObject.SetActive(false);
    this.phase3.gameObject.SetActive(false);

    this.padLeftPadding.enabled = true;
    this.padRightPadding.enabled = true;
    for (const frame of this.cameraFrames) frame.SetActive(true);

    this.gameObject.SetActive(false);
  }

  private OnClickScreen(): void {
    if (this.phase === 2) {
      this.Deactivate();
      return;
    }

    this.phase += 1;
    this.phase1.gameObject.SetActive(this.phase === 0);
    this.phase2.gameObject.SetActive(this.phase === 1);
    this.phase3.gameObject.SetActive(this.phase === 2);
  }
}
