import {
  Coroutine,
  Debug,
  Mathf,
  Quaternion,
  Vector3,
  WaitForSeconds,
} from 'UnityEngine';

import {
  CharacterJumpState,
  CharacterLandingState,
  CharacterMoveState,
  CharacterState,
  ZepetoPlayer,
} from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import GlobalMessageManager from '../Message/GlobalMessageManager';
import { client } from '../World-client/ClientPackets';
import SpeedTracker from './SpeedTracker';

// This class receives state changes from the local player and notifies other clients via the network.
export default class LocalPlayerSyncer extends ZepetoScriptBehaviour {
  @Header('Threshold')
  @SerializeField()
  @Tooltip(
    'The threshold of change of the rotation of the player to notify the server.',
  )
  private directionThreshold: number;
  private directionThresholdCos: number;
  @SerializeField()
  @Tooltip(
    'The threshold of change of the velocity of the player to notify the server.',
  )
  private velocityThreshold: number;

  @Header('Periodic Sync')
  @SerializeField()
  @Tooltip('Should the periodic sync be used?')
  private usePeriodicSync: boolean;
  @SerializeField()
  @Tooltip('How often should the periodic sync be sent?')
  private periodicSyncInterval: number;

  private lastState = CharacterState.Idle;
  private lastMovementVelocity = Vector3.zero;

  private player: ZepetoPlayer = null;
  private speedTracker: SpeedTracker = null;
  private onStateChangeHandler: (
    to: CharacterState,
    from: CharacterState,
  ) => void = null;
  private periodicSyncCoroutine: Coroutine = null;

  public Awake(): void {
    this.directionThresholdCos = Mathf.Cos(
      this.directionThreshold * Mathf.Deg2Rad,
    );
    this.onStateChangeHandler = this.Sync.bind(this);

    this.enabled = false;
  }

  public Enabled(): void {
    if (this.usePeriodicSync)
      this.periodicSyncCoroutine = this.StartCoroutine(
        this.SyncPeriodically(this.periodicSyncInterval),
      );
  }

  public Disable(): void {
    if (this.periodicSyncCoroutine) {
      this.StopCoroutine(this.periodicSyncCoroutine);
      this.periodicSyncCoroutine = null;
    }
  }

  public OnDestroy(): void {
    if (this.periodicSyncCoroutine)
      this.StopCoroutine(this.periodicSyncCoroutine);
  }

  public FixedUpdate(): void {
    if (this.lastState === CharacterState.Invalid) return;
    if (this.lastState === CharacterState.Idle) return;

    if (!this.player) return;
    if (!this.speedTracker) return;

    const speed = this.speedTracker.speed;
    if (speed < 0.01) return;

    if (this.lastMovementVelocity.sqrMagnitude < 0.0001) {
      Debug.Log('Sync triggered by movement.');
      this.Sync(this.lastState, this.lastState);
      return;
    }

    if (
      Vector3.Dot(
        this.player.character.transform.forward,
        Vector3.Normalize(this.lastMovementVelocity),
      ) <= this.directionThresholdCos
    ) {
      Debug.Log('Sync triggered by direction.');
      this.Sync(this.lastState, this.lastState);
      return;
    }

    if (
      this.velocityThreshold <=
      Mathf.Abs(speed - this.lastMovementVelocity.magnitude)
    ) {
      Debug.Log('Sync triggered by velocity.');
      this.Sync(this.lastState, this.lastState);
      return;
    }
  }

  public HasPlayer(): boolean {
    return !!this.player;
  }

  public PushPlayer(player: ZepetoPlayer): void {
    this.player = player;
    this.speedTracker =
      player.character.gameObject.AddComponent<SpeedTracker>();

    player.character.OnChangedState.AddListener(this.onStateChangeHandler);

    if (this.usePeriodicSync) {
      Debug.Log(
        `Periodic sync is enabled. Interval: ${this.periodicSyncInterval}`,
      );
      this.periodicSyncCoroutine = this.StartCoroutine(
        this.SyncPeriodically(this.periodicSyncInterval),
      );
    }

    this.enabled = true;
  }

  public PopPlayer(): void {
    if (this.player && this.player.character)
      this.player.character.OnChangedState.RemoveListener(
        this.onStateChangeHandler,
      );

    if (this.periodicSyncCoroutine)
      this.StopCoroutine(this.periodicSyncCoroutine);

    this.player = null;
    this.speedTracker = null;
    this.periodicSyncCoroutine = null;

    this.enabled = false;
  }

  public Teleport(position: Vector3, rotation?: Quaternion): void {
    if (!this.player) return;

    const character = this.player.character;
    rotation = rotation ?? character.transform.rotation;

    character.enabled = false;
    character.transform.SetPositionAndRotation(position, rotation);
    character.enabled = true;

    GlobalMessageManager.Instance.sendMessage(
      client.sync.MessageType.SyncCharacterTeleport,
      client.sync.encodeSyncCharacterTeleport({
        position,
        rotation,
      }),
    );

    this.lastState = CharacterState.Idle;
    this.lastMovementVelocity = Vector3.zero;
  }

  private *SyncPeriodically(interval: number) {
    const awaiter = new WaitForSeconds(interval);

    for (;;) {
      yield awaiter;
      Debug.Log(`Sync triggered by periodic sync. State: ${this.lastState}`);
      this.Sync(this.lastState, this.lastState);
    }
  }

  private Sync(to: CharacterState, from: CharacterState): void {
    if (!this.player) return;
    if (!this.speedTracker) return;

    const GetExtraState = ():
      | CharacterMoveState
      | CharacterJumpState
      | CharacterLandingState => {
      if (!this.player.character.MotionV2) return 0;

      if (to === CharacterState.Move)
        return this.player.character.MotionV2.CurrentMoveState;
      if (to === CharacterState.Jump)
        return this.player.character.MotionV2.CurrentJumpState;
      if (to === CharacterState.Landing)
        return this.player.character.MotionV2.CurrentLandingState;

      return 0;
    };
    const transform = this.player.character.transform;

    GlobalMessageManager.Instance.sendMessage(
      client.sync.MessageType.SyncCharacterState,
      client.sync.encodeSyncCharacterState({
        state: to,
        extraState: GetExtraState(),
        position: transform.position,
        rotation: transform.rotation,
        velocity: Vector3.op_Multiply(
          transform.forward,
          this.speedTracker.speed,
        ),
      }),
    );

    this.lastState = to;
    this.lastMovementVelocity = Vector3.op_Multiply(
      this.player.character.transform.forward,
      this.speedTracker.speed,
    );
  }
}
