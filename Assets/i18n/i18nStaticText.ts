import { Text } from 'UnityEngine.UI';

import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import { TMP_Text } from 'TMPro';

import i18nManager from './i18nManager';

export default class i18nStaticText extends ZepetoScriptBehaviour {
  @SerializeField()
  private key: string;
  @SerializeField()
  private isTemplate: boolean;

  public Start(): void {
    const uiText = this.GetComponent<Text>();
    const tmpText = this.GetComponent<TMP_Text>();

    i18nManager.Instance.Event.OnChange((lang) => {
      let str: string;

      if (this.isTemplate)
        str = this.key.replace(/@(\w+)@/g, (match, key) => lang[key]);
      else {
        str = lang[this.key];
        if (!str) return;
      }

      if (uiText) uiText.text = str;
      if (tmpText) tmpText.text = str;
    });
  }
}
