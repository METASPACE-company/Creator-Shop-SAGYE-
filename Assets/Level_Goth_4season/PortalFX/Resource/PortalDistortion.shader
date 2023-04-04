Shader "Metaspace/PortalDistortion" { 
	Properties{
		_MainTex("Albedo", 2D) = "white" {}
		_Size("Distortion Size", Range(0, 0.1)) = 0.05

		_DistortionSpeed("Distortion Speed", Float) = 1
		_DistortionMap("Distortion Map", 2D) = "white" {}
		_DistortionMask("Distortion Mask", 2D) = "white" {}
		_MaskLayer("Mask Layer", Int) = 0
		_MaskComp("Mask Composition", Int) = 0
		_MaskOp("Mask Operation", Int) = 0
	}
	SubShader{
		Tags { "RenderType" = "Transparent" "Queue" = "Transparent" }
		zwrite off
		cull off

		GrabPass{
			"_ScreenTex"
		}
		Stencil{
			Ref[_MaskLayer]
			Comp [_MaskComp]
			Pass [_MaskOp]
		}
		Pass{
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag

			#include "UnityCG.cginc"

			struct appdata {
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f {
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
				float4 screenPos : TEXCOORD1;
			};

			sampler2D _ScreenTex;
			sampler2D _MainTex;
			sampler2D _DistortionMap;
			sampler2D _DistortionMask;
			float4 _MainTex_ST;
			float _Size;
			float _DistortionSpeed;

			v2f vert(appdata v) {
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				o.screenPos = ComputeScreenPos(o.vertex);
				return o;
			}

			fixed4 frag(v2f i) : SV_Target{
				float2 screenUV = i.screenPos.xy / i.screenPos.w;

				float2 uv = i.uv;
				uv.y += -_Time.y * _DistortionSpeed;
				
				fixed4 distMap = tex2D(_DistortionMap, uv);
				fixed4 distMask = tex2D(_DistortionMask, i.uv);
				distMap *= distMask.r;
				float2 normal = normalize(float2(uv.x, 1-uv.y) - 0.5);

				screenUV += normal * (distMap.r * _Size);
				
				fixed4 col = tex2D(_ScreenTex, screenUV);
				return col;
			}
			ENDCG
		}
	}
}