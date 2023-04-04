import { AudioClip, AudioSource } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class SEManager extends ZepetoScriptBehaviour {
  private static instance: SEManager;

  public static get Instance(): SEManager {
    return SEManager.instance;
  }

  private source: AudioSource;

  public Awake(): void {
    SEManager.instance = this;

    this.source = this.GetComponent<AudioSource>();
  }

  public Play(sfx: AudioClip, volumeScale = 1): void {
    this.source.PlayOneShot(sfx, volumeScale);
  }
}
