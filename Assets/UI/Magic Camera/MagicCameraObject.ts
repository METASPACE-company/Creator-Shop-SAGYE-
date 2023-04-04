import {
  AudioListener,
  Camera,
  Mathf,
  Quaternion,
  RenderTexture,
  Vector3,
  WaitForEndOfFrame,
} from 'UnityEngine';
import { PostProcessLayer } from 'UnityEngine.Rendering.PostProcessing';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

const CAMERA_MIN_HEIGHT: number = 0.25;
const CAMERA_MAX_HEIGHT: number = 1.75;

export default class MagicCameraObject extends ZepetoScriptBehaviour {
  @Header('Components')
  @SerializeField()
  private camera: Camera;
  @SerializeField()
  private audioListener: AudioListener;
  @SerializeField()
  private ppLayer: PostProcessLayer;
  @Header('RTs')
  @SerializeField()
  private rtForPreview: RenderTexture;

  private mainCamera: Camera;
  private position: Vector3;
  private rotation: Quaternion;
  private horizontalAngle: number;
  private verticalAngle: number;

  public Activate(): void {
    this.mainCamera = Camera.main;
    this.position = this.transform.localPosition;
    this.rotation = this.transform.localRotation;
    this.horizontalAngle = 0;
    this.verticalAngle = 0;
    this.EnterPreview();
  }

  public EnterPreview(): void {
    this.camera.targetTexture = null;
    this.audioListener.enabled = true;
    this.mainCamera.gameObject.SetActive(false);
  }

  public ExitPreview(): void {
    this.camera.targetTexture = this.rtForPreview;
    this.audioListener.enabled = false;
    this.mainCamera.gameObject.SetActive(true);
  }

  public ApplyFlash(flash: boolean): void {
    this.ppLayer.enabled = flash;
  }

  public ApplyRotation(horizontal: number, vertical: number): void {
    this.horizontalAngle += horizontal;
    this.verticalAngle = Mathf.Clamp(this.verticalAngle + vertical, -90, 90);
    this.transform.localRotation = Quaternion.op_Multiply(
      this.rotation,
      Quaternion.Euler(this.verticalAngle, this.horizontalAngle, 0),
    );
  }

  public ApplyZoomLevel(level: number): void {
    this.camera.fieldOfView = [90, 60, 30, 15][level] ?? 60;
  }

  public ApplyElevationLevel(level: number): void {
    this.transform.localPosition = Vector3.op_Addition(
      this.position,
      Vector3.op_Multiply(
        Vector3.up,
        CAMERA_MIN_HEIGHT + (CAMERA_MAX_HEIGHT - CAMERA_MIN_HEIGHT) * level,
      ),
    );
  }

  public *TakeShotIntoRT(rt: RenderTexture) {
    const rtPreview = this.camera.targetTexture; // NOTE: This may null if the camera is in preview mode.
    this.camera.targetTexture = rt;

    yield new WaitForEndOfFrame();

    this.camera.Render();
    this.camera.targetTexture = rtPreview;
  }
}
