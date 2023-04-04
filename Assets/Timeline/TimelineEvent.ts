import { PlayableDirector } from 'UnityEngine.Playables';

export type TimelineEventHandler = (timeline: PlayableDirector) => void;

export class TimelineEvent {
  constructor(private timeline: PlayableDirector) {}

  public OnPlayed(handler: TimelineEventHandler): void {
    this.timeline.add_played(handler);
  }

  public OffPlayed(handler: TimelineEventHandler): void {
    this.timeline.remove_played(handler);
  }

  public OncePlayed(handler: TimelineEventHandler): void {
    const wrapper: TimelineEventHandler = (timeline) => {
      handler(timeline);
      this.OffPlayed(wrapper);
    };
    this.OnPlayed(wrapper);
  }

  public OnPaused(handler: TimelineEventHandler): void {
    this.timeline.add_paused(handler);
  }

  public OffPaused(handler: TimelineEventHandler): void {
    this.timeline.remove_paused(handler);
  }

  public OncePaused(handler: TimelineEventHandler): void {
    const wrapper: TimelineEventHandler = (timeline) => {
      handler(timeline);
      this.OffPaused(wrapper);
    };
    this.OnPaused(wrapper);
  }

  public OnStopped(handler: TimelineEventHandler): void {
    this.timeline.add_stopped(handler);
  }

  public OffStopped(handler: TimelineEventHandler): void {
    this.timeline.remove_stopped(handler);
  }

  public OnceStopped(handler: TimelineEventHandler): void {
    const wrapper: TimelineEventHandler = (timeline) => {
      handler(timeline);
      this.OffStopped(wrapper);
    };
    this.OnStopped(wrapper);
  }
}
