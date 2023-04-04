import { AtlasPopulationMode, TMP_FontAsset } from 'TMPro';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

// Written by AcrylicShrimp, on 2023.01.20.
// TMP has an issue on dynamic and multi-textured font assets.
// See: https://forum.unity.com/threads/text-mesh-pro-fallback-localization.921551/
// This script helps to bypass this issue, by clearing asset data on every font assets that used by this project.
export default class FontFixer extends ZepetoScriptBehaviour {
  @SerializeField()
  private fonts: TMP_FontAsset[];

  public Awake(): void {
    for (let font of this.fonts) Fix(font);
  }
}

function Fix(font: TMP_FontAsset): void {
  if (font.atlasPopulationMode !== AtlasPopulationMode.Dynamic) return;
  if (!font.isMultiAtlasTexturesEnabled) return;
  font.ClearFontAssetData(true);
  const _unused = font.atlasTextures;
}
