import { GameObject, Quaternion, Vector3 } from 'UnityEngine';

import {
  LocalPlayer,
  SpawnInfo,
  ZepetoPlayer,
  ZepetoPlayers,
} from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import { Player, State } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

import VirtualPadController from '../../UI/Virtual Pad/VirtualPadController';
import LocalPlayerSyncer from './LocalPlayerSyncer';
import RemotePlayerSyncer from './RemotePlayerSyncer';

export type PlayerSpawnFilter = (
  sessionId: string,
  userId: string,
  isLocal: boolean,
) => boolean;
export type LocalPlayerHook = (player: LocalPlayer, sessionId: string) => void;
export type RemotePlayerHook = (
  player: ZepetoPlayer,
  sessionId: string,
) => void;
export type RemovedPlayerHook = (sessionId: string) => void;

export enum PlayerSpawnState {
  SpawnRequested,
  Spawned,
  DespawnRequested,
}

// This class integrates the zepeto character systems with the our synchronization system.
export default class PlayerManager extends ZepetoScriptBehaviour {
  private static instance: PlayerManager;
  @SerializeField()
  private multiplay: ZepetoWorldMultiplay;
  private room: Room;
  @SerializeField()
  private _localSyncer: GameObject;
  private localSyncer: LocalPlayerSyncer;
  @SerializeField()
  private _remoteSyncer: GameObject;
  private remoteSyncer: RemotePlayerSyncer;

  // Fields.
  private enableSpawning = false;
  private players = new Map<string, PlayerSpawnState>();

  // Hooks.
  private onStateChangeHandler: (state: State, isFirst: boolean) => void;
  private spawnFilters: PlayerSpawnFilter[] = [];
  private addedLocalPlayerHooks: LocalPlayerHook[] = [];
  private removedLocalPlayerHooks: RemovedPlayerHook[] = [];
  private addedRemotePlayerHooks: RemotePlayerHook[] = [];
  private removedRemotePlayerHooks: RemovedPlayerHook[] = [];

  public static get Instance(): PlayerManager {
    return PlayerManager.instance;
  }

  public get LocalSyncer(): LocalPlayerSyncer {
    return this.localSyncer;
  }

  public get RemoteSyncer(): RemotePlayerSyncer {
    return this.remoteSyncer;
  }

  public Awake(): void {
    this.onStateChangeHandler = this.OnRoomStateChanged.bind(this);

    this.localSyncer = this._localSyncer.GetComponent<LocalPlayerSyncer>();
    this.remoteSyncer = this._remoteSyncer.GetComponent<RemotePlayerSyncer>();

    PlayerManager.instance = this;
  }

  public Start(): void {
    ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
      // Below logic is required for the case that user requested despawn a user that are not available yet.
      if (
        !this.players.has(this.room.SessionId) ||
        this.players.get(this.room.SessionId) ===
          PlayerSpawnState.DespawnRequested
      ) {
        this.players.set(this.room.SessionId, PlayerSpawnState.Spawned);
        this.DespawnPlayer(this.room.SessionId);
        return;
      }

      this.players.set(this.room.SessionId, PlayerSpawnState.Spawned);

      const player = ZepetoPlayers.instance.LocalPlayer;
      this.localSyncer.PushPlayer(player.zepetoPlayer);

      for (const hook of this.addedLocalPlayerHooks)
        hook(player, this.room.SessionId);
    });
    ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId) => {
      if (sessionId === this.room.SessionId) return;
      if (
        sessionId.startsWith('__NPC__') ||
        sessionId.startsWith('__GESTURE_MODEL__')
      ) {
        for (const hook of this.addedRemotePlayerHooks)
          hook(ZepetoPlayers.instance.GetPlayer(sessionId), sessionId);
        return;
      }

      if (
        !this.players.has(sessionId) ||
        this.players.get(sessionId) === PlayerSpawnState.DespawnRequested
      ) {
        this.players.set(sessionId, PlayerSpawnState.Spawned);
        this.DespawnPlayer(sessionId);
        return;
      }

      this.players.set(sessionId, PlayerSpawnState.Spawned);

      const player = ZepetoPlayers.instance.GetPlayer(sessionId);
      this.remoteSyncer.PushPlayer(sessionId, player);

      for (const hook of this.addedRemotePlayerHooks) hook(player, sessionId);
    });
    ZepetoPlayers.instance.OnRemovedPlayer.AddListener((sessionId) => {
      this.players.delete(sessionId);

      if (sessionId === this.room.SessionId) {
        this.localSyncer.PopPlayer();
        for (const hook of this.removedLocalPlayerHooks) hook(sessionId);
      } else {
        this.remoteSyncer.PopPlayer(sessionId);
        for (const hook of this.removedRemotePlayerHooks) hook(sessionId);
      }
    });

    this.multiplay.add_RoomJoined((room: Room) => {
      this.room = room;
      this.room.add_OnStateChange(this.onStateChangeHandler);
    });
  }

  public SpawnPlayerAll(): void {
    this.room.State.players.ForEach((sessionId, player) => {
      this.SpawnPlayer(player);
    });
  }

  public SpawnPlayer(player: Player): void {
    if (
      this.players.get(player.sessionId) === PlayerSpawnState.SpawnRequested ||
      this.players.get(player.sessionId) === PlayerSpawnState.Spawned
    )
      return;

    // We must test spawn filters eailer than despawn requests.
    if (
      !this.spawnFilters.every((filter) =>
        filter(
          player.sessionId,
          player.zepetoUserId,
          player.sessionId === this.room.SessionId,
        ),
      )
    )
      return;

    if (
      this.players.get(player.sessionId) === PlayerSpawnState.DespawnRequested
    ) {
      this.players.set(player.sessionId, PlayerSpawnState.SpawnRequested);
      return;
    }

    this.players.set(player.sessionId, PlayerSpawnState.SpawnRequested);

    const position = player.transform.position;
    const rotation = player.transform.rotation;

    const spawnInfo = new SpawnInfo();
    spawnInfo.position = new Vector3(position.x, position.y, position.z);
    spawnInfo.rotation = Quaternion.Euler(
      new Vector3(rotation.x, rotation.y, rotation.z),
    );

    ZepetoPlayers.instance.CreatePlayerWithUserId(
      player.sessionId,
      player.zepetoUserId,
      spawnInfo,
      this.room.SessionId === player.sessionId,
    );
  }

  public DespawnPlayerAll(): void {
    this.room.State.players.ForEach((sessionId) => {
      this.DespawnPlayer(sessionId);
    });
  }

  public DespawnPlayer(sessionId: string): void {
    // The given player is not mentioned at all. Ignore it.
    if (!this.players.has(sessionId)) return;

    // The given player is not yet spawned. Ignore it, hooks above will call this function again when the player is spawned.
    if (this.players.get(sessionId) !== PlayerSpawnState.Spawned) return;

    if (ZepetoPlayers.instance.HasPlayer(sessionId)) {
      if (sessionId === this.room.SessionId)
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.enabled = false;

      ZepetoPlayers.instance.RemovePlayer(sessionId);
    }

    this.players.delete(sessionId);

    if (sessionId === this.room.SessionId) {
      // NOTE: We have to delete some objects that are managed by the ZEPETO.
      const localPlayer = GameObject.Find('LocalPlayer');
      const playerControl = GameObject.Find('ZepetoPlayerControl');
      const cameraControl = GameObject.Find('ZepetoCameraControl');
      // const pad = GameObject.Find("UIZepetoPlayerControl"); // We cannot find the pad by GameObject.Find, because the pad may inactivated.
      const pad = VirtualPadController.RawInstance?.gameObject;

      if (localPlayer) GameObject.Destroy(localPlayer);
      if (playerControl) GameObject.Destroy(playerControl);
      if (cameraControl) GameObject.Destroy(cameraControl);
      if (pad) GameObject.Destroy(pad);

      // We have to detach the virtual pad instance if any.
      VirtualPadController.Detach();
    }
  }

  public SetSpawning(enable: boolean): void {
    if (this.enableSpawning === enable) return;
    this.enableSpawning = enable;

    if (!this.enableSpawning) return;
    if (!this.room) return;

    this.room.State.players.ForEach((sessionId, player) => {
      this.SpawnPlayer(player);
    });
  }

  public AddPlayerSpawnFilter(filter: PlayerSpawnFilter): void {
    this.spawnFilters.push(filter);
  }

  public AddAddedLocalPlayerHook(hook: LocalPlayerHook): void {
    this.addedLocalPlayerHooks.push(hook);
  }

  public RemoveAddedLocalPlayerHook(hook: LocalPlayerHook): void {
    const index = this.addedLocalPlayerHooks.findIndex((h) => h === hook);
    if (index < 0) return;
    this.addedLocalPlayerHooks.splice(index, 1);
  }

  public OnceAddedLocalPlayerHook(hook: LocalPlayerHook): void {
    const onceHook: LocalPlayerHook = (player, sessionId) => {
      hook(player, sessionId);
      this.RemoveAddedLocalPlayerHook(onceHook);
    };
    this.addedLocalPlayerHooks.push(onceHook);
  }

  public AddRemovedLocalPlayerHook(hook: RemovedPlayerHook): void {
    this.removedLocalPlayerHooks.push(hook);
  }

  public AddAddedRemotePlayerHook(hook: RemotePlayerHook): void {
    this.addedRemotePlayerHooks.push(hook);
  }

  public RemoveAddedRemotePlayerHook(hook: RemotePlayerHook): void {
    const index = this.addedRemotePlayerHooks.findIndex((h) => h === hook);
    if (index < 0) return;
    this.addedRemotePlayerHooks.splice(index, 1);
  }

  public OnceAddedRemotePlayerHook(hook: RemotePlayerHook): void {
    const onceHook: RemotePlayerHook = (player, sessionId) => {
      hook(player, sessionId);
      this.RemoveAddedRemotePlayerHook(onceHook);
    };
    this.addedRemotePlayerHooks.push(onceHook);
  }

  public AddRemovedRemotePlayerHook(hook: RemovedPlayerHook): void {
    this.removedRemotePlayerHooks.push(hook);
  }

  private OnRoomStateChanged(state: State, isFirst: boolean): void {
    if (!isFirst) return;

    state.players.add_OnAdd((player) => {
      if (this.enableSpawning) this.SpawnPlayer(player);
    });
    state.players.add_OnRemove((player) => {
      this.DespawnPlayer(player.sessionId);
    });

    if (this.enableSpawning) this.SpawnPlayerAll();

    this.room.remove_OnStateChange(this.onStateChangeHandler);
  }
}
