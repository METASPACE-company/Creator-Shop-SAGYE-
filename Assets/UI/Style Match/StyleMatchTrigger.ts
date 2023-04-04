import { Collider } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import StyleMatch from './StyleMatch';

export default class StyleMatchTrigger extends ZepetoScriptBehaviour {
  public OnTriggerEnter(collider: Collider): void {
    if (collider.gameObject.tag !== 'LocalPlayer') return;
    StyleMatch.Instance.StartSession();
  }
}
