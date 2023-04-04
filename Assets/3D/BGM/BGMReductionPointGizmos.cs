using UnityEngine;

public class BGMReductionPointGizmos : MonoBehaviour {
  [SerializeField]
  private float minDistance;
  [SerializeField]
  private float maxDistance;

  public void OnDrawGizmos() {
    Gizmos.color = new Color(1, 0, 0, 0.5f);
    Gizmos.DrawSphere(this.transform.position, this.minDistance);
    Gizmos.color = new Color(0, 1, 0, 0.5f);
    Gizmos.DrawSphere(this.transform.position, this.maxDistance);
  }

  public void OnDrawGizmosSelected() {
    Gizmos.color = new Color(1, 0, 0, 0.5f);
    Gizmos.DrawSphere(this.transform.position, this.minDistance);
    Gizmos.color = new Color(0, 1, 0, 0.5f);
    Gizmos.DrawSphere(this.transform.position, this.maxDistance);
  }
}
