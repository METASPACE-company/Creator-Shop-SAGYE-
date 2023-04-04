using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class ServerCodeCopy : AssetPostprocessor {
    private const string ServerDirName = "Network/World.multiplay";
    private const string ClientDirName = "Network/World-client";
    private const string SharedCodePostfix = "-shared";

    private static void OnPostprocessAllAssets(string[] importedAssets, string[] deletedAssets, string[] movedAssets, string[] movedFromAssetPaths) {
        string multiplayServerDir = Directory.GetDirectories(Application.dataPath, ServerDirName, SearchOption.AllDirectories).FirstOrDefault();
        if (string.IsNullOrEmpty(multiplayServerDir)) {
            return;
        }

        string multiplayClientDir = multiplayServerDir.Replace(ServerDirName, ClientDirName);

        bool isServerCodeChanged = false;
        foreach (string assetFilenameIter in importedAssets) {
            string assetFilename = assetFilenameIter.Replace("\\", "/");
            if (assetFilename.Contains(ServerDirName + "/") && assetFilename.Contains(SharedCodePostfix)) {
                isServerCodeChanged = true;
                break;
            }
        }

        if (!isServerCodeChanged) {
            return;
        }

        CopyDirectory(multiplayServerDir, multiplayClientDir, true, $"*{SharedCodePostfix}.ts");

        DeleteEmptyDirs(multiplayClientDir);
    }

    private static void CopyDirectory(string sourceDir, string destinationDir, bool recursive, string filePattern = null) {
        DirectoryInfo srcDirInfo = new DirectoryInfo(sourceDir);

        if (!srcDirInfo.Exists) {
            throw new DirectoryNotFoundException($"Source directory not found: {srcDirInfo.FullName}");
        }

        DirectoryInfo[] srcSubDirInfos = srcDirInfo.GetDirectories();

        if (!Directory.Exists(destinationDir)) {
            Directory.CreateDirectory(destinationDir);
        }

        FileInfo[] fileInfos;
        if (filePattern != null) {
            fileInfos = srcDirInfo.GetFiles(filePattern);
        } else {
            fileInfos = srcDirInfo.GetFiles();
        }

        foreach (FileInfo file in fileInfos) {
            string targetFilePath = Path.Combine(destinationDir, file.Name);
            file.CopyTo(targetFilePath, true);
        }

        if (recursive) {
            foreach (DirectoryInfo subDir in srcSubDirInfos) {
                string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
                CopyDirectory(subDir.FullName, newDestinationDir, true, filePattern);
            }
        }
    }

    private static void DeleteEmptyDirs(string dir) {
        if (string.IsNullOrEmpty(dir)) {
            throw new ArgumentException("Starting directory is a null reference or an empty string", "dir");
        }

        try {
            foreach (string d in Directory.EnumerateDirectories(dir)) {
                DeleteEmptyDirs(d);
            }

            IEnumerable<string> entries = Directory.EnumerateFileSystemEntries(dir);

            if (!entries.Any()) {
                try {
                    Directory.Delete(dir);
                } catch (UnauthorizedAccessException) {
                } catch (DirectoryNotFoundException) {
                }
            }
        } catch (UnauthorizedAccessException) {
        }
    }
}