import {ZepetoScriptBehaviour} from "ZEPETO.Script";
import {TextMeshProUGUI} from "TMPro";

export default class TMProSizeUpdater extends ZepetoScriptBehaviour {

    private textMeshPro: TextMeshProUGUI;
    private lastString: string;
    private lastStringOrigin: string;
    private fixPhase: int;

    private Awake() {
        this.fixPhase = 0;
        this.lastString = "";
    }

    private Start() {
        this.textMeshPro = this.GetComponent<TextMeshProUGUI>();
    }

    private Update() {
        if (!this.textMeshPro) return;

        if (this.lastString == this.textMeshPro.text) {
            if (this.fixPhase == 0) {
                this.fixPhase = 1;
                this.lastString += " ";
                this.textMeshPro.text = this.lastString;
            } else if (this.fixPhase == 1) {
                this.fixPhase = 2;
                this.lastString = this.lastStringOrigin;
                this.textMeshPro.text = this.lastString;
            }
        }
        if (this.lastString != this.textMeshPro.text) {
            this.lastStringOrigin = this.textMeshPro.text;
            this.lastString = this.lastStringOrigin;
            this.fixPhase = 0;
        }
    }
}