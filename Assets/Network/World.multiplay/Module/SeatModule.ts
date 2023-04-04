import { Sandbox, SandboxOptions, SandboxPlayer } from 'ZEPETO.Multiplay';
import { IReceiptMessage } from 'ZEPETO.Multiplay.IWP';
import { client, server } from '../ServerPackets';
import { Module } from './Module';

export class SeatModule implements Module {
  private sandbox?: Sandbox;

  public OnInit(sandbox: Sandbox, options: SandboxOptions): void {
    this.sandbox = sandbox;

    if (!sandbox.onMessage) return;

    sandbox.onMessage(client.seat.MessageType.Seat, this.OnSeat.bind(this));
    sandbox.onMessage(client.seat.MessageType.Unseat, this.OnUnseat.bind(this));
  }

  public OnTick(deltaTime: number): void {}

  public OnPlayerJoin(playerClient: SandboxPlayer): void {}

  public OnPlayerLeave(
    playerClient: SandboxPlayer,
    consented?: boolean,
  ): void {}

  onPurchased(
    client: SandboxPlayer,
    receipt: IReceiptMessage,
  ): void | Promise<void> {}

  OnSeat(playerClient: SandboxPlayer, payload: string): void {
    if (!this.sandbox) return;
    if (!this.sandbox.broadcast) return;

    const { animation } = client.seat.decodeSeat(payload);

    this.sandbox.broadcast(
      server.seat.MessageType.Seat,
      server.seat.encodeSeat({
        animation,
        userSessionId: playerClient.sessionId,
      }),
      {
        except: playerClient,
      },
    );
  }

  OnUnseat(playerClient: SandboxPlayer, payload: string): void {
    if (!this.sandbox) return;
    if (!this.sandbox.broadcast) return;

    this.sandbox.broadcast(
      server.seat.MessageType.Unseat,
      server.seat.encodeUnseat({
        userSessionId: playerClient.sessionId,
      }),
      {
        except: playerClient,
      },
    );
  }
}
