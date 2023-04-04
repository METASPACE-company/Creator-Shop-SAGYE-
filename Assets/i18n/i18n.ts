import { LangKeySet } from './lang/_Lang';

export enum Language {
  English,
  Korean,
  Japanese,
  Indonesian,
  Thai,
}

export class i18nEvent {
  private handlers = new Set<i18nEventHandler>();

  public constructor(private lang: LangKeySet) {}

  public OnChange(handler: i18nEventHandler) {
    if (isRealNil(handler)) return;

    handler(this.lang);
    this.handlers.add(handler);
  }

  public OffChange(handler: i18nEventHandler) {
    this.handlers.delete(handler);
  }

  public Emit(lang: LangKeySet): void {
    this.lang = lang;
    this.handlers = new Set(
      [...this.handlers.values()].filter((handler) => !isRealNil(handler)),
    );

    for (const handler of this.handlers.values()) handler(lang);
  }
}

export type i18nEventHandler = (lang: LangKeySet) => void;

function isRealNil(value: any): boolean {
  if (!value) return true;

  const str =
    typeof value.toString === 'function' ? value.toString() : String(value);

  return str === 'undefined' || str === 'null';
}
