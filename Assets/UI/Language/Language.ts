import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import { Language as LanguageEnum } from '../../i18n/i18n';
import i18nManager from '../../i18n/i18nManager';

export default class Language extends ZepetoScriptBehaviour {
  @SerializeField()
  private buttons: Button[];

  public Awake(): void {
    this.buttons[0].onClick.AddListener(
      this.OnClickButton.bind(this, this.buttons[0], LanguageEnum.English),
    );
    this.buttons[1].onClick.AddListener(
      this.OnClickButton.bind(this, this.buttons[1], LanguageEnum.Japanese),
    );
    this.buttons[2].onClick.AddListener(
      this.OnClickButton.bind(this, this.buttons[2], LanguageEnum.Korean),
    );
    this.buttons[3].onClick.AddListener(
      this.OnClickButton.bind(this, this.buttons[3], LanguageEnum.Thai),
    );
    this.buttons[4].onClick.AddListener(
      this.OnClickButton.bind(this, this.buttons[4], LanguageEnum.Indonesian),
    );
  }

  public OnEnable(): void {
    let index: number;

    switch (i18nManager.Instance.Language) {
      case LanguageEnum.English:
        index = 0;
        break;
      case LanguageEnum.Japanese:
        index = 1;
        break;
      case LanguageEnum.Korean:
        index = 2;
        break;
      case LanguageEnum.Thai:
        index = 3;
        break;
      case LanguageEnum.Indonesian:
        index = 4;
        break;
    }

    this.OnClickButton(this.buttons[index], i18nManager.Instance.Language);
  }

  private OnClickButton(button: Button, language: LanguageEnum): void {
    for (let button of this.buttons) button.interactable = true;
    button.interactable = false;
    i18nManager.Instance.SetLanguage(language);
  }
}
