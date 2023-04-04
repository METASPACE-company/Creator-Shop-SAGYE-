Shader "METASPACE/TriPlanar (WorldSpace)" {
  Properties {
	  	_GlobalTint("Global Tint", Color) = (1, 1, 1, 1)
	  	_TopTint("Top Tint", Color) = (1, 1, 1, 1)
	  	_SideTint("Side Tint", Color) = (1, 1, 1, 1)
	  	_BottomTint("Bottom Tint", Color) = (1, 1, 1, 1)
		_Top("Top", 2D) = "white" {}
		_Side("Side", 2D) = "white" {}
		_Bottom("Bottom", 2D) = "white" {}
		_TopScale("Top Scale", Float) = 1
		_SideScale("Side Scale", Float) = 1
		_BottomScale ("Bottom Scale", Float) = 1
        _Smoothness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
		_Alpha ("Alpha", Range(0, 1)) = 1
	}
	
	SubShader {
		Tags { "Queue" = "Geometry" "IgnoreProjector" = "True" "RenderType" = "Opaque" }

		Cull Back
		ZWrite On
		CGPROGRAM
		#pragma surface surf Standard fullforwardshadows
		#pragma target 3.0

		fixed4 _GlobalTint, _TopTint, _SideTint, _BottomTint;
		sampler2D _Side, _Top, _Bottom;
		sampler2D _DitherTex;
		float _SideScale, _TopScale, _BottomScale;
		
		half _Smoothness;
        half _Metallic;
		half _Alpha;
		half _DitherScale;
		
		struct Input {
			float3 worldPos;
			float3 worldNormal;
			float4 screenPos;
		};
			
		void surf (Input IN, inout SurfaceOutputStandard o) {
			float3 projNormal = saturate(pow(IN.worldNormal * 1.4, 4));
			
			// TOP / BOTTOM
			float3 y = 0;
			if (IN.worldNormal.y > 0) {
				float2 uvTop = frac(IN.worldPos.zx * _TopScale);
				uvTop.x *= -1;
				y = tex2D(_Top, uvTop) * abs(IN.worldNormal.y) * _TopTint;
			} else {
				float2 uvBottom = frac(IN.worldPos.zx * _BottomScale);
				uvBottom *= -1;
				y = tex2D(_Bottom, uvBottom) * abs(IN.worldNormal.y) * _BottomTint;
			}
			
			// SIDE X
			float3 x = tex2D(_Side, frac(IN.worldPos.zy * _SideScale)) * abs(IN.worldNormal.x) * _SideTint;
			// SIDE Z	
			float3 z = tex2D(_Side, frac(IN.worldPos.xy * _SideScale)) * abs(IN.worldNormal.z) * _SideTint;
			
			o.Albedo = z;
			o.Albedo = lerp(o.Albedo, x, projNormal.x);
			o.Albedo = lerp(o.Albedo, y, projNormal.y);
			o.Albedo *= _GlobalTint;

			o.Metallic = _Metallic;
            o.Smoothness = _Smoothness;
		} 
		ENDCG
	}
	Fallback "Diffuse"
}