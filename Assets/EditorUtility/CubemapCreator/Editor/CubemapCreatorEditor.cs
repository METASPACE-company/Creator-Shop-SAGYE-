using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(CubemapCreator))]
public class CubeGenerateButton : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        CubemapCreator creator = (CubemapCreator)target;
        if (GUILayout.Button("Create and save")) {
            creator.SaveAll();
        }
    }
}