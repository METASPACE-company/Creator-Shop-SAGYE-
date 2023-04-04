// Made with Amplify Shader Editor v1.9.1.2
// Available at the Unity Asset Store - http://u3d.as/y3X 
Shader "ASESampleShaders/Fake Interiors FREE"
{
	Properties
	{
		_RoomColorTint("Room Color Tint", Color) = (1,1,1,0)
		_RoomIntensity("Room Intensity", Range( 0 , 100)) = 1
		[Toggle(_FACADETEXTURE_ON)] _FacadeTexture("Facade Texture", Float) = 0
		[NoScaleOffset]_FacadeAlbedo("Facade Albedo", 2D) = "black" {}
		_FacadeTiling("Facade Tiling", Range( 0.5 , 20)) = 0
		[NoScaleOffset]_FacadeSmoothness("Facade Smoothness", 2D) = "white" {}
		_SmoothnessValue("Smoothness Value", Range( 0 , 1)) = 1
		[NoScaleOffset]_Floor("Floor", 2D) = "white" {}
		_FloorTexTiling("Floor Tex Tiling", Range( 0 , 10)) = 0
		[NoScaleOffset]_Wall("Wall", 2D) = "white" {}
		_WalltexTiling("Wall tex Tiling", Range( 0 , 100)) = 0
		_WalltexXTiling("Wall tex XTiling", Range( 0 , 100)) = 1
		_WalltexYTiling("Wall tex YTiling", Range( 0 , 100)) = 1
		[Toggle(_TOGGLEPROPLAYER_ON)] _TogglePropLayer("Toggle Prop Layer", Float) = 0
		[NoScaleOffset]_Props("Props", 2D) = "white" {}
		[Toggle(_SWITCHPLANE_ON)] _SwitchPlane("Switch Plane", Float) = 0
		_PropsTexTiling("Props Tex Tiling", Range( 0 , 100)) = 0
		[NoScaleOffset]_Back("Back", 2D) = "white" {}
		_BackWallTexTiling("Back Wall Tex Tiling", Range( 0 , 100)) = 0
		_BackWalltexXTiling("Back Wall tex XTiling", Range( 0 , 100)) = 1
		_BackWalltexYOffset("Back Wall tex Y Offset", Range( 0 , 100)) = 1
		_BackWalltexXOffset("Back Wall tex X Offset", Range( 0 , 100)) = 1
		[NoScaleOffset]_Ceiling("Ceiling", 2D) = "white" {}
		_CeilingTexTiling("Ceiling Tex Tiling", Range( 0 , 100)) = 0
		_RoomTile("Room Tile", Range( 0.1 , 10)) = 0
		_RoomsXYZPropsW("Rooms X Y Z , Props W", Vector) = (1,1,1,1)
		_PositionOffsetXYZroomsWprops("Position Offset, XYZ = rooms, W = props", Vector) = (0,0,0,0)
		_PropsOffset("Props Offset", Vector) = (0,0,0,0)
		_PropsSize("Props Size", Float) = 1
		[HideInInspector] _texcoord( "", 2D ) = "white" {}
		[HideInInspector] __dirty( "", Int ) = 1
	}

	SubShader
	{
		Tags{ "RenderType" = "Opaque"  "Queue" = "Geometry+0" "DisableBatching" = "True" }
		Cull Back
		CGPROGRAM
		#include "UnityShaderVariables.cginc"
		#pragma target 3.0
		#pragma shader_feature_local _FACADETEXTURE_ON
		#pragma shader_feature_local _SWITCHPLANE_ON
		#pragma shader_feature_local _TOGGLEPROPLAYER_ON
		#pragma surface surf Standard keepalpha addshadow fullforwardshadows vertex:vertexDataFunc 
		struct Input
		{
			float3 vertexToFrag447;
			float2 uv_texcoord;
		};

		uniform float4 _RoomColorTint;
		uniform float4 _RoomsXYZPropsW;
		uniform float _RoomTile;
		uniform float4 _PositionOffsetXYZroomsWprops;
		uniform sampler2D _Props;
		uniform float _PropsSize;
		uniform float2 _PropsOffset;
		uniform float _PropsTexTiling;
		uniform sampler2D _Wall;
		uniform float _WalltexXTiling;
		uniform float _WalltexTiling;
		uniform float _WalltexYTiling;
		uniform sampler2D _Back;
		uniform float _BackWalltexXTiling;
		uniform float _BackWallTexTiling;
		uniform float _BackWalltexXOffset;
		uniform float _BackWalltexYOffset;
		uniform sampler2D _Floor;
		uniform float _FloorTexTiling;
		uniform sampler2D _Ceiling;
		uniform float _CeilingTexTiling;
		uniform float _RoomIntensity;
		uniform sampler2D _FacadeAlbedo;
		uniform float4 _FacadeAlbedo_ST;
		uniform float _FacadeTiling;
		uniform sampler2D _FacadeSmoothness;
		uniform float _SmoothnessValue;

		void vertexDataFunc( inout appdata_full v, out Input o )
		{
			UNITY_INITIALIZE_OUTPUT( Input, o );
			float3 ase_vertex3Pos = v.vertex.xyz;
			o.vertexToFrag447 = ase_vertex3Pos;
		}

		void surf( Input i , inout SurfaceOutputStandard o )
		{
			float4 temp_output_174_0 = ( ( _RoomsXYZPropsW + float4( -1E-05,-1E-05,-1E-05,-1E-05 ) ) * _RoomTile );
			#ifdef _SWITCHPLANE_ON
				float staticSwitch479 = (i.vertexToFrag447).z;
			#else
				float staticSwitch479 = (i.vertexToFrag447).x;
			#endif
			float4 appendResult465 = (float4(i.vertexToFrag447 , staticSwitch479));
			float4 InterpVertexPos448 = appendResult465;
			float4 temp_output_46_0 = ( InterpVertexPos448 - _PositionOffsetXYZroomsWprops );
			float4 appendResult373 = (float4(_WorldSpaceCameraPos , 1.0));
			float4 temp_output_374_0 = mul( unity_WorldToObject, appendResult373 );
			#ifdef _SWITCHPLANE_ON
				float staticSwitch480 = (temp_output_374_0).z;
			#else
				float staticSwitch480 = (temp_output_374_0).x;
			#endif
			float4 appendResult468 = (float4((temp_output_374_0).xyz , staticSwitch480));
			float4 TransCameraPos445 = appendResult468;
			float4 V2177 = ( TransCameraPos445 - _PositionOffsetXYZroomsWprops );
			float4 V1182 = ( temp_output_46_0 - V2177 );
			float4 temp_output_59_0 = ( ( ( ( floor( ( temp_output_174_0 * temp_output_46_0 ) ) + step( float4( 0,0,0,0 ) , V1182 ) ) / temp_output_174_0 ) - V2177 ) / V1182 );
			float Y189 = (temp_output_59_0).y;
			float newPlane383 = (temp_output_59_0).w;
			float Z190 = (temp_output_59_0).z;
			float4 temp_output_389_0 = ( ( newPlane383 * V1182 ) + V2177 );
			#ifdef _SWITCHPLANE_ON
				float2 staticSwitch482 = (temp_output_389_0).xy;
			#else
				float2 staticSwitch482 = (temp_output_389_0).yz;
			#endif
			float2 break394 = ( _PropsOffset + ( staticSwitch482 * _PropsTexTiling ) );
			float temp_output_569_0 = ( _PropsSize * break394.x );
			float2 appendResult546 = (float2(temp_output_569_0 , break394.x));
			float2 appendResult396 = (float2(temp_output_569_0 , break394.y));
			#ifdef _SWITCHPLANE_ON
				float2 staticSwitch490 = appendResult396;
			#else
				float2 staticSwitch490 = appendResult546;
			#endif
			float4 tex2DNode285 = tex2Dbias( _Props, float4( staticSwitch490, 0, -1.0) );
			float4 break504 = tex2DNode285;
			float4 appendResult505 = (float4(break504.r , break504.g , break504.b , 0.0));
			#ifdef _TOGGLEPROPLAYER_ON
				float4 staticSwitch502 = tex2DNode285;
			#else
				float4 staticSwitch502 = appendResult505;
			#endif
			float4 PropsVar428 = staticSwitch502;
			float temp_output_300_0 = step( newPlane383 , ( Z190 * (PropsVar428).w ) );
			float ifLocalVar416 = 0;
			if( temp_output_300_0 <= 0.0 )
				ifLocalVar416 = Z190;
			else
				ifLocalVar416 = newPlane383;
			float X188 = (temp_output_59_0).x;
			float temp_output_402_0 = step( ifLocalVar416 , X188 );
			float ifLocalVar422 = 0;
			if( temp_output_402_0 <= 0.0 )
				ifLocalVar422 = X188;
			else
				ifLocalVar422 = ifLocalVar416;
			float2 break145 = ( (( ( Z190 * V1182 ) + V2177 )).xy * _WalltexTiling );
			float2 appendResult147 = (float2(( _WalltexXTiling * break145.x ) , ( _WalltexYTiling * break145.y )));
			float4 WallVar426 = tex2D( _Wall, appendResult147 );
			float4 ifLocalVar407 = 0;
			if( temp_output_300_0 <= 0.0 )
				ifLocalVar407 = WallVar426;
			else
				ifLocalVar407 = PropsVar428;
			float2 break555 = ( (( ( X188 * V1182 ) + V2177 )).zy * _BackWallTexTiling );
			float2 appendResult556 = (float2(( ( _BackWalltexXTiling * break555.x ) + _BackWalltexXOffset ) , ( _BackWalltexYOffset + break555.y )));
			float4 BackVar430 = tex2D( _Back, appendResult556 );
			float4 ifLocalVar408 = 0;
			if( temp_output_402_0 <= 0.0 )
				ifLocalVar408 = BackVar430;
			else
				ifLocalVar408 = ifLocalVar407;
			float2 temp_output_79_0 = (( ( Y189 * V1182 ) + V2177 )).xz;
			float Y_inverted191 = (V1182).y;
			float4 lerpResult435 = lerp( tex2D( _Floor, ( temp_output_79_0 * _FloorTexTiling ) ) , tex2D( _Ceiling, ( temp_output_79_0 * _CeilingTexTiling ) ) , step( 0.0 , Y_inverted191 ));
			float4 CeilVar432 = lerpResult435;
			float4 ifLocalVar423 = 0;
			if( Y189 <= ifLocalVar422 )
				ifLocalVar423 = CeilVar432;
			else
				ifLocalVar423 = ifLocalVar408;
			float4 temp_output_540_0 = ( _RoomColorTint * ( ifLocalVar423 * _RoomIntensity ) );
			float2 uv_FacadeAlbedo = i.uv_texcoord * _FacadeAlbedo_ST.xy + _FacadeAlbedo_ST.zw;
			float2 uv1544 = ( uv_FacadeAlbedo * _FacadeTiling );
			float4 tex2DNode1 = tex2D( _FacadeAlbedo, uv1544 );
			float4 lerpResult2 = lerp( temp_output_540_0 , tex2DNode1 , tex2DNode1.a);
			#ifdef _FACADETEXTURE_ON
				float4 staticSwitch523 = lerpResult2;
			#else
				float4 staticSwitch523 = temp_output_540_0;
			#endif
			o.Albedo = staticSwitch523.rgb;
			#ifdef _FACADETEXTURE_ON
				float staticSwitch542 = ( tex2D( _FacadeSmoothness, uv1544 ).r * _SmoothnessValue );
			#else
				float staticSwitch542 = 0.0;
			#endif
			o.Smoothness = staticSwitch542;
			o.Alpha = 1;
		}

		ENDCG
	}
	Fallback "Diffuse"
	CustomEditor "ASEFakeInspector"
}
/*ASEBEGIN
Version=19102
Node;AmplifyShaderEditor.CommentaryNode;453;-4305.528,2324.286;Inherit;False;1682.485;471.1538;Comment;11;445;468;376;480;467;481;374;372;373;370;371;;1,1,1,1;0;0
Node;AmplifyShaderEditor.WorldSpaceCameraPos;370;-4255.528,2525.177;Inherit;False;0;4;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3
Node;AmplifyShaderEditor.RangedFloatNode;371;-4159.529,2621.178;Float;False;Constant;_Float4;Float 4;11;0;Create;True;0;0;0;False;0;False;1;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.DynamicAppendNode;373;-3951.53,2557.177;Inherit;False;FLOAT4;4;0;FLOAT3;0,0,0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.CommentaryNode;452;-4066.409,1876.72;Inherit;False;1411.799;332.554;Comment;7;448;465;466;447;369;477;479;;1,1,1,1;0;0
Node;AmplifyShaderEditor.WorldToObjectMatrix;372;-4015.53,2429.178;Inherit;False;0;1;FLOAT4x4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;374;-3744,2400;Inherit;False;2;2;0;FLOAT4x4;0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.PosVertexDataNode;369;-4016.409,1926.719;Inherit;False;0;0;5;FLOAT3;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.ComponentMaskNode;467;-3552,2496;Inherit;False;False;False;True;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;481;-3552,2592;Inherit;False;True;False;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.VertexToFragmentNode;447;-3782.554,1952.913;Inherit;False;False;False;1;0;FLOAT3;0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.StaticSwitch;480;-3312,2528;Float;False;Property;_SwitchPlane;Switch Plane;14;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT;0;False;0;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;0;False;6;FLOAT;0;False;7;FLOAT;0;False;8;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;376;-3552,2400;Inherit;False;True;True;True;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT3;0
Node;AmplifyShaderEditor.ComponentMaskNode;466;-3536,2032;Inherit;False;False;False;True;False;1;0;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;477;-3536,2112;Inherit;False;True;False;False;False;1;0;FLOAT3;0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.StaticSwitch;479;-3296,2064;Float;False;Property;_SwitchPlane;Switch Plane;16;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT;0;False;0;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;0;False;6;FLOAT;0;False;7;FLOAT;0;False;8;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.CommentaryNode;439;-2352.078,2657.926;Inherit;False;2944.635;705.8434;Comment;32;187;191;64;383;459;190;189;188;65;63;62;186;59;181;58;177;40;182;220;50;51;57;450;54;451;458;46;45;170;174;457;454;;1,1,1,1;0;0
Node;AmplifyShaderEditor.DynamicAppendNode;468;-3088,2400;Inherit;False;FLOAT4;4;0;FLOAT3;0,0,0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;450;-2160,3248;Inherit;False;445;TransCameraPos;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.DynamicAppendNode;465;-3088,1952;Inherit;False;FLOAT4;4;0;FLOAT3;0,0,0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;445;-2880,2400;Float;False;TransCameraPos;-1;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.Vector4Node;458;-2288,3056;Float;False;Property;_PositionOffsetXYZroomsWprops;Position Offset, XYZ = rooms, W = props;26;0;Create;True;0;0;0;False;0;False;0,0,0,0;0,0,0,0;0;5;FLOAT4;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SimpleSubtractOpNode;54;-1808,3136;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;448;-2880,1968;Float;False;InterpVertexPos;-1;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.Vector4Node;454;-2256,2720;Float;False;Property;_RoomsXYZPropsW;Rooms X Y Z , Props W;25;0;Create;True;0;0;0;False;0;False;1,1,1,1;0,0,0,0;0;5;FLOAT4;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;451;-2144,2928;Inherit;False;448;InterpVertexPos;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RangedFloatNode;170;-1952,2832;Float;False;Property;_RoomTile;Room Tile;24;0;Create;True;0;0;0;False;0;False;0;0;0.1;10;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleSubtractOpNode;46;-1808,2928;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;177;-1600,3088;Float;False;V2;-1;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleAddOpNode;457;-1872,2720;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;-1E-05,-1E-05,-1E-05,-1E-05;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;174;-1616,2720;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleSubtractOpNode;40;-1328,3008;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;45;-1392,2832;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;182;-1152,3008;Float;False;V1;-1;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.StepOpNode;220;-928,2928;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.FloorOpNode;50;-1104,2832;Inherit;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleAddOpNode;51;-784,2832;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;181;-640,2864;Inherit;False;177;V2;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleDivideOpNode;57;-640,2704;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleSubtractOpNode;58;-432,2704;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;186;-400,2864;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleDivideOpNode;59;-221.457,2706.26;Inherit;False;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.ComponentMaskNode;459;64,3040;Inherit;False;False;False;False;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.CommentaryNode;469;-1735.206,1888.747;Inherit;False;4253.089;503.6826;;25;393;394;569;565;396;546;490;570;390;564;428;502;505;504;503;285;548;482;392;483;389;386;387;384;385;Props;1,1,1,1;0;0
Node;AmplifyShaderEditor.GetLocalVarNode;385;-1664,2064;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;383;304,3040;Float;False;newPlane;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;384;-1664,1952;Inherit;False;383;newPlane;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;387;-1392,1952;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;386;-1392,2064;Inherit;False;177;V2;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleAddOpNode;389;-1152,1952;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.ComponentMaskNode;483;-992,2032;Inherit;False;False;True;True;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.ComponentMaskNode;392;-992,1952;Inherit;False;True;True;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.StaticSwitch;482;-760.4022,1978.339;Float;False;Property;_SwitchPlane;Switch Plane;15;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT2;0,0;False;0;FLOAT2;0,0;False;2;FLOAT2;0,0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT2;0,0;False;6;FLOAT2;0,0;False;7;FLOAT2;0,0;False;8;FLOAT2;0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.CommentaryNode;96;-1618.76,1121.868;Inherit;False;2337.914;375.4672;;16;426;84;147;145;85;87;160;88;89;179;197;184;550;552;557;558;Walls;1,1,1,1;0;0
Node;AmplifyShaderEditor.ComponentMaskNode;65;64,2928;Inherit;False;False;False;True;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;197;-1590.617,1206.504;Inherit;False;190;Z;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;184;-1594.35,1325.088;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;190;304,2928;Float;False;Z;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;179;-1338.845,1319.489;Inherit;False;177;V2;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;89;-1312.661,1193.268;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.ComponentMaskNode;62;64,2720;Inherit;False;True;False;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;63;64,2816;Inherit;False;False;True;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.CommentaryNode;83;-1600,-400;Inherit;False;1975.845;668.0294;;16;438;437;432;435;77;156;152;154;76;78;79;81;180;82;198;183;Floor Ceiling;1,1,1,1;0;0
Node;AmplifyShaderEditor.SimpleAddOpNode;88;-1094.661,1229.068;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.CommentaryNode;97;-1618.529,445.1293;Inherit;False;2183.789;473.0495;;17;430;90;556;555;554;91;196;547;167;93;94;178;185;553;559;561;562;Back Wall;1,1,1,1;0;0
Node;AmplifyShaderEditor.GetLocalVarNode;185;-1584,624;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.CommentaryNode;434;1112.81,-424.9084;Inherit;False;1936.548;573.6697;;17;429;427;441;443;300;401;423;433;406;408;422;431;407;402;416;404;302;Mix;0,0.7426471,0.6100315,1;0;0
Node;AmplifyShaderEditor.GetLocalVarNode;183;-1568,-240;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;188;304,2720;Float;False;X;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;189;304,2816;Float;False;Y;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;198;-1568,-336;Inherit;False;189;Y;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;178;-1314.949,630.5462;Inherit;False;177;V2;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;180;-1296,-224;Inherit;False;177;V2;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;82;-1296,-336;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;429;1171.358,-6.908606;Inherit;False;428;PropsVar;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;94;-1289.429,502.3284;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleAddOpNode;93;-1088,512;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.SimpleAddOpNode;81;-1088,-336;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.ComponentMaskNode;441;1379.358,-102.9086;Inherit;False;False;False;False;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;401;1171.358,-246.9087;Inherit;False;190;Z;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;187;-176,3152;Inherit;False;182;V1;1;0;OBJECT;;False;1;FLOAT4;0
Node;AmplifyShaderEditor.GetLocalVarNode;302;1171.358,-342.9085;Inherit;False;383;newPlane;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;167;-1020.3,734.6727;Float;False;Property;_BackWallTexTiling;Back Wall Tex Tiling;18;0;Create;True;0;0;0;False;0;False;0;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;64;59.47368,3154.062;Inherit;False;False;True;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;152;-976,-208;Float;False;Property;_FloorTexTiling;Floor Tex Tiling;8;0;Create;True;0;0;0;False;0;False;0;0;0;10;0;1;FLOAT;0
Node;AmplifyShaderEditor.SwizzleNode;547;-914.4818,510.285;Inherit;False;FLOAT2;2;1;2;3;1;0;FLOAT4;0,0,0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.RangedFloatNode;156;-976,-32;Float;False;Property;_CeilingTexTiling;Ceiling Tex Tiling;23;0;Create;True;0;0;0;False;0;False;0;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;443;1587.358,-166.9088;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;79;-896,-336;Inherit;False;True;False;True;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SamplerNode;84;-4.908778,1198.819;Inherit;True;Property;_Wall;Wall;9;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;154;-608,-144;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.StepOpNode;300;1763.358,-198.9087;Inherit;False;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;78;-608,-336;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;191;304,3152;Float;False;Y_inverted;-1;True;1;0;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;438;-464,128;Inherit;False;191;Y_inverted;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;76;-400,-320;Inherit;True;Property;_Floor;Floor;7;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;404;1923.358,-182.9088;Inherit;False;188;X;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;77;-400,-96;Inherit;True;Property;_Ceiling;Ceiling;22;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;427;1635.358,57.09155;Inherit;False;426;WallVar;1;0;OBJECT;;False;1;COLOR;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;426;433.8004,1190.307;Float;False;WallVar;-1;True;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.ConditionalIfNode;416;1923.358,-374.9084;Inherit;False;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;4;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.StepOpNode;437;-224,112;Inherit;False;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;431;2163.359,41.09142;Inherit;False;430;BackVar;1;0;OBJECT;;False;1;COLOR;0
Node;AmplifyShaderEditor.CommentaryNode;17;2266.567,-974.0939;Inherit;False;1149.9;438.2001;Facade;5;1;5;7;544;549;Facade Texture (Optional);1,1,1,1;0;0
Node;AmplifyShaderEditor.StepOpNode;402;2211.359,-134.9087;Inherit;False;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;435;-48,-224;Inherit;False;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.ConditionalIfNode;407;1923.358,-54.90866;Inherit;False;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT4;0,0,0,0;False;3;COLOR;0,0,0,0;False;4;COLOR;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.ConditionalIfNode;422;2435.359,-374.9084;Inherit;False;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;4;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;432;144,-208;Float;False;CeilVar;-1;True;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.RangedFloatNode;7;2401.896,-713.6086;Float;False;Property;_FacadeTiling;Facade Tiling;4;0;Create;True;0;0;0;False;0;False;0;0;0.5;20;0;1;FLOAT;0
Node;AmplifyShaderEditor.GetLocalVarNode;433;2627.359,25.09142;Inherit;False;432;CeilVar;1;0;OBJECT;;False;1;COLOR;0
Node;AmplifyShaderEditor.ConditionalIfNode;408;2435.359,-54.90866;Inherit;False;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT4;0,0,0,0;False;3;COLOR;0,0,0,0;False;4;COLOR;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.TextureCoordinatesNode;5;2458.543,-896.6008;Inherit;False;0;1;2;3;2;SAMPLER2D;;False;0;FLOAT2;1,1;False;1;FLOAT2;0,0;False;5;FLOAT2;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;406;2435.359,-182.9088;Inherit;False;189;Y;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.CommentaryNode;531;3940.052,-521.1082;Inherit;False;756.148;364.6559;Facade Smoothness;4;545;529;527;528;Facade Texture Smoothness (Optional);1,1,1,1;0;0
Node;AmplifyShaderEditor.RangedFloatNode;534;3087.861,-94.62611;Float;False;Property;_RoomIntensity;Room Intensity;1;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;549;2709.111,-826.7999;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.ConditionalIfNode;423;2867.359,-182.9088;Inherit;False;False;5;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT4;0,0,0,0;False;3;COLOR;0,0,0,0;False;4;COLOR;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.CommentaryNode;541;3242.607,-477.6594;Inherit;False;516.0437;257;Tint Room;2;540;539;;1,1,1,1;0;0
Node;AmplifyShaderEditor.ColorNode;539;3292.607,-427.6594;Float;False;Property;_RoomColorTint;Room Color Tint;0;0;Create;True;0;0;0;False;0;False;1,1,1,0;0,0,0,0;False;0;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.GetLocalVarNode;545;3956.381,-455.5658;Inherit;False;544;uv1;1;0;OBJECT;;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;533;3424.648,-181.2098;Inherit;False;2;2;0;FLOAT4;0,0,0,0;False;1;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;544;2876.13,-809.8018;Float;False;uv1;-1;True;1;0;FLOAT2;0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;540;3589.651,-422.7291;Inherit;False;2;2;0;COLOR;0,0,0,0;False;1;FLOAT4;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.SamplerNode;527;4133.422,-471.1082;Inherit;True;Property;_FacadeSmoothness;Facade Smoothness;5;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;528;4158.646,-259.5047;Float;False;Property;_SmoothnessValue;Smoothness Value;6;0;Create;True;0;0;0;False;0;False;1;0;0;1;0;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;1;3124.581,-841.6978;Inherit;True;Property;_FacadeAlbedo;Facade Albedo;3;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;black;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;543;4724.413,-394.4875;Float;False;Constant;_SmoothnessZero;SmoothnessZero;26;0;Create;True;0;0;0;False;0;False;0;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;529;4527.194,-471.1082;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.LerpOp;2;3705.181,-708.7843;Inherit;False;3;0;COLOR;0,0,0,0;False;1;COLOR;0,0,0,0;False;2;FLOAT;0;False;1;COLOR;0
Node;AmplifyShaderEditor.StaticSwitch;542;4885.75,-590.3005;Float;False;Property;_FacadeTexture;Facade Texture;2;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT;0;False;0;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;0;False;6;FLOAT;0;False;7;FLOAT;0;False;8;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.StaticSwitch;523;3992.917,-726.223;Float;False;Property;_FacadeTexture;Facade Texture;2;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;COLOR;0,0,0,0;False;0;COLOR;0,0,0,0;False;2;COLOR;0,0,0,0;False;3;COLOR;0,0,0,0;False;4;COLOR;0,0,0,0;False;5;COLOR;0,0,0,0;False;6;COLOR;0,0,0,0;False;7;COLOR;0,0,0,0;False;8;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.StandardSurfaceOutputNode;0;5274.151,-771.741;Float;False;True;-1;2;ASEFakeInspector;0;0;Standard;ASESampleShaders/Fake Interiors FREE;False;False;False;False;False;False;False;False;False;False;False;False;False;True;False;False;False;False;False;False;False;Back;0;False;;0;False;;False;0;False;;0;False;;False;0;Opaque;0.5;True;True;0;False;Opaque;;Geometry;All;12;all;True;True;True;True;0;False;;False;0;False;;255;False;;255;False;;0;False;;0;False;;0;False;;0;False;;0;False;;0;False;;0;False;;0;False;;False;2;15;10;25;False;0.5;True;0;0;False;;0;False;;0;0;False;;0;False;;0;False;;0;False;;0;False;0;0,0,0,0;VertexOffset;True;False;Cylindrical;False;True;Relative;0;;-1;-1;-1;-1;0;False;0;0;False;;-1;0;False;;0;0;0;False;0.1;False;;0;False;;False;16;0;FLOAT3;0,0,0;False;1;FLOAT3;0,0,0;False;2;FLOAT3;0,0,0;False;3;FLOAT;0;False;4;FLOAT;0;False;5;FLOAT;0;False;6;FLOAT3;0,0,0;False;7;FLOAT3;0,0,0;False;8;FLOAT;0;False;9;FLOAT;0;False;10;FLOAT;0;False;13;FLOAT3;0,0,0;False;11;FLOAT3;0,0,0;False;12;FLOAT3;0,0,0;False;14;FLOAT4;0,0,0,0;False;15;FLOAT3;0,0,0;False;0
Node;AmplifyShaderEditor.GetLocalVarNode;196;-1584,512;Inherit;False;188;X;1;0;OBJECT;;False;1;FLOAT;0
Node;AmplifyShaderEditor.ComponentMaskNode;87;-923.5604,1215.467;Inherit;False;True;True;False;False;1;0;FLOAT4;0,0,0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;85;-676.8603,1278.367;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.RangedFloatNode;160;-995.6422,1385.24;Float;False;Property;_WalltexTiling;Wall tex Tiling;10;0;Create;True;0;0;0;False;0;False;0;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.BreakToComponentsNode;145;-511.3466,1267.525;Inherit;False;FLOAT2;1;0;FLOAT2;0,0;False;16;FLOAT;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4;FLOAT;5;FLOAT;6;FLOAT;7;FLOAT;8;FLOAT;9;FLOAT;10;FLOAT;11;FLOAT;12;FLOAT;13;FLOAT;14;FLOAT;15
Node;AmplifyShaderEditor.DynamicAppendNode;147;-174.8859,1251.825;Inherit;False;FLOAT2;4;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;552;-333.902,1202.188;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;430;253.0575,542.0879;Float;False;BackVar;-1;True;1;0;COLOR;0,0,0,0;False;1;COLOR;0
Node;AmplifyShaderEditor.SamplerNode;90;-79.27499,532.8821;Inherit;True;Property;_Back;Back;17;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;Auto;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;550;-643.902,1169.188;Float;False;Property;_WalltexXTiling;Wall tex XTiling;11;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;557;-605.6241,1403.762;Float;False;Property;_WalltexYTiling;Wall tex YTiling;12;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;558;-251.3244,1381.26;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleAddOpNode;561;-417.5145,779.9796;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;559;-786.0243,807.441;Float;False;Property;_BackWalltexYOffset;Back Wall tex Y Offset;20;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;563;-489.7249,354.3085;Float;False;Property;_BackWalltexXOffset;Back Wall tex X Offset;21;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;91;-738.0705,598.8983;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.BreakToComponentsNode;555;-585.7514,637.8296;Inherit;False;FLOAT2;1;0;FLOAT2;0,0;False;16;FLOAT;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4;FLOAT;5;FLOAT;6;FLOAT;7;FLOAT;8;FLOAT;9;FLOAT;10;FLOAT;11;FLOAT;12;FLOAT;13;FLOAT;14;FLOAT;15
Node;AmplifyShaderEditor.RangedFloatNode;553;-764.6428,462.8835;Float;False;Property;_BackWalltexXTiling;Back Wall tex XTiling;19;0;Create;True;0;0;0;False;0;False;1;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;554;-462.4707,537.9808;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.DynamicAppendNode;556;-205.6194,630.8601;Inherit;False;FLOAT2;4;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleAddOpNode;562;-301.2151,501.8471;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
Node;AmplifyShaderEditor.Vector2Node;564;-679.9241,2218.924;Inherit;False;Property;_PropsOffset;Props Offset;27;0;Create;True;0;0;0;False;0;False;0,0;0,0;0;3;FLOAT2;0;FLOAT;1;FLOAT;2
Node;AmplifyShaderEditor.RangedFloatNode;390;-949.8682,2144.078;Float;False;Property;_PropsTexTiling;Props Tex Tiling;16;0;Create;True;0;0;0;False;0;False;0;0;0;100;0;1;FLOAT;0
Node;AmplifyShaderEditor.RangedFloatNode;548;652.6951,2174.857;Float;False;Constant;_Float0;Float 0;26;0;Create;True;0;0;0;False;0;False;-1;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.SamplerNode;285;808.1213,1982.233;Inherit;True;Property;_Props;Props;15;1;[NoScaleOffset];Create;True;0;0;0;False;0;False;-1;None;None;True;0;False;white;Auto;False;Object;-1;MipBias;Texture2D;8;0;SAMPLER2D;;False;1;FLOAT2;0,0;False;2;FLOAT;0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT;1;False;6;FLOAT;0;False;7;SAMPLERSTATE;;False;5;COLOR;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4
Node;AmplifyShaderEditor.RangedFloatNode;503;1168.711,2228.782;Float;False;Constant;_Float3;Float 3;21;0;Create;True;0;0;0;False;0;False;0;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.BreakToComponentsNode;504;1135.36,2070.8;Inherit;False;COLOR;1;0;COLOR;0,0,0,0;False;16;FLOAT;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4;FLOAT;5;FLOAT;6;FLOAT;7;FLOAT;8;FLOAT;9;FLOAT;10;FLOAT;11;FLOAT;12;FLOAT;13;FLOAT;14;FLOAT;15
Node;AmplifyShaderEditor.DynamicAppendNode;505;1428.499,2093.62;Inherit;False;FLOAT4;4;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.StaticSwitch;502;1623.341,1963.726;Float;False;Property;_TogglePropLayer;Toggle Prop Layer;13;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT4;0,0,0,0;False;0;FLOAT4;0,0,0,0;False;2;FLOAT4;0,0,0,0;False;3;FLOAT4;0,0,0,0;False;4;FLOAT4;0,0,0,0;False;5;FLOAT4;0,0,0,0;False;6;FLOAT4;0,0,0,0;False;7;FLOAT4;0,0,0,0;False;8;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.RegisterLocalVarNode;428;1890.745,1963.621;Float;False;PropsVar;-1;True;1;0;FLOAT4;0,0,0,0;False;1;FLOAT4;0
Node;AmplifyShaderEditor.StaticSwitch;490;571.6202,1962.272;Float;False;Property;_SwitchPlane;Switch Plane;17;0;Create;True;0;0;0;False;0;False;0;0;0;True;;Toggle;2;Key0;Key1;Create;True;True;All;9;1;FLOAT2;0,0;False;0;FLOAT2;0,0;False;2;FLOAT2;0,0;False;3;FLOAT2;0,0;False;4;FLOAT2;0,0;False;5;FLOAT2;0,0;False;6;FLOAT2;0,0;False;7;FLOAT2;0,0;False;8;FLOAT2;0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleAddOpNode;565;-363.9241,2181.924;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT2;0,0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;393;-535,2094;Inherit;False;2;2;0;FLOAT2;0,0;False;1;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.BreakToComponentsNode;394;-175.9734,2075.771;Inherit;False;FLOAT2;1;0;FLOAT2;0,0;False;16;FLOAT;0;FLOAT;1;FLOAT;2;FLOAT;3;FLOAT;4;FLOAT;5;FLOAT;6;FLOAT;7;FLOAT;8;FLOAT;9;FLOAT;10;FLOAT;11;FLOAT;12;FLOAT;13;FLOAT;14;FLOAT;15
Node;AmplifyShaderEditor.DynamicAppendNode;396;350.5762,1949.076;Inherit;False;FLOAT2;4;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.DynamicAppendNode;546;355.0709,2097.249;Inherit;False;FLOAT2;4;0;FLOAT;0;False;1;FLOAT;0;False;2;FLOAT;0;False;3;FLOAT;0;False;1;FLOAT2;0
Node;AmplifyShaderEditor.RangedFloatNode;570;-262.407,1953.069;Inherit;False;Property;_PropsSize;Props Size;28;0;Create;True;0;0;0;False;0;False;1;0;0;0;0;1;FLOAT;0
Node;AmplifyShaderEditor.SimpleMultiplyOpNode;569;-29.09619,1982.223;Inherit;False;2;2;0;FLOAT;0;False;1;FLOAT;0;False;1;FLOAT;0
WireConnection;373;0;370;0
WireConnection;373;3;371;0
WireConnection;374;0;372;0
WireConnection;374;1;373;0
WireConnection;467;0;374;0
WireConnection;481;0;374;0
WireConnection;447;0;369;0
WireConnection;480;1;481;0
WireConnection;480;0;467;0
WireConnection;376;0;374;0
WireConnection;466;0;447;0
WireConnection;477;0;447;0
WireConnection;479;1;477;0
WireConnection;479;0;466;0
WireConnection;468;0;376;0
WireConnection;468;3;480;0
WireConnection;465;0;447;0
WireConnection;465;3;479;0
WireConnection;445;0;468;0
WireConnection;54;0;450;0
WireConnection;54;1;458;0
WireConnection;448;0;465;0
WireConnection;46;0;451;0
WireConnection;46;1;458;0
WireConnection;177;0;54;0
WireConnection;457;0;454;0
WireConnection;174;0;457;0
WireConnection;174;1;170;0
WireConnection;40;0;46;0
WireConnection;40;1;177;0
WireConnection;45;0;174;0
WireConnection;45;1;46;0
WireConnection;182;0;40;0
WireConnection;220;1;182;0
WireConnection;50;0;45;0
WireConnection;51;0;50;0
WireConnection;51;1;220;0
WireConnection;57;0;51;0
WireConnection;57;1;174;0
WireConnection;58;0;57;0
WireConnection;58;1;181;0
WireConnection;59;0;58;0
WireConnection;59;1;186;0
WireConnection;459;0;59;0
WireConnection;383;0;459;0
WireConnection;387;0;384;0
WireConnection;387;1;385;0
WireConnection;389;0;387;0
WireConnection;389;1;386;0
WireConnection;483;0;389;0
WireConnection;392;0;389;0
WireConnection;482;1;483;0
WireConnection;482;0;392;0
WireConnection;65;0;59;0
WireConnection;190;0;65;0
WireConnection;89;0;197;0
WireConnection;89;1;184;0
WireConnection;62;0;59;0
WireConnection;63;0;59;0
WireConnection;88;0;89;0
WireConnection;88;1;179;0
WireConnection;188;0;62;0
WireConnection;189;0;63;0
WireConnection;82;0;198;0
WireConnection;82;1;183;0
WireConnection;94;0;196;0
WireConnection;94;1;185;0
WireConnection;93;0;94;0
WireConnection;93;1;178;0
WireConnection;81;0;82;0
WireConnection;81;1;180;0
WireConnection;441;0;429;0
WireConnection;64;0;187;0
WireConnection;547;0;93;0
WireConnection;443;0;401;0
WireConnection;443;1;441;0
WireConnection;79;0;81;0
WireConnection;84;1;147;0
WireConnection;154;0;79;0
WireConnection;154;1;156;0
WireConnection;300;0;302;0
WireConnection;300;1;443;0
WireConnection;78;0;79;0
WireConnection;78;1;152;0
WireConnection;191;0;64;0
WireConnection;76;1;78;0
WireConnection;77;1;154;0
WireConnection;426;0;84;0
WireConnection;416;0;300;0
WireConnection;416;2;302;0
WireConnection;416;3;401;0
WireConnection;416;4;401;0
WireConnection;437;1;438;0
WireConnection;402;0;416;0
WireConnection;402;1;404;0
WireConnection;435;0;76;0
WireConnection;435;1;77;0
WireConnection;435;2;437;0
WireConnection;407;0;300;0
WireConnection;407;2;429;0
WireConnection;407;3;427;0
WireConnection;407;4;427;0
WireConnection;422;0;402;0
WireConnection;422;2;416;0
WireConnection;422;3;404;0
WireConnection;422;4;404;0
WireConnection;432;0;435;0
WireConnection;408;0;402;0
WireConnection;408;2;407;0
WireConnection;408;3;431;0
WireConnection;408;4;431;0
WireConnection;549;0;5;0
WireConnection;549;1;7;0
WireConnection;423;0;406;0
WireConnection;423;1;422;0
WireConnection;423;2;408;0
WireConnection;423;3;433;0
WireConnection;423;4;433;0
WireConnection;533;0;423;0
WireConnection;533;1;534;0
WireConnection;544;0;549;0
WireConnection;540;0;539;0
WireConnection;540;1;533;0
WireConnection;527;1;545;0
WireConnection;1;1;544;0
WireConnection;529;0;527;1
WireConnection;529;1;528;0
WireConnection;2;0;540;0
WireConnection;2;1;1;0
WireConnection;2;2;1;4
WireConnection;542;1;543;0
WireConnection;542;0;529;0
WireConnection;523;1;540;0
WireConnection;523;0;2;0
WireConnection;0;0;523;0
WireConnection;0;4;542;0
WireConnection;87;0;88;0
WireConnection;85;0;87;0
WireConnection;85;1;160;0
WireConnection;145;0;85;0
WireConnection;147;0;552;0
WireConnection;147;1;558;0
WireConnection;552;0;550;0
WireConnection;552;1;145;0
WireConnection;430;0;90;0
WireConnection;90;1;556;0
WireConnection;558;0;557;0
WireConnection;558;1;145;1
WireConnection;561;0;559;0
WireConnection;561;1;555;1
WireConnection;91;0;547;0
WireConnection;91;1;167;0
WireConnection;555;0;91;0
WireConnection;554;0;553;0
WireConnection;554;1;555;0
WireConnection;556;0;562;0
WireConnection;556;1;561;0
WireConnection;562;0;554;0
WireConnection;562;1;563;0
WireConnection;285;1;490;0
WireConnection;285;2;548;0
WireConnection;504;0;285;0
WireConnection;505;0;504;0
WireConnection;505;1;504;1
WireConnection;505;2;504;2
WireConnection;505;3;503;0
WireConnection;502;1;505;0
WireConnection;502;0;285;0
WireConnection;428;0;502;0
WireConnection;490;1;546;0
WireConnection;490;0;396;0
WireConnection;565;0;564;0
WireConnection;565;1;393;0
WireConnection;393;0;482;0
WireConnection;393;1;390;0
WireConnection;394;0;565;0
WireConnection;396;0;569;0
WireConnection;396;1;394;1
WireConnection;546;0;569;0
WireConnection;546;1;394;0
WireConnection;569;0;570;0
WireConnection;569;1;394;0
ASEEND*/
//CHKSM=43CEF0AE12BD6E077522CAE442918EBF2E5CC376