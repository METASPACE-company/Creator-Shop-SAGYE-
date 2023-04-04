import { PlayableDirector } from 'UnityEngine.Playables';

import { TimelineEvent } from './TimelineEvent';

export class TimelineWithEvent {
  private event: TimelineEvent;

  constructor(private timeline: PlayableDirector) {
    this.event = new TimelineEvent(this.timeline);
  }

  public get Timeline(): PlayableDirector {
    return this.timeline;
  }

  public get Event(): TimelineEvent {
    return this.event;
  }
}
