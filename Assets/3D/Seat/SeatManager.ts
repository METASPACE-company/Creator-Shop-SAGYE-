import { AnimationClip, GameObject, Transform } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import GlobalMessageManager from '../../Network/Message/GlobalMessageManager';
import { MessageHandler } from '../../Network/Message/MessageHandler';
import LocalPlayer from '../../Network/Sync/LocalPlayer';
import PlayerManager from '../../Network/Sync/PlayerManager';
import { client, server } from '../../Network/World-client/ClientPackets';
import VirtualPadController from '../../UI/Virtual Pad/VirtualPadController';
import WorldButton from '../../UI/WorldButton/WorldButton';
import EventTracker from '../Tracking/EventTracker';
import SeatLocator from './SeatLocator';

export default class SeatManager extends ZepetoScriptBehaviour {
  private static instance: SeatManager;

  public static get Instance(): SeatManager {
    return SeatManager.instance;
  }

  @SerializeField()
  private animation: AnimationClip;
  @SerializeField()
  private seatButtonRoot: Transform;
  @SerializeField()
  private seatButtonPrefab: GameObject;

  private animationOverrides = new Map<string, AnimationClip>();
  private msgHandler = new MessageHandler();

  public Awake(): void {
    SeatManager.instance = this;

    this.msgHandler.addHandler(
      server.seat.MessageType.Seat,
      this.OnMessageSeat.bind(this),
    );
    this.msgHandler.addHandler(
      server.seat.MessageType.Unseat,
      this.OnMessageUnseat.bind(this),
    );

    VirtualPadController.Instance.OnceInitialized((pad) => {
      pad.TouchPad.OnPointerDownEvent.AddListener(() => {
        SeatLocator.ResetAllButton();
        GlobalMessageManager.Instance.sendMessage(
          client.seat.MessageType.Unseat,
          client.seat.encodeUnseat({}),
        );
      });
      pad.JumpButton.onClick.AddListener(() => {
        SeatLocator.ResetAllButton();
        GlobalMessageManager.Instance.sendMessage(
          client.seat.MessageType.Unseat,
          client.seat.encodeUnseat({}),
        );
      });
    });
  }

  public RegisterSeat(
    transform: Transform,
    animationOverride?: AnimationClip,
  ): GameObject {
    const seatButton = GameObject.Instantiate<GameObject>(
      this.seatButtonPrefab,
      this.seatButtonRoot,
    );
    const hash = String(
      animationOverride ? animationOverride.GetHashCode() : '',
    );

    if (animationOverride) this.animationOverrides.set(hash, animationOverride);

    seatButton.GetComponent<Button>().onClick.AddListener(() => {
      PlayerManager.Instance.LocalSyncer.Teleport(
        transform.position,
        transform.rotation,
      );
      LocalPlayer.Instance.ZepetoCharacter.SetGesture(
        animationOverride ?? this.animation,
      );
      GlobalMessageManager.Instance.sendMessage(
        client.seat.MessageType.Seat,
        client.seat.encodeSeat({
          animation: hash ?? '',
        }),
      );
      seatButton.SetActive(false);
      EventTracker.Instance.CountTakeSeat();
    });
    seatButton.GetComponent<WorldButton>().targetTrsf = transform;

    return seatButton;
  }

  private OnMessageSeat(ctx: Room, type: string, payload?: string): void {
    const { animation, userSessionId } = server.seat.decodeSeat(payload);

    if (!ZepetoPlayers.instance.HasPlayer(userSessionId)) return;

    const player = ZepetoPlayers.instance.GetPlayer(userSessionId);
    player.character.SetGesture(
      this.animationOverrides.get(animation) ?? this.animation,
    );
  }

  private OnMessageUnseat(ctx: Room, type: string, payload?: string): void {
    const { userSessionId } = server.seat.decodeSeat(payload);

    if (!ZepetoPlayers.instance.HasPlayer(userSessionId)) return;

    const player = ZepetoPlayers.instance.GetPlayer(userSessionId);
    player.character.CancelGesture();
  }
}
