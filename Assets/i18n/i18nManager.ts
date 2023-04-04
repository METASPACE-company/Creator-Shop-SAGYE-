import { Application, SystemLanguage } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { i18nEvent, Language } from './i18n';
import { enUS } from './lang/en-US';
import { idID } from './lang/id-ID';
import { jaJP } from './lang/ja-JP';
import { koKR } from './lang/ko-KR';
import { thTH } from './lang/th-TH';
import { LangKeySet } from './lang/_Lang';

export default class i18nManager extends ZepetoScriptBehaviour {
  private static instance: i18nManager;

  public static get Instance(): i18nManager {
    return i18nManager.instance;
  }

  private lang: LangKeySet;
  private language: Language;
  private event: i18nEvent;

  public get Lang(): LangKeySet {
    return this.lang;
  }

  public get Language(): Language {
    return this.language;
  }

  public get Event(): i18nEvent {
    return this.event;
  }

  public Awake(): void {
    i18nManager.instance = this;

    let language: Language;
    switch (Application.systemLanguage) {
      case SystemLanguage.Afrikaans:
        language = Language.English;
        break;
      case SystemLanguage.Arabic:
        language = Language.English;
        break;
      case SystemLanguage.Basque:
        language = Language.English;
        break;
      case SystemLanguage.Belarusian:
        language = Language.English;
        break;
      case SystemLanguage.Bulgarian:
        language = Language.English;
        break;
      case SystemLanguage.Catalan:
        language = Language.English;
        break;
      case SystemLanguage.Chinese:
        language = Language.English;
        break;
      case SystemLanguage.Czech:
        language = Language.English;
        break;
      case SystemLanguage.Danish:
        language = Language.English;
        break;
      case SystemLanguage.Dutch:
        language = Language.English;
        break;
      case SystemLanguage.English:
        language = Language.English;
        break;
      case SystemLanguage.Estonian:
        language = Language.English;
        break;
      case SystemLanguage.Faroese:
        language = Language.English;
        break;
      case SystemLanguage.Finnish:
        language = Language.English;
        break;
      case SystemLanguage.French:
        language = Language.English;
        break;
      case SystemLanguage.German:
        language = Language.English;
        break;
      case SystemLanguage.Greek:
        language = Language.English;
        break;
      case SystemLanguage.Hebrew:
        language = Language.English;
        break;
      case SystemLanguage.Hugarian:
        language = Language.English;
        break;
      case SystemLanguage.Icelandic:
        language = Language.English;
        break;
      case SystemLanguage.Indonesian:
        language = Language.Indonesian;
        break;
      case SystemLanguage.Italian:
        language = Language.English;
        break;
      case SystemLanguage.Japanese:
        language = Language.Japanese;
        break;
      case SystemLanguage.Korean:
        language = Language.Korean;
        break;
      case SystemLanguage.Latvian:
        language = Language.English;
        break;
      case SystemLanguage.Lithuanian:
        language = Language.English;
        break;
      case SystemLanguage.Norwegian:
        language = Language.English;
        break;
      case SystemLanguage.Polish:
        language = Language.English;
        break;
      case SystemLanguage.Portuguese:
        language = Language.English;
        break;
      case SystemLanguage.Romanian:
        language = Language.English;
        break;
      case SystemLanguage.Russian:
        language = Language.English;
        break;
      case SystemLanguage.SerboCroatian:
        language = Language.English;
        break;
      case SystemLanguage.Slovak:
        language = Language.English;
        break;
      case SystemLanguage.Slovenian:
        language = Language.English;
        break;
      case SystemLanguage.Spanish:
        language = Language.English;
        break;
      case SystemLanguage.Swedish:
        language = Language.English;
        break;
      case SystemLanguage.Thai:
        language = Language.Thai;
        break;
      case SystemLanguage.Turkish:
        language = Language.English;
        break;
      case SystemLanguage.Ukrainian:
        language = Language.English;
        break;
      case SystemLanguage.Vietnamese:
        language = Language.English;
        break;
      case SystemLanguage.ChineseSimplified:
        language = Language.English;
        break;
      case SystemLanguage.ChineseTraditional:
        language = Language.English;
        break;
      case SystemLanguage.Unknown:
        language = Language.English;
        break;
      case SystemLanguage.Hungarian:
        language = Language.English;
        break;
      default:
        language = Language.English;
        break;
    }

    this.event = new i18nEvent(LanguageToLang(language));
    this.SetLanguage(language);
  }

  public SetLanguage(language: Language): void {
    this.lang = LanguageToLang(language);
    this.language = language;
    this.event.Emit(this.lang);
  }
}

function LanguageToLang(language: Language): LangKeySet {
  switch (language) {
    case Language.English:
      return enUS;
      break;
    case Language.Korean:
      return koKR;
      break;
    case Language.Japanese:
      return jaJP;
      break;
    case Language.Indonesian:
      return idID;
      break;
    case Language.Thai:
      return thTH;
      break;
    default:
      return enUS;
  }
}
