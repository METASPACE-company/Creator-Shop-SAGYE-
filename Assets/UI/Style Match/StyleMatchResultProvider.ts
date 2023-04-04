import { Color, Sprite, Texture2D, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import {
  STYLE_MATCH_RESULT,
  StyleMatchResult,
  StyleMatchResultType,
} from './StyleMatchState';

export default class StyleMatchResultProvider extends ZepetoScriptBehaviour {
  private static instance: StyleMatchResultProvider;

  public static get Instance(): StyleMatchResultProvider {
    return StyleMatchResultProvider.instance;
  }

  @Header('ES_A') // 캐주얼
  public ES_A_Name: string;
  public ES_A_TeleportPoints: Transform[];

  public ES_A_ResultTitleText: string;
  @HideInInspector() // 인스펙터에서 \n가 \\n로 치환되어 여기에서 직접 정의함
  public ES_A_ResultDescText: string = 'ZM_StyleMatching_Casual_Text';
  public ES_A_ResultTypoSprite: Sprite;
  public ES_A_ResultBGSprite: Sprite;

  public ES_A_FeedBGColor: Color;
  public ES_A_FeedTypoSprite: Sprite;
  public ES_A_FeedImageBG: Texture2D;

  public ES_A_WorldId: string[];

  @Header('ES_B') // 스트리트
  public ES_B_Name: string;
  public ES_B_TeleportPoints: Transform[];

  public ES_B_ResultTitleText: string;
  @HideInInspector()
  public ES_B_ResultDescText: string = 'ZM_StyleMatching_Street_Text';
  public ES_B_ResultTypoSprite: Sprite;
  public ES_B_ResultBGSprite: Sprite;

  public ES_B_FeedBGColor: Color;
  public ES_B_FeedTypoSprite: Sprite;
  public ES_B_FeedImageBG: Texture2D;

  public ES_B_WorldId: string[];

  @Header('EN_A') // 러블리
  public EN_A_Name: string;
  public EN_A_TeleportPoints: Transform[];

  public EN_A_ResultTitleText: string;
  @HideInInspector()
  public EN_A_ResultDescText: string = 'ZM_StyleMatching_Romantic_Text';
  public EN_A_ResultTypoSprite: Sprite;
  public EN_A_ResultBGSprite: Sprite;

  public EN_A_FeedBGColor: Color;
  public EN_A_FeedTypoSprite: Sprite;
  public EN_A_FeedImageBG: Texture2D;

  public EN_A_WorldId: string[];

  @Header('EN_B') // 코스플레이
  public EN_B_Name: string;
  public EN_B_TeleportPoints: Transform[];

  public EN_B_ResultTitleText: string;
  @HideInInspector()
  public EN_B_ResultDescText: string = 'ZM_StyleMatching_Cosplay_Text';
  public EN_B_ResultTypoSprite: Sprite;
  public EN_B_ResultBGSprite: Sprite;

  public EN_B_FeedBGColor: Color;
  public EN_B_FeedTypoSprite: Sprite;
  public EN_B_FeedImageBG: Texture2D;

  public EN_B_WorldId: string[];

  @Header('IS_A') // 포멀
  public IS_A_Name: string;
  public IS_A_TeleportPoints: Transform[];

  public IS_A_ResultTitleText: string;
  @HideInInspector()
  public IS_A_ResultDescText: string = 'ZM_StyleMatching_Formal_Text';
  public IS_A_ResultTypoSprite: Sprite;
  public IS_A_ResultBGSprite: Sprite;

  public IS_A_FeedBGColor: Color;
  public IS_A_FeedTypoSprite: Sprite;
  public IS_A_FeedImageBG: Texture2D;

  public IS_A_WorldId: string[];

  @Header('IS_B') // 럭셔리
  public IS_B_Name: string;
  public IS_B_TeleportPoints: Transform[];

  public IS_B_ResultTitleText: string;
  @HideInInspector()
  public IS_B_ResultDescText: string = 'ZM_StyleMatching_Luxury_Text';
  public IS_B_ResultTypoSprite: Sprite;
  public IS_B_ResultBGSprite: Sprite;

  public IS_B_FeedBGColor: Color;
  public IS_B_FeedTypoSprite: Sprite;
  public IS_B_FeedImageBG: Texture2D;

  public IS_B_WorldId: string[];

  @Header('IN_A') // 빈티지
  public IN_A_Name: string;
  public IN_A_TeleportPoints: Transform[];

  public IN_A_ResultTitleText: string;
  @HideInInspector()
  public IN_A_ResultDescText: string = 'ZM_StyleMatching_Vintage_Text';
  public IN_A_ResultTypoSprite: Sprite;
  public IN_A_ResultBGSprite: Sprite;

  public IN_A_FeedBGColor: Color;
  public IN_A_FeedTypoSprite: Sprite;
  public IN_A_FeedImageBG: Texture2D;

  public IN_A_WorldId: string[];

  @Header('IN_B') // 고스
  public IN_B_Name: string;
  public IN_B_TeleportPoints: Transform[];

  public IN_B_ResultTitleText: string;
  @HideInInspector()
  public IN_B_ResultDescText: string = 'ZM_StyleMatching_Goth_Text';
  public IN_B_ResultTypoSprite: Sprite;
  public IN_B_ResultBGSprite: Sprite;

  public IN_B_FeedBGColor: Color;
  public IN_B_FeedTypoSprite: Sprite;
  public IN_B_FeedImageBG: Texture2D;

  public IN_B_WorldId: string[];

  public Awake(): void {
    StyleMatchResultProvider.instance = this;
  }

  public GetResult(resultType: StyleMatchResultType): StyleMatchResult {
    const keys = Object.getOwnPropertyNames(STYLE_MATCH_RESULT);

    let result: Partial<StyleMatchResult> = {};
    for (const key of keys) {
      result[key] = this[`${resultType}_${key}`];
    }

    return result as StyleMatchResult;
  }
}
