import { GameObject, Transform } from 'UnityEngine';

export default class UnityUtility {
  public static IsRealExists(gameObject: Object): bool {
    if (!gameObject) return false;

    const objString = gameObject.toString();
    if (objString == 'null' || objString == 'undefined') return false;

    return true;
  }

  public static ClearChilds(parent: GameObject) {
    const childCount = parent.transform.childCount;
    for (let i = childCount - 1; i >= 0; --i) {
      const child = parent.transform.GetChild(i);
      GameObject.Destroy(child.gameObject);
    }
  }

  public static GetChilds(parent: GameObject): GameObject[] {
    const childCount = parent.transform.childCount;
    let childs: GameObject[] = new Array(childCount);

    for (let i = 0; i < childCount; ++i) {
      childs[i] = parent.transform.GetChild(i).gameObject;
    }
    return childs;
  }

  public static GetChildsRecursive(parent: GameObject): GameObject[] {
    const childTrsfs = parent.transform.GetComponentsInChildren<Transform>();

    let childs = new Array(childTrsfs.length);
    for (let i = 0; i < childs.length; ++i) {
      const childTrsf = childTrsfs.get_Item(i);

      childs[i] = childTrsf.gameObject;
    }
    return childs;
  }

  public static ChangeLayersRecursively(trsf: Transform, layer: int) {
    trsf.gameObject.layer = layer;
    for (const child of this.GetChilds(trsf.gameObject)) {
      this.ChangeLayersRecursively(child.transform, layer);
    }
  }
}
