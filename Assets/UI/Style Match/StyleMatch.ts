import { AudioClip, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { WorldService, ZepetoWorldContent } from 'ZEPETO.World';

import EventTracker from '../../3D/Tracking/EventTracker';
import i18nManager from '../../i18n/i18nManager';
import PlayerManager from '../../Network/Sync/PlayerManager';
import SEManager from '../../Sfx/SEManager';
import SfxProvider from '../../Sfx/SfxProvider';
import LoadingCover from '../Loading Cover/LoadingCover';
import MenuGroup from '../Menu Group/MenuGroup';
import MiddleMenuGroup from '../Middle Menu Group/MiddleMenuGroup';
import VirtualPadStateManager from '../Virtual Pad/VirtualPadStateManager';
import StyleMatchResultFeed from './StyleMatchResultFeed';
import StyleMatchResultProvider from './StyleMatchResultProvider';
import {
  StyleMatchController,
  StyleMatchResult,
  StyleMatchResultType,
  StyleMatchState,
} from './StyleMatchState';
import { StyleMatch_Start } from './StyleMatchStateImpl';
import StyleMatchUI from './StyleMatchUI';

export default class StyleMatch
  extends ZepetoScriptBehaviour
  implements StyleMatchController
{
  private static instance: StyleMatch;

  public static get Instance(): StyleMatch {
    return StyleMatch.instance;
  }

  @Header('UI')
  @SerializeField()
  private _ui: GameObject;
  @SerializeField()
  private _feed: GameObject;
  @Header('Sfx')
  @SerializeField()
  private sfxOnTransition: AudioClip;
  @SerializeField()
  private sfxOnResult: AudioClip;

  private ui: StyleMatchUI;
  private feed: StyleMatchResultFeed;
  private state?: StyleMatchState;
  private result?: StyleMatchResult;

  public Awake(): void {
    StyleMatch.instance = this;

    this.ui = this._ui.GetComponent<StyleMatchUI>();
    this.feed = this._feed.GetComponent<StyleMatchResultFeed>();

    this.ui.StartYesButton.onClick.AddListener(
      this.OnClickStartButton.bind(this, true),
    );
    this.ui.StartNoButton.onClick.AddListener(
      this.OnClickStartButton.bind(this, false),
    );
    this.ui.Selection1Button.onClick.AddListener(
      this.OnClickSelectionButton.bind(this, 0),
    );
    this.ui.Selection2Button.onClick.AddListener(
      this.OnClickSelectionButton.bind(this, 1),
    );
    this.ui.ResultOkButton.onClick.AddListener(
      this.OnClickResultOkButton.bind(this),
    );
    this.ui.ResultShareButton.onClick.AddListener(
      this.OnClickResultShareButton.bind(this),
    );

    this.feed.gameObject.SetActive(false);
    this.gameObject.SetActive(false);
  }

  public OnEnable(): void {
    this.state = undefined;
    this.result = undefined;
    VirtualPadStateManager.Instance.StyleMatch = true;
    MenuGroup.Instance?.gameObject.SetActive(false);
    MiddleMenuGroup.Instance?.gameObject.SetActive(false);
  }

  public OnDisable(): void {
    VirtualPadStateManager.Instance.StyleMatch = false;
    MenuGroup.Instance?.gameObject.SetActive(true);
    MiddleMenuGroup.Instance?.gameObject.SetActive(true);
  }

  public StartSession(): void {
    this.gameObject.SetActive(true);
    this.ui.ShowStart();
    SEManager.Instance.Play(SfxProvider.Instance.UIPopupShowing);
  }

  public Translate(next: StyleMatchState): void {
    this.state = next;
    this.ui.ApplyState(this.state, false);
    SEManager.Instance.Play(this.sfxOnTransition);
  }

  public Terminate(result: StyleMatchResultType): void {
    this.state = undefined;
    this.result = StyleMatchResultProvider.Instance.GetResult(result);
    this.ui.ApplyResult(this.result, () => {
      SEManager.Instance.Play(this.sfxOnResult);
    });
    SEManager.Instance.Play(this.sfxOnTransition);

    this.ui.ResultShareButton.interactable = true;
  }

  private OnClickStartButton(yes: boolean): void {
    if (!yes) {
      this.gameObject.SetActive(false);
      return;
    }

    this.state = new StyleMatch_Start();
    this.result = undefined;
    this.ui.HideStart();
    this.ui.ApplyState(this.state, true);

    EventTracker.Instance.CountOpenStyleMatch();
  }

  private OnClickSelectionButton(selection: number): void {
    if (!this.state) return;
    this.state.HandleSelection(selection, this);
  }

  private OnClickResultOkButton(): void {
    if (!this.result) return;
    if (WorldService.worldId === 'com.metaspace.shoppingmallsection')
      LoadingCover.Instance.RunWithCover(() => {
        this.gameObject.SetActive(false);
        const points = this.result.TeleportPoints;
        const point = points[Math.floor(Math.random() * points.length)];
        PlayerManager.Instance.LocalSyncer.Teleport(
          point.position,
          point.rotation,
        );
      });
    else
      ZepetoWorldContent.MoveToWorld(
        this.result.WorldId[
          Math.floor(Math.random() * this.result.WorldId.length)
        ],
        () => {},
      );
  }

  private OnClickResultShareButton(): void {
    if (!this.result) return;
    this.ui.ResultShareButton.interactable = false;
    this.feed.SetResult(this.result);
    this.feed.gameObject.SetActive(true);
    this.feed.TakeScreenShot((rt) => {
      this.feed.gameObject.SetActive(false);
      ZepetoWorldContent.CreateFeed(
        rt,
        i18nManager.Instance.Lang['ZM_StyleMatching_Hashtag'],
        () => {},
      );

      // TODO: Give a feedback to the user that notifies the feed has been uploaded.
    });
  }
}
