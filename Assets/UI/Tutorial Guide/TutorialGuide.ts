import { TMP_Text } from 'TMPro';
import { Color, Sprite } from 'UnityEngine';
import { Button, Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import EventTracker from '../../3D/Tracking/EventTracker';
import i18nManager from '../../i18n/i18nManager';
import { LangKeySet } from '../../i18n/lang/_Lang';

export default class TutorialGuide extends ZepetoScriptBehaviour {
  private static instance: TutorialGuide;

  public static get Instance(): TutorialGuide {
    return TutorialGuide.instance;
  }
  @Header('UI')
  @SerializeField()
  private buttons: Button[];
  private buttonLabels: TMP_Text[];
  @SerializeField()
  private image: Image;
  @SerializeField()
  private text: TMP_Text;
  @Header('Color')
  @SerializeField()
  private buttonLabelColor_Selected: Color;
  @SerializeField()
  private buttonLabelColor_Unselected: Color;
  @Header('Contents')
  @SerializeField()
  private images: Sprite[];
  @SerializeField()
  private texts: string[];

  private lang: LangKeySet;
  private selectedIndex = 0;

  public Awake(): void {
    TutorialGuide.instance = this;
    this.buttonLabels = this.buttons.map((button) =>
      button.GetComponentInChildren<TMP_Text>(),
    );

    for (let index = 0; index < this.buttons.length; ++index)
      this.buttons[index].onClick.AddListener(() => {
        this.SetButton(index);
      });
  }

  public Start(): void {
    i18nManager.Instance.Event.OnChange((lang) => {
      this.lang = lang;
      this.UpdateButtonLabel();
    });
  }

  public OnEnable(): void {
    this.SetButton(0);
    if (EventTracker.Instance) EventTracker.Instance.CountOpenTutorial();
  }

  public SetButton(selectedIndex: number): void {
    for (let index = 0; index < this.buttons.length; ++index) {
      this.buttons[index].interactable = index !== selectedIndex;
      this.buttonLabels[index].color =
        index === selectedIndex
          ? this.buttonLabelColor_Selected
          : this.buttonLabelColor_Unselected;
    }

    this.selectedIndex = selectedIndex;
    this.image.sprite = this.images[selectedIndex];
    this.UpdateButtonLabel();
  }

  private UpdateButtonLabel(): void {
    if (this.lang) this.text.text = this.lang[this.texts[this.selectedIndex]];
  }
}
