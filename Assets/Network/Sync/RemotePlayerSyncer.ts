import { Animator, Time, Vector3 } from 'UnityEngine';

import {
  CharacterJumpState,
  CharacterState,
  ZepetoPlayer,
} from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import { MessageHandler } from '../Message/MessageHandler';
import { server } from '../World-client/ClientPackets';
import { ClientQuaternionSyncer } from './ClientQuaternionSyncer';
import { ClientVector3Syncer } from './ClientVector3Syncer';

export default class RemotePlayerSyncer extends ZepetoScriptBehaviour {
  @Header('Synchronization')
  @SerializeField()
  @Tooltip('The time it takes to synchronize the position.')
  private positionSyncTime: number;
  @SerializeField()
  @Tooltip('The time it takes to synchronize the rotation.')
  private rotationSyncTime: number;
  @SerializeField()
  @Tooltip(
    'Additional acceleration multiplier to use to compensate for the time it takes to synchronize position if position changes while moving.',
  )
  private positionBoostRate: number;

  private msgHandler = new MessageHandler();
  private players: Map<string, SyncingPlayer> = new Map();

  public Awake(): void {
    this.msgHandler.addHandler(
      server.sync.MessageType.SyncCharacterState,
      this.SyncCharacterState,
      this,
    );
    this.msgHandler.addHandler(
      server.sync.MessageType.SyncCharacterTeleport,
      this.SyncCharacterTeleport,
      this,
    );
  }

  public FixedUpdate(): void {
    this.players.forEach((player) => {
      if (player.syncers) {
        player.player.character.enabled = false;
        player.player.character.transform.SetPositionAndRotation(
          player.syncers[0].update(),
          player.syncers[1].update(),
        );
        player.player.character.enabled = true;

        if (player.syncers[0].isDone() && player.syncers[1].isDone())
          player.syncers = null;
      } else if (player.velocity) {
        const destination = Vector3.op_Addition(
          player.player.character.transform.position,
          Vector3.op_Multiply(player.velocity, Time.deltaTime),
        );

        // TODO: Compensate the time it takes to synchronize position by the syncers.

        player.player.character.enabled = false;
        player.player.character.transform.position = destination;
        player.player.character.enabled = true;
      }
    });
  }

  public HasPlayer(sessionId: string): boolean {
    return this.players.has(sessionId);
  }

  public GetPlayer(sessionId: string): ZepetoPlayer {
    return this.players.get(sessionId).player;
  }

  public PushPlayer(sessionId: string, player: ZepetoPlayer): void {
    const animator = player.character.GetComponentInChildren<Animator>();
    animator.SetFloat('MotionSpeed', 1);

    this.players.set(sessionId, new SyncingPlayer(player));
  }

  public PopPlayer(sessionId: string): void {
    const player = this.players.get(sessionId);
    if (!player) return;
    this.players.delete(sessionId);
  }

  private SyncCharacterState(ctx: Room, type: string, payload: string): void {
    const packet = server.sync.decodeSyncCharacterState(payload);
    const player = this.players.get(packet.sessionId);
    if (!player) return;
    if (player.player.isLocalPlayer) return;

    player.player.character.ChangeStateAnimation(
      packet.state,
      packet.extraState as any,
    );

    if (
      packet.state === CharacterState.Walk ||
      packet.state === CharacterState.Run ||
      packet.state === CharacterState.Move
    ) {
      // Do nothing.
    } else if (
      packet.state === CharacterState.JumpIdle ||
      packet.state === CharacterState.JumpMove ||
      packet.state === CharacterState.Jump
    ) {
      if (packet.extraState === CharacterJumpState.JumpDouble)
        player.player.character.DoubleJump();
      else player.player.character.Jump();
    }

    player.syncers = [
      new ClientVector3Syncer(
        player.player.character.transform.position,
        packet.position,
        this.positionSyncTime,
      ),
      new ClientQuaternionSyncer(
        player.player.character.transform.rotation,
        packet.rotation,
        this.rotationSyncTime,
      ),
    ];
    player.velocity = packet.velocity;
  }

  private SyncCharacterTeleport(
    ctx: Room,
    type: string,
    payload: string,
  ): void {
    const packet = server.sync.decodeSyncCharacterTeleport(payload);
    const player = this.players.get(packet.sessionId);
    if (!player) return;
    if (player.player.isLocalPlayer) return;

    player.player.character.ChangeStateAnimation(CharacterState.Idle);
    player.player.character.enabled = false;
    player.player.character.transform.SetPositionAndRotation(
      packet.position,
      packet.rotation,
    );
    player.syncers = null;
    player.velocity = null;
  }
}

class SyncingPlayer {
  public player: ZepetoPlayer;
  public syncers: [ClientVector3Syncer, ClientQuaternionSyncer] | null;
  public velocity: Vector3 | null;

  constructor(player: ZepetoPlayer) {
    this.player = player;
    this.syncers = null;
    this.velocity = null;
  }
}
