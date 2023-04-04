import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

import { ZepetoWorldContent } from 'ZEPETO.World';

import { Collider, Vector3, Quaternion } from 'UnityEngine';

import { ZepetoCharacter, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class MoveToWorld extends ZepetoScriptBehaviour {

    private zepetoCharacter: ZepetoCharacter;
    private WorldId: string = "com.metaspace.idolsimulator"; //ex: com.default.jumpworld

    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
    }
    OnTriggerEnter(collider: Collider) {
        if (this.zepetoCharacter == null || collider.gameObject != this.zepetoCharacter.gameObject)
            return;
        ZepetoWorldContent.MoveToWorld(this.WorldId, (errCode, errMsg) => {
            //에러 콜백 처리 예시 (실제 구현시 팝업 창을 띄우는 등 다양한 방식으로 구현해 보세요)
            console.log(`${errCode} - ${errMsg}`);
        });
    }
} 