import { Sandbox, SandboxOptions, SandboxPlayer } from 'ZEPETO.Multiplay';
import { IReceiptMessage } from 'ZEPETO.Multiplay.IWP';

import { client, server } from '../ServerPackets';
import { Module } from './Module';

class PlayerTime {
  public player: SandboxPlayer;
  public offset: number;
  public roundTripDelay: number;
  public t0: number;
  public t3: number;

  constructor(player: SandboxPlayer) {
    this.player = player;
    this.offset = 0;
    this.roundTripDelay = 0;
    this.t0 = 0;
    this.t3 = 0;
  }
}

export class TimeModule implements Module {
  private players = new Map<string, PlayerTime>();

  public OnInit(sandbox: Sandbox, options: SandboxOptions): void {
    if (!sandbox.onMessage) return;

    sandbox.onMessage(
      client.sync.MessageType.SyncTime,
      this.OnSyncTime.bind(this),
    );
  }

  public OnTick(deltaTime: number): void {
    for (const player of this.players.values()) {
      if (Date.now() < player.t0 + 5000) continue;

      player.t0 = Date.now();
      player.player.send(
        server.sync.MessageType.SyncTime,
        server.sync.encodeSyncTime({}),
      );
    }
  }

  public OnPlayerJoin(playerClient: SandboxPlayer): void {
    this.players.set(playerClient.sessionId, new PlayerTime(playerClient));
  }

  public OnPlayerLeave(playerClient: SandboxPlayer, consented?: boolean): void {
    const player = this.players.get(playerClient.sessionId);
    if (!player) {
      return;
    }

    this.players.delete(playerClient.sessionId);
  }

  onPurchased(
    client: SandboxPlayer,
    receipt: IReceiptMessage,
  ): void | Promise<void> {}

  OnSyncTime(playerClient: SandboxPlayer, payload: string): void {
    const t3 = Date.now();
    const player = this.players.get(playerClient.sessionId);
    if (!player) {
      return;
    }

    const packet = client.sync.decodeSyncTime(payload);
    const t0 = player.t0;
    const t1 = packet.t1;
    const t2 = packet.t2;

    player.offset = (t1 - t0 + (t2 - t3)) / 2;
    player.roundTripDelay = t3 - t0 - (t2 - t1);
    player.t3 = t3;
    player.player.send(
      server.sync.MessageType.SyncTimeDiff,
      server.sync.encodeSyncTimeDiff({
        offset: player.offset,
        roundTripDelay: player.roundTripDelay,
      }),
    );
  }
}
