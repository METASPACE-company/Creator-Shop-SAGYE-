import { Sandbox, SandboxOptions, SandboxPlayer } from 'ZEPETO.Multiplay';
import { IReceiptMessage } from 'ZEPETO.Multiplay.IWP';
import { Player, Transform, Vector3 } from 'ZEPETO.Multiplay.Schema';
import { client, server } from '../ServerPackets';
import { Module } from './Module';

export class GestureModule implements Module {
  private sandbox?: Sandbox;

  public OnInit(sandbox: Sandbox, options: SandboxOptions): void {
    this.sandbox = sandbox;

    if (!sandbox.onMessage) return;

    sandbox.onMessage(
      client.gesture.MessageType.PlayGesture,
      this.OnPlayGesture.bind(this),
    );
    sandbox.onMessage(
      client.gesture.MessageType.StopGesture,
      this.OnStopGesture.bind(this),
    );
  }

  public OnTick(deltaTime: number): void {}

  public OnPlayerJoin(playerClient: SandboxPlayer): void {
    if (!this.sandbox) return;

    const player = new Player();
    player.sessionId = playerClient.sessionId;

    if (playerClient.userId) {
      player.zepetoUserId = playerClient.userId;
    }

    player.transform = new Transform();
    player.transform.position = new Vector3();
    player.transform.position.x = 0;
    player.transform.position.y = 0;
    player.transform.position.z = 0;

    player.transform.rotation = new Vector3();
    player.transform.rotation.x = 0;
    player.transform.rotation.y = 0;
    player.transform.rotation.z = 0;

    this.sandbox.state.players.set(playerClient.sessionId, player);
  }

  public OnPlayerLeave(playerClient: SandboxPlayer, consented?: boolean): void {
    if (!this.sandbox) return;

    const player = this.sandbox.state.players.get(playerClient.sessionId);
    if (!player) {
      return;
    }

    this.sandbox.state.players.delete(playerClient.sessionId);
  }

  onPurchased(
    client: SandboxPlayer,
    receipt: IReceiptMessage,
  ): void | Promise<void> {}

  OnPlayGesture(playerClient: SandboxPlayer, payload: string): void {
    if (!this.sandbox) return;
    if (!this.sandbox.broadcast) return;

    const player = this.sandbox.state.players.get(playerClient.sessionId);
    if (!player) {
      return;
    }

    const packet = client.gesture.decodePlayGesture(payload);

    this.sandbox.broadcast(
      server.gesture.MessageType.PlayGesture,
      server.gesture.encodePlayGesture({
        ...packet,
        sessionId: playerClient.sessionId,
      }),
      {
        except: playerClient,
      },
    );
  }

  OnStopGesture(playerClient: SandboxPlayer): void {
    if (!this.sandbox) return;
    if (!this.sandbox.broadcast) return;

    const player = this.sandbox.state.players.get(playerClient.sessionId);
    if (!player) {
      return;
    }

    this.sandbox.broadcast(
      server.gesture.MessageType.StopGesture,
      server.gesture.encodeStopGesture({
        sessionId: playerClient.sessionId,
      }),
      {
        except: playerClient,
      },
    );
  }
}
