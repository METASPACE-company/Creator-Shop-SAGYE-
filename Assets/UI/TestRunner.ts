import {ZepetoScriptBehaviour} from "ZEPETO.Script";
import {Application, Input, KeyCode, RuntimePlatform} from "UnityEngine";
import StyleMatchUI from "./Style Match/StyleMatchUI";
import StyleMatch from "./Style Match/StyleMatch";
import {StyleMatchResult, StyleMatchResultType} from "./Style Match/StyleMatchState";

export default class TestRunner extends ZepetoScriptBehaviour {
  
  private isLoaded: bool;
  
  private Start() {
    if(!this.IsTestTargetPlatform()) return;
    
    this.isLoaded = false;
    this.StartCoroutine(this.LoadRoutine());
  }
  
  private *LoadRoutine() {
    yield null;
    
    this.isLoaded = true;
  }
  
  private Update() {
    if(!this.IsTestTargetPlatform()) return;
    if(!this.isLoaded) return;
    
    for(let i=0; i<8; ++i) {
      if(Input.GetKeyDown(KeyCode.Alpha1 + i)) {
         this.ShowTestResult(i);
         break;
      }
    }
  }
  
  private IsTestTargetPlatform(): bool {
    switch(Application.platform) {
      case RuntimePlatform.WindowsEditor:
      case RuntimePlatform.LinuxEditor:
      case RuntimePlatform.OSXEditor:
        return true;
      default:
        return false;
    }
  }
  
  private ShowTestResult(index: int) {
    StyleMatch.Instance.StartSession();
    StyleMatch.Instance.Terminate(this.NumberToResultType(index));
  }
  
  private NumberToResultType(index:int): StyleMatchResultType {
    switch(index) {
      case 0:
        return 'ES_A';
      case 1:
        return 'ES_B';
      case 2:
        return 'EN_A';
      case 3:
        return 'EN_B';
      case 4:
        return 'IS_A';
      case 5:
        return 'IS_B';
      case 6:
        return 'IN_A';
      case 7:
        return 'IN_B';
    }
  }
}