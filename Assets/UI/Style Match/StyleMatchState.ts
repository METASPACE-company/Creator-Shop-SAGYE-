import { Color, Sprite, Texture2D, Transform } from 'UnityEngine';

export interface StyleMatchController {
  Translate(next: StyleMatchState): void;
  Terminate(result: StyleMatchResultType): void;
}

export interface StyleMatchState {
  dialogue: string;
  selectionLabel1: string;
  selectionLabel2: string;
  HandleSelection(selection: number, controller: StyleMatchController): void;
}

export interface StyleMatchResult {
  Name: string;
  TeleportPoints: Transform[];

  ResultTitleText: string;
  ResultDescText: string;
  ResultTypoSprite: Sprite;
  ResultBGSprite: Sprite;

  FeedBGColor: Color;
  FeedTypoSprite: Sprite;
  FeedImageBG: Texture2D;

  WorldId: string[];
}

export const STYLE_MATCH_RESULT: StyleMatchResult = {
  FeedBGColor: undefined,
  FeedTypoSprite: undefined,
  FeedImageBG: undefined,
  Name: '',
  ResultBGSprite: undefined,
  ResultTypoSprite: undefined,
  ResultDescText: '',
  ResultTitleText: '',
  TeleportPoints: undefined,
  WorldId: undefined,
};

export type StyleMatchResultType =
  | 'ES_A'
  | 'ES_B'
  | 'EN_A'
  | 'EN_B'
  | 'IS_A'
  | 'IS_B'
  | 'IN_A'
  | 'IN_B';
