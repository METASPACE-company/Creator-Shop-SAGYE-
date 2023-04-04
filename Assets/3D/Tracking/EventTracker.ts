import {
  AnalyticsType,
  ZepetoAnalyticsComponent,
  ZepetoBaseAnalytics,
} from 'ZEPETO.Analytics';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class EventTracker extends ZepetoScriptBehaviour {
  private static instance: EventTracker;

  public static get Instance(): EventTracker {
    return EventTracker.instance;
  }

  @SerializeField()
  private msAnalytics: ZepetoAnalyticsComponent;

  private gaMS: ZepetoBaseAnalytics;

  public Awake(): void {
    EventTracker.instance = this;
  }

  public Start(): void {
    this.gaMS = this.msAnalytics.Analytics(AnalyticsType.GoogleAnalytics);
  }

  public CountEnterWorld(): void {
    this.MSCountEvent('EnterWorld');
  }

  public CountTakeSeat(): void {
    this.MSCountEvent('TakeSeat');
  }

  public CountEnterPortal(): void {
    this.MSCountEvent('EnterPortal');
  }

  public CountOpenTutorial(): void {
    this.MSCountEvent('OpenTutorial');
  }

  public CountEnterArea(area: string): void {
    this.MSCountEvent(`EnterArea:${area}`);
  }

  public CountOpenMagicCamera(): void {
    this.MSCountEvent('OpenMagicCamera');
  }

  public CountOpenStyleMatch(): void {
    this.MSCountEvent('OpenStyleMatch');
  }

  public CountOpenMannequin(): void {
    this.MSCountEvent('OpenMannequin');
  }

  private MSCountEvent(event: string): void {
    if (this.gaMS) this.gaMS.LogEvent<{}>(event, {});
  }
}
