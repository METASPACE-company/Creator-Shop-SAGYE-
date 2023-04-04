import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import { TMP_Text } from 'TMPro';

import GlobalMessageManager from '../Message/GlobalMessageManager';
import { MessageHandler } from '../Message/MessageHandler';
import { client, server } from '../World-client/ClientPackets';

export default class PlayerTimeManager extends ZepetoScriptBehaviour {
  private static instance: PlayerTimeManager;

  public static get Instance(): PlayerTimeManager {
    return PlayerTimeManager.instance;
  }

  private offset: number;
  private roundTripDelay: number;
  private msgHandler = new MessageHandler();

  @SerializeField()
  private text1: TMP_Text;
  @SerializeField()
  private text2: TMP_Text;

  public get Offset(): number {
    return this.offset;
  }

  public get RoundTripDelay(): number {
    return this.roundTripDelay;
  }

  public Awake(): void {
    this.msgHandler.addHandler(
      server.sync.MessageType.SyncTime,
      this.SyncTime,
      this,
    );
    this.msgHandler.addHandler(
      server.sync.MessageType.SyncTimeDiff,
      this.SyncTimeDiff,
      this,
    );

    this.offset = 0;
    this.roundTripDelay = 0;

    PlayerTimeManager.instance = this;
  }

  private SyncTime(ctx: Room, type: string, payload: string): void {
    const t1 = Date.now();

    GlobalMessageManager.Instance.sendMessage(
      client.sync.MessageType.SyncTime,
      client.sync.encodeSyncTime({
        t1,
        t2: Date.now(),
      }),
    );
  }

  private SyncTimeDiff(ctx: Room, type: string, payload: string): void {
    const packet = server.sync.decodeSyncTimeDiff(payload);

    this.offset = packet.offset;
    this.roundTripDelay = packet.roundTripDelay;

    if (this.text1) this.text1.text = `offset: ${this.offset}ms`;
    if (this.text2)
      this.text2.text = `roundTripDelay: ${this.roundTripDelay}ms`;
  }

  public fromServerTime(time: number): number {
    return time + this.offset;
  }

  public toServerTime(time: number): number {
    return time - this.offset;
  }
}
