import {
  AudioListener,
  Camera,
  Quaternion,
  Transform,
  Vector3,
} from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class MagicCameraModel extends ZepetoScriptBehaviour {
  private static REFERENCE_HEIGHT = 1.5;
  private static HEIGHT_STEP = 0.25;

  private camera: Camera;
  private audioListener: AudioListener;
  private target: Transform;
  private targetFeetHeight: number;
  private elevationLevel = 0;

  public get Camera(): Camera {
    return this.camera;
  }

  public get AudioListener(): AudioListener {
    return this.audioListener;
  }

  public Awake(): void {
    this.camera = this.GetComponent<Camera>();
    this.audioListener = this.GetComponent<AudioListener>();
  }

  public Activate(target: Transform, targetFeetHeight: number): void {
    this.camera.enabled = false;
    this.audioListener.enabled = false;
    this.target = target;
    this.targetFeetHeight = targetFeetHeight;
    this.elevationLevel = 0;
  }

  public SetElevationLevel(elevationLevel: number): void {
    if (elevationLevel < -3) elevationLevel = -3;
    if (3 < elevationLevel) elevationLevel = 3;
    this.elevationLevel = elevationLevel;
  }

  public LateUpdate(): void {
    const heightOffset =
      MagicCameraModel.REFERENCE_HEIGHT +
      MagicCameraModel.HEIGHT_STEP * this.elevationLevel;
    const height = this.targetFeetHeight + heightOffset;
    const position = this.transform.position;
    position.y = height;

    const diff = Vector3.op_Subtraction(this.target.position, position);
    diff.y = 0;
    const rotation = Quaternion.LookRotation(diff.normalized, Vector3.up);

    this.transform.SetPositionAndRotation(position, rotation);

    // TODO: Show the shadow and make that follow this camera model.
  }
}
