import { TMP_Text } from 'TMPro';
import { Animator, GameObject } from 'UnityEngine';
import { Button, Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import i18nManager from '../../i18n/i18nManager';
import GlobalCoroutineManager from '../../Utility/GlobalCoroutineManager';
import { StyleMatchResult, StyleMatchState } from './StyleMatchState';

export default class StyleMatchUI extends ZepetoScriptBehaviour {
  public static Instance: StyleMatchUI;

  private static TRIGGER_SHOW = Animator.StringToHash('show');
  private static TRIGGER_HIDE = Animator.StringToHash('hide');

  @Header('Start UI')
  @SerializeField()
  private startUI: GameObject;
  @SerializeField()
  private startYesButton: Button;
  @SerializeField()
  private startNoButton: Button;

  @Header('State UI')
  @SerializeField()
  private stateUI: GameObject;
  @SerializeField()
  private dialogueText: TMP_Text;
  @SerializeField()
  private selection1Button: Button;
  @SerializeField()
  private selection1Text: TMP_Text;
  @SerializeField()
  private selection2Button: Button;
  @SerializeField()
  private selection2Text: TMP_Text;

  @Header('Result UI')
  @SerializeField()
  private resultUI: GameObject;
  @SerializeField()
  private resultBGImage: Image;
  @SerializeField()
  private resultTitleText: TMP_Text;
  @SerializeField()
  private resultSubTitleText: TMP_Text;
  @SerializeField()
  private resultTypoImage: Image;
  @SerializeField()
  private resultDescriptionText: TMP_Text;
  @SerializeField()
  private resultOkButton: Button;
  @SerializeField()
  private resultShareButton: Button;

  private stateAnimator: Animator;
  private resultAnimator: Animator;

  public get StartYesButton(): Button {
    return this.startYesButton;
  }

  public get StartNoButton(): Button {
    return this.startNoButton;
  }

  public get Selection1Button(): Button {
    return this.selection1Button;
  }

  public get Selection2Button(): Button {
    return this.selection2Button;
  }

  public get ResultOkButton(): Button {
    return this.resultOkButton;
  }

  public get ResultShareButton(): Button {
    return this.resultShareButton;
  }

  public Awake(): void {
    StyleMatchUI.Instance = this;

    this.stateAnimator = this.stateUI.GetComponent<Animator>();
    this.resultAnimator = this.resultUI.GetComponent<Animator>();
  }

  public ShowStart(): void {
    this.startUI.SetActive(true);
    this.stateUI.SetActive(false);
    this.resultUI.SetActive(false);
  }

  public HideStart(): void {
    this.startUI.SetActive(false);
  }

  public ApplyState(state: StyleMatchState, isFirst: boolean): void {
    if (isFirst) {
      this.stateUI.SetActive(true);
      this.resultUI.SetActive(false);
      this.dialogueText.text = i18nManager.Instance.Lang[state.dialogue];
      this.selection1Text.text =
        i18nManager.Instance.Lang[state.selectionLabel1];
      this.selection2Text.text =
        i18nManager.Instance.Lang[state.selectionLabel2];
      this.stateAnimator.SetTrigger(StyleMatchUI.TRIGGER_SHOW);
      return;
    }

    this.stateAnimator.SetTrigger(StyleMatchUI.TRIGGER_HIDE);
    GlobalCoroutineManager.Instance.RunAfter(1.5, () => {
      this.dialogueText.text = i18nManager.Instance.Lang[state.dialogue];
      this.selection1Text.text =
        i18nManager.Instance.Lang[state.selectionLabel1];
      this.selection2Text.text =
        i18nManager.Instance.Lang[state.selectionLabel2];
      this.stateAnimator.SetTrigger(StyleMatchUI.TRIGGER_SHOW);
    });
  }

  public ApplyResult(result: StyleMatchResult, onShowCallback: Function): void {
    this.resultBGImage.sprite = result.ResultBGSprite;
    this.resultTitleText.text =
      i18nManager.Instance.Lang[result.ResultTitleText];
    this.resultTypoImage.sprite = result.ResultTypoSprite;
    this.resultSubTitleText.text =
      i18nManager.Instance.Lang['ZM_StyleMatching_Title_recommend'];
    this.resultDescriptionText.text =
      i18nManager.Instance.Lang[result.ResultDescText];

    this.stateAnimator.SetTrigger(StyleMatchUI.TRIGGER_HIDE);
    GlobalCoroutineManager.Instance.RunAfter(1.5, () => {
      this.stateUI.SetActive(false);
      this.resultUI.SetActive(true);
      this.resultAnimator.SetTrigger(StyleMatchUI.TRIGGER_SHOW);
      onShowCallback();
    });
  }
}
