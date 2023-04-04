import { TMP_Text } from 'TMPro';
import { Texture } from 'UnityEngine';
import { Button, RawImage } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import i18nManager from '../../i18n/i18nManager';

export default class GestureUISlot extends ZepetoScriptBehaviour {
  @SerializeField()
  private thumbnail: RawImage;
  @SerializeField()
  private button: Button;
  @SerializeField()
  private label: TMP_Text;

  private labelText: string;

  public get Button(): Button {
    return this.button;
  }

  public OnEnable(): void {
    i18nManager.Instance.Event.OnChange((lang) => {
      if (this.labelText) this.label.text = lang[this.labelText];
    });
  }

  public Activate(thumbnail: Texture, labelText: string): void {
    this.thumbnail.texture = thumbnail;
    this.label.text = i18nManager.Instance.Lang[labelText];
    this.labelText = labelText;
  }
}
