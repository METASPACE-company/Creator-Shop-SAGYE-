import {
  Mannequin,
  MannequinComponent,
  MannequinPreviewer,
} from 'ZEPETO.Mannequin';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import EventTracker from '../../3D/Tracking/EventTracker';
import LocalPlayer from '../../Network/Sync/LocalPlayer';

export default class MannequinOpener extends ZepetoScriptBehaviour {
  private static previewer: MannequinPreviewer | null;

  public Start(): void {
    const mannequin = this.GetComponent<MannequinComponent>();
    mannequin.onActive.AddListener((contents) => {
      EventTracker.Instance.CountOpenMannequin();
      Mannequin.OpenUI(contents);
      MannequinOpener.previewer?.ResetContents();
      MannequinOpener.previewer = new MannequinPreviewer(
        LocalPlayer.Instance.ZepetoCharacter.Context,
        contents,
      );
      MannequinOpener.previewer.PreviewContents();
    });
    mannequin.onCancel.AddListener(() => {
      Mannequin.CloseUI();
      MannequinOpener.previewer?.ResetContents();
      MannequinOpener.previewer = null;
    });
  }
}
