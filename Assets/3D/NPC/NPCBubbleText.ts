import { TMP_Text } from 'TMPro';
import { Camera, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class NPCBubbleText extends ZepetoScriptBehaviour {
  @Header('UI')
  @SerializeField()
  private text: TMP_Text;

  public Awake(): void {
    this.HideDialogue();
  }

  public Update(): void {
    const camera = Camera.main?.transform;

    if (!camera) {
      this.HideDialogue();
      return;
    }

    this.transform.LookAt(
      Vector3.op_Addition(
        this.transform.position,
        Vector3.op_Subtraction(this.transform.position, camera.position),
      ),
      Vector3.up,
    );
  }

  public ShowDialogue(dialogue: string): void {
    if (!this.gameObject.activeSelf) this.gameObject.SetActive(true);
    this.text.text = dialogue;
  }

  public HideDialogue(): void {
    if (this.gameObject.activeSelf) this.gameObject.SetActive(false);
  }
}
