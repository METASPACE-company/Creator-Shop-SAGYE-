import { Animator, WaitForSeconds, WaitUntil } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import LocalPlayer from '../../Network/Sync/LocalPlayer';
import GlobalCoroutineManager from '../../Utility/GlobalCoroutineManager';

export default class LoadingCover extends ZepetoScriptBehaviour {
  private static TRIGGER_REVEAL = Animator.StringToHash('reveal');
  private static TRIGGER_UNREVEAL = Animator.StringToHash('unreveal');
  private static instance: LoadingCover;

  public static get Instance(): LoadingCover {
    return LoadingCover.instance;
  }

  private animator: Animator;

  public Awake(): void {
    LoadingCover.instance = this;
    this.animator = this.GetComponent<Animator>();
  }

  public Start(): void {
    GlobalCoroutineManager.Instance.Execute(
      function* () {
        // Make sure that the local player has been spawned.
        yield new WaitUntil(() => !!LocalPlayer.Instance);

        // Wait for the gestures to be prepared.
        // yield new WaitUntil(() => Gesture.Instance.IsPrepared);

        // Reveal in-game screen gently.
        yield new WaitForSeconds(2);
        this.Reveal();
      }.bind(this),
    );
  }

  public Reveal(): void {
    this.animator.SetTrigger(LoadingCover.TRIGGER_REVEAL);
    GlobalCoroutineManager.Instance.RunAfter(1, () => {
      this.gameObject.SetActive(false);
    });
  }

  public Unreveal(): void {
    this.gameObject.SetActive(true);
    this.animator.SetTrigger(LoadingCover.TRIGGER_UNREVEAL);
  }

  public RunWithCover(f: Function): void {
    this.Unreveal();
    GlobalCoroutineManager.Instance.RunAfter(1, () => {
      f();
      GlobalCoroutineManager.Instance.RunAfter(1, () => {
        this.Reveal();
      });
    });
  }
}
