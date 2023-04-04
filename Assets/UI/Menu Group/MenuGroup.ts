import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import StyleMatch from '../Style Match/StyleMatch';
import TutorialGuide from '../Tutorial Guide/TutorialGuide';

export default class MenuGroup extends ZepetoScriptBehaviour {
  private static instance: MenuGroup;

  public static get Instance(): MenuGroup {
    return MenuGroup.instance;
  }

  @Header('UI')
  @SerializeField()
  private guide: Button;
  @SerializeField()
  private styleMatch: Button;

  public Awake(): void {
    MenuGroup.instance = this;
    this.guide.onClick.AddListener(() => {
      TutorialGuide.Instance.gameObject.SetActive(true);
    });
    this.styleMatch.onClick.AddListener(() => {
      StyleMatch.Instance.StartSession();
    });
  }
}
