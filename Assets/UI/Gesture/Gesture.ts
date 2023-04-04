import { AnimationClip, GameObject, RenderTexture } from 'UnityEngine';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Content, OfficialContentType, ZepetoWorldContent } from 'ZEPETO.World';

import GlobalMessageManager from '../../Network/Message/GlobalMessageManager';
import { MessageHandler } from '../../Network/Message/MessageHandler';
import LocalPlayer from '../../Network/Sync/LocalPlayer';
import PlayerManager from '../../Network/Sync/PlayerManager';
import { client, server } from '../../Network/World-client/ClientPackets';
import SEManager from '../../Sfx/SEManager';
import SfxProvider from '../../Sfx/SfxProvider';
import VirtualPadController from '../Virtual Pad/VirtualPadController';
import GestureCamera from './GestureCamera';
import GesturePlayer from './GesturePlayer';
import GestureUI from './GestureUI';

export default class Gesture extends ZepetoScriptBehaviour {
  private static instance: Gesture;

  public static get Instance(): Gesture {
    return Gesture.instance;
  }

  @Header('UI')
  @SerializeField()
  private _ui: GameObject;
  @Header('System')
  @SerializeField()
  private _camera: GameObject;

  private ui: GestureUI;
  private camera: GestureCamera;
  private prepared = false;
  private contents: Content[];
  private animations: AnimationClip[];
  private msgHandler = new MessageHandler();

  public get UI(): GestureUI {
    return this.ui;
  }

  public get IsPrepared(): boolean {
    return this.prepared;
  }

  public get Contents(): Content[] {
    return this.contents;
  }

  public Awake(): void {
    Gesture.instance = this;
    this.ui = this._ui.GetComponent<GestureUI>();
    this.camera = this._camera.GetComponent<GestureCamera>();

    this.msgHandler.addHandler(
      server.gesture.MessageType.PlayGesture,
      this.OnPlayGesture.bind(this),
    );
  }

  public async Prepare(character: LocalPlayer): Promise<void> {
    VirtualPadController.Instance.OnceInitialized((pad) => {
      pad.TouchPad.OnPointerDownEvent.AddListener(() => {
        character.ZepetoCharacter.CancelGesture();
      });
      pad.JumpButton.onClick.AddListener(() => {
        character.ZepetoCharacter.CancelGesture();
      });
    });

    const contents = (
      await Promise.all([
        // new Promise<Content[]>((resolve) =>
        //   ZepetoWorldContent.RequestOfficialContentList(
        //     OfficialContentType.Gesture,
        //     resolve,
        //   ),
        // ),
        new Promise<Content[]>((resolve) =>
          ZepetoWorldContent.RequestOfficialContentList(
            OfficialContentType.Pose,
            resolve,
          ),
        ),
      ])
    ).flat();
    contents.sort((a, b) => a.Id.localeCompare(b.Id));

    const [player, animations] = await Promise.all([
      GesturePlayer.Spawn(character.UserId),
      Promise.all(
        contents.map(async (content) => {
          if (!content.IsDownloadedAnimation)
            await new Promise<void>((resolve) =>
              content.DownloadAnimation(resolve),
            );

          return content.AnimationClip;
        }),
      ),
    ]);
    const thumbnails = await new Promise<RenderTexture[]>((resolve) =>
      this.camera.Capture(player, animations, resolve),
    );

    player.Deactivate();

    for (let index = 0; index < animations.length; ++index) {
      const slot = this.ui.AppendSlot(thumbnails[index], contents[index].Id);
      slot.Button.onClick.AddListener(() => {
        GlobalMessageManager.Instance.sendMessage(
          client.gesture.MessageType.PlayGesture,
          client.gesture.encodePlayGesture({
            gesture: index,
          }),
        );
        character.ZepetoCharacter.SetGesture(animations[index]);
        SEManager.Instance.Play(SfxProvider.Instance.UIClick);
      });
    }

    this.contents = contents;
    this.animations = animations;
    this.prepared = true;
  }

  private OnPlayGesture(ctx: Room, type: string, payload: string): void {
    const packet = server.gesture.decodePlayGesture(payload);
    if (!PlayerManager.Instance.RemoteSyncer.HasPlayer(packet.sessionId))
      return;
    const player = PlayerManager.Instance.RemoteSyncer.GetPlayer(
      packet.sessionId,
    );
    player.character.SetGesture(this.animations[packet.gesture]);
  }
}
