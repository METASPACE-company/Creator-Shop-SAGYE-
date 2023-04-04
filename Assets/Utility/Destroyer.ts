import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject} from "UnityEngine";

export default class Destroyer extends ZepetoScriptBehaviour {

    private Awake() {
        GameObject.Destroy(this.gameObject);
    }
}