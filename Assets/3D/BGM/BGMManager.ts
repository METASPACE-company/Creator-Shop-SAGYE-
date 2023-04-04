import { AudioSource } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import LocalPlayer from '../../Network/Sync/LocalPlayer';
import BGMReductionPoint from './BGMReductionPoint';

export default class BGMManager extends ZepetoScriptBehaviour {
  private static instance: BGMManager;

  public static get Instance(): BGMManager {
    return this.instance;
  }

  private source: AudioSource;
  private maxVolume: number;

  public Awake(): void {
    BGMManager.instance = this;

    this.source = this.GetComponent<AudioSource>();
    this.maxVolume = this.source.volume;
  }

  public LateUpdate(): void {
    const player = LocalPlayer.Instance;
    if (!player) {
      this.ApplyVolumeReduction(0);
      return;
    }

    const playerPosition = player.ZepetoCharacter.transform.position;
    const reductionRates = BGMReductionPoint.Points.map((point) =>
      point.ComputeReductionRate(playerPosition),
    );
    const maxReductionRate = Math.max(...reductionRates);

    this.ApplyVolumeReduction(maxReductionRate);
  }

  public ApplyVolumeReduction(rate: number): void {
    this.source.volume = this.maxVolume * (1 - rate);
  }
}
