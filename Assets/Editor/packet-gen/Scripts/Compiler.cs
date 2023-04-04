using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

public class Compiler : AssetPostprocessor
{
  private class Config
  {
    public static string[] INPUT_FILES = { };
    public static string[] INPUT_DIRS = { "Network/Packet" };
    public static string[] INPUT_EXTS = { "txt" };
    public static string OUT_SERVER = "Network/World.multiplay/ServerPackets.ts";
    public static string OUT_CLIENT = "Network/World-client/ClientPackets.ts";
  }

  static void OnPostprocessAllAssets(
      string[] importedAssets,
      string[] deletedAssets,
      string[] movedAssets,
      string[] movedFromAssetPaths)
  {
    var isSourceChanged = false;
    isSourceChanged |= importedAssets.Any(x => IsCompiledPath(x));
    isSourceChanged |= deletedAssets.Any(x => IsCompiledPath(x));
    isSourceChanged |= movedAssets.Any(x => IsCompiledPath(x));
    isSourceChanged |= movedFromAssetPaths.Any(x => IsCompiledPath(x));

    if (!isSourceChanged) return;

    var os = SystemInfo.operatingSystem.ToLower();
    var cpu = SystemInfo.processorType.ToLower();
    string triple_os;
    string triple_cpu;

    if (os.Contains("mac os"))
      triple_os = "apple-darwin";
    else if (os.Contains("windows"))
      triple_os = "pc-windows-gnu";
    else
      return;

    if (cpu.Contains("intel") && cpu.Contains("core"))
      triple_cpu = "x86_64";
    else if (cpu.Contains("apple m"))
      triple_cpu = "aarch64";
    else
      return;

    var bin = string.Format("packet-gen-{0}-{1}", triple_cpu, triple_os);
    var path = Path.Combine(Application.dataPath, "Editor/packet-gen/bin", bin);

    var processStartInfo = new ProcessStartInfo();
    var process = new Process();

    var argInputFile = String.Join(" ", Config.INPUT_FILES.Select((file) => string.Format("-f {0}", Path.Combine(Application.dataPath, file))));
    var argInputDir = String.Join(" ", Config.INPUT_DIRS.Select((dir) => string.Format("-d {0}", Path.Combine(Application.dataPath, dir))));
    var argExt = String.Join(" ", Config.INPUT_EXTS.Select((ext) => string.Format("-e {0}", ext)));
    var argServerOut = Path.Combine(Application.dataPath, Config.OUT_SERVER);
    var argClientOut = Path.Combine(Application.dataPath, Config.OUT_CLIENT);
    var args = string.Format("{0} {1} {2} -s {3} -c {4} --include-internal-types", argInputFile, argInputDir, argExt, argServerOut, argClientOut);

    processStartInfo.FileName = path;
    processStartInfo.Arguments = args;
    processStartInfo.CreateNoWindow = true;
    processStartInfo.UseShellExecute = false;
    processStartInfo.RedirectStandardOutput = true;
    processStartInfo.RedirectStandardError = true;
    process.StartInfo = processStartInfo;
    process.Start();
    process.BeginOutputReadLine();
    process.BeginErrorReadLine();

    process.OutputDataReceived += (sender, e) =>
        {
          if (string.IsNullOrEmpty(e.Data))
            return;

          UnityEngine.Debug.Log(e.Data);
        };
    process.ErrorDataReceived += (sender, e) =>
        {
          if (string.IsNullOrEmpty(e.Data))
            return;

          UnityEngine.Debug.LogError(e.Data);
        };
  }

  private static bool IsCompiledPath(string path)
  {
    foreach (var dir in Config.INPUT_DIRS.Select(dir => String.Format("Assets/{0}/", dir)))
      if (path.StartsWith(dir)) return true;

    foreach (var file in Config.INPUT_FILES.Select(file => String.Format("Assets/{0}", file)))
      if (path == file) return true;

    return false;
  }
}
