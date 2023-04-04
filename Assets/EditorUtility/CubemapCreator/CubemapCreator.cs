using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

public class CubemapCreator : MonoBehaviour {
    public Color gizmoColor = Color.white;
    
    [Header("Assets/ 뒤에 붙을 경로명을 입력하세요.")]
    public string directoryName = "Cubemaps";
    public string targetName = "NewCubemap";

    public bool captureCubermap = true;
    public bool capturePlanes;
    
    public Vector2Int textureSize = new Vector2Int(512, 512);

    private Camera targetCamera;


    public static void ShowNotification(string message) {
        foreach (SceneView sceneView in SceneView.sceneViews) {
            sceneView?.ShowNotification(new GUIContent(message));
        }
    }

    public void SaveAll() {
        if (captureCubermap) {
            SaveCubemap();
        }

        if (capturePlanes) {
            SavePlanes();
            
            AssetDatabase.Refresh();
        }

        ShowNotification($"Cubemap이 저장되었습니다.");
    }

    public void SaveCubemap() {
        if (targetCamera == null) {
            targetCamera = gameObject.AddComponent<Camera>();
        }

        Cubemap cubemap = new Cubemap(textureSize.x, TextureFormat.ARGB32, false);
        targetCamera.GetComponent<Camera>().RenderToCubemap(cubemap);


        string filename = Path.Combine("Assets", directoryName, $"{targetName}.cubemap");
        Directory.CreateDirectory(Path.GetDirectoryName(filename));
        AssetDatabase.CreateAsset(cubemap, filename);
        
        GameObject.DestroyImmediate(targetCamera);
    }

    public void SavePlanes() {
        GameObject planeCamObj = new GameObject("PlaneCam");
        planeCamObj.transform.SetParent(this.transform, false);

        Camera planeCam = planeCamObj.AddComponent<Camera>();
        planeCam.orthographic = true;

        float frontAspect = transform.localScale.x / transform.localScale.y;
        float wallAspect = transform.localScale.z / transform.localScale.y;
        float ceilAspect = transform.localScale.x / transform.localScale.z;

        planeCam.orthographicSize = transform.localScale.y * 0.5f;
        // Capture front
        var renderTexture = new RenderTexture((int)(textureSize.y * frontAspect), textureSize.y, 24, RenderTextureFormat.ARGB32, 0);
        SaveTexture(Path.Combine(Application.dataPath, directoryName, $"{targetName}_Front.png"), renderTexture, planeCam, Vector3.zero);
        DestroyImmediate(renderTexture);

        // Capture side
         renderTexture = new RenderTexture((int)(textureSize.y * wallAspect), textureSize.y, 24, RenderTextureFormat.ARGB32, 0);
         SaveTexture(Path.Combine(Application.dataPath, directoryName, $"{targetName}_Side.png"), renderTexture, planeCam, new Vector3(0, 90, 0));
         DestroyImmediate(renderTexture);
         
        planeCam.orthographicSize = transform.localScale.z * 0.5f;
         // Capture bottom
         renderTexture = new RenderTexture((int)(textureSize.y * ceilAspect), textureSize.y, 24, RenderTextureFormat.ARGB32, 0);
         SaveTexture(Path.Combine(Application.dataPath, directoryName, $"{targetName}_Bottom.png"), renderTexture, planeCam, new Vector3(90, 0, 0));
         DestroyImmediate(renderTexture);
         
         // Capture ceil
         renderTexture = new RenderTexture((int)(textureSize.y * ceilAspect), textureSize.y, 24, RenderTextureFormat.ARGB32, 0);
         SaveTexture(Path.Combine(Application.dataPath, directoryName, $"{targetName}_Ceil.png"), renderTexture, planeCam, new Vector3(-90, 0, 0));
         DestroyImmediate(renderTexture);
        
        GameObject.DestroyImmediate(planeCamObj);
    }
    
    private void OnDrawGizmos() {
        Gizmos.color = gizmoColor;
        var tempMatrix = Gizmos.matrix;
        Gizmos.matrix = transform.localToWorldMatrix;

        float wireThickness = 0.01f;
        float littleWidth = 0.1f;
        Gizmos.DrawWireCube(new Vector3(0, 0, 0.5f), new Vector3(1f, 1f, wireThickness));
        Gizmos.DrawWireCube(new Vector3(0.5f, 0, 0), new Vector3(wireThickness, 1f, 1f));
        Gizmos.DrawWireCube(new Vector3(0, 0.5f, 0), new Vector3(1f, wireThickness, 1f));
        Gizmos.DrawWireCube(new Vector3(0, -0.5f, 0), new Vector3(1f, wireThickness, 1f));
        
        Gizmos.DrawWireCube(new Vector3(0, 0, 0.5f), new Vector3(littleWidth, littleWidth, wireThickness));
        Gizmos.DrawWireCube(new Vector3(0.5f, 0, 0), new Vector3(wireThickness, littleWidth, littleWidth));
        Gizmos.DrawWireCube(new Vector3(0, 0.5f, 0), new Vector3(littleWidth, wireThickness, littleWidth));
        Gizmos.DrawWireCube(new Vector3(0, -0.5f, 0), new Vector3(littleWidth, wireThickness, littleWidth));
        
        Gizmos.DrawWireCube(Vector3.zero, new Vector3(littleWidth, littleWidth, littleWidth));

        Gizmos.matrix = tempMatrix;
    }

    private void SaveTexture(string filename, RenderTexture renderTexture, Camera camera, Vector3 cameraAngle) {
        camera.transform.localEulerAngles = cameraAngle;
        
        camera.targetTexture = renderTexture;
        camera.Render();
        camera.targetTexture = null;

        var texture = ToTexture2D(renderTexture);
        byte[] bytes = texture.EncodeToPNG();
        File.WriteAllBytes(filename, bytes);

        DestroyImmediate(texture);
    }

    private Texture2D ToTexture2D(RenderTexture renderTexture) {
        Texture2D texture = new Texture2D(renderTexture.width, renderTexture.height, TextureFormat.RGB24, false);
        texture.wrapMode = TextureWrapMode.Clamp;
        
        RenderTexture.active = renderTexture;
        texture.ReadPixels(new Rect(0, 0, renderTexture.width, renderTexture.height), 0, 0);
        texture.Apply();
        
        Texture2D resultTexture = ResizeTexture(texture, textureSize.x, textureSize.y);
        resultTexture.wrapMode = TextureWrapMode.Clamp;
        GameObject.DestroyImmediate(texture);
        
        return resultTexture;
    }
    
    private Texture2D ResizeTexture(Texture2D source, int targetWidth, int targetHeight)
    {
        Texture2D result = new Texture2D(targetWidth, targetHeight, source.format, true);
        Color[] rpixels = result.GetPixels(0);
        float incX = (1.0f / (float)targetWidth);
        float incY = (1.0f / (float)targetHeight);
        for (int px = 0; px < rpixels.Length; px++)
        {
            rpixels[px] = source.GetPixelBilinear(incX * ((float)px % targetWidth), incY * ((float)Mathf.Floor(px / targetWidth)));
        }
        result.SetPixels(rpixels, 0);
        result.Apply();
        return result;
    }
}