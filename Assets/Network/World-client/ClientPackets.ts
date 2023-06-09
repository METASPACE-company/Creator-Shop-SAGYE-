//
//  __  __ _____ _____  _    ____  ____   _    ____ _____ 
// |  \/  | ____|_   _|/ \  / ___||  _ \ / \  / ___| ____|
// | |\/| |  _|   | | / _ \ \___ \| |_) / _ \| |   |  _|  
// | |  | | |___  | |/ ___ \ ___) |  __/ ___ \ |___| |___ 
// |_|  |_|_____| |_/_/   \_\____/|_| /_/   \_\____|_____|
//
// Packet definitions and utilities for the client.
// AUTO-GENERATED: This file is generated by the packet-gen 1.6.3.
// AUTO-GENERATED: DO NOT EDIT THIS FILE. All changes are removed when the files are re-generated.
//
// @ts-ignore
import { Quaternion, Vector3 } from "UnityEngine";
export namespace client {
	export namespace gesture {
		export enum MessageType {
			PlayGesture = "gesture__play_gesture",
			StopGesture = "gesture__stop_gesture",
		}
		export interface PlayGesture {
			gesture: number;
		}
		export function encodePlayGesture(packet: PlayGesture): string {
			return `${String(packet.gesture)}`;
		}
		export interface StopGesture {
		}
		export function encodeStopGesture(packet: StopGesture): string {
			return ``;
		}
	}
	export namespace seat {
		export enum MessageType {
			Seat = "seat__seat",
			Unseat = "seat__unseat",
		}
		export interface Seat {
			animation: string;
		}
		export function encodeSeat(packet: Seat): string {
			return `${(packet.animation ? packet.animation.replace(/@/g, "@@").replace(/!/g, "!!").replace(/\$/g, "$$").replace(/\//g, "@$@") : "@")}`;
		}
		export interface Unseat {
		}
		export function encodeUnseat(packet: Unseat): string {
			return ``;
		}
	}
	export namespace sync {
		export enum MessageType {
			SyncCharacterState = "sync__sync_character_state",
			SyncCharacterTeleport = "sync__sync_character_teleport",
			SyncTime = "sync__sync_time",
		}
		export interface SyncCharacterState {
			state: number;
			extraState: number;
			position: Vector3;
			rotation: Quaternion;
			velocity: Vector3;
		}
		export function encodeSyncCharacterState(packet: SyncCharacterState): string {
			return `${String(packet.state)}//${String(packet.extraState)}//${String(Math.floor((packet.position.x) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.position.y) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.position.z) * 10 ** 3) / 10 ** 3)}//${String(Math.floor((packet.rotation.eulerAngles.x) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.rotation.eulerAngles.y) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.rotation.eulerAngles.z) * 10 ** 3) / 10 ** 3)}//${String(Math.floor((packet.velocity.x) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.velocity.y) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.velocity.z) * 10 ** 3) / 10 ** 3)}`;
		}
		export interface SyncCharacterTeleport {
			position: Vector3;
			rotation: Quaternion;
		}
		export function encodeSyncCharacterTeleport(packet: SyncCharacterTeleport): string {
			return `${String(Math.floor((packet.position.x) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.position.y) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.position.z) * 10 ** 3) / 10 ** 3)}//${String(Math.floor((packet.rotation.eulerAngles.x) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.rotation.eulerAngles.y) * 10 ** 3) / 10 ** 3)}/${String(Math.floor((packet.rotation.eulerAngles.z) * 10 ** 3) / 10 ** 3)}`;
		}
		export interface SyncTime {
			t1: number;
			t2: number;
		}
		export function encodeSyncTime(packet: SyncTime): string {
			return `${String(packet.t1)}/${String(packet.t2)}`;
		}
	}
}
export namespace server {
	export namespace gesture {
		export enum MessageType {
			PlayGesture = "gesture__play_gesture",
			StopGesture = "gesture__stop_gesture",
		}
		export interface PlayGesture {
			sessionId: string;
			gesture: number;
		}
		export function decodePlayGesture(packet: string): PlayGesture {
			const [_0, _1] = packet.split("/");
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			const __1 = Number(_1);
			return { sessionId: __0, gesture: __1 };
		}
		export interface StopGesture {
			sessionId: string;
		}
		export function decodeStopGesture(packet: string): StopGesture {
			const [_0] = packet.split("/");
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			return { sessionId: __0 };
		}
	}
	export namespace seat {
		export enum MessageType {
			Seat = "seat__seat",
			Unseat = "seat__unseat",
		}
		export interface Seat {
			animation: string;
			userSessionId: string;
		}
		export function decodeSeat(packet: string): Seat {
			const [_0, _1] = packet.split("/");
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			const __1 = (_1 === "@" ? "" : _1.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			return { animation: __0, userSessionId: __1 };
		}
		export interface Unseat {
			userSessionId: string;
		}
		export function decodeUnseat(packet: string): Unseat {
			const [_0] = packet.split("/");
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			return { userSessionId: __0 };
		}
	}
	export namespace sync {
		export enum MessageType {
			SyncCharacterState = "sync__sync_character_state",
			SyncCharacterTeleport = "sync__sync_character_teleport",
			SyncTime = "sync__sync_time",
			SyncTimeDiff = "sync__sync_time_diff",
		}
		export interface SyncCharacterState {
			sessionId: string;
			state: number;
			extraState: number;
			position: Vector3;
			rotation: Quaternion;
			velocity: Vector3;
		}
		export function decodeSyncCharacterState(packet: string): SyncCharacterState {
			const [_0, _1, _2, _3, _4, _5] = packet.split("//");
			const [_6, _7, _8] = _3.split("/");
			const [_9, _10, _11] = _4.split("/");
			const [_12, _13, _14] = _5.split("/");
			const __12 = Number(_12);
			const __13 = Number(_13);
			const __14 = Number(_14);
			const __9 = Number(_9);
			const __10 = Number(_10);
			const __11 = Number(_11);
			const __6 = Number(_6);
			const __7 = Number(_7);
			const __8 = Number(_8);
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			const __1 = Number(_1);
			const __2 = Number(_2);
			const __3 = new Vector3(__6, __7, __8);
			const __4 = Quaternion.Euler(__9, __10, __11);
			const __5 = new Vector3(__12, __13, __14);
			return { sessionId: __0, state: __1, extraState: __2, position: __3, rotation: __4, velocity: __5 };
		}
		export interface SyncCharacterTeleport {
			sessionId: string;
			position: Vector3;
			rotation: Quaternion;
		}
		export function decodeSyncCharacterTeleport(packet: string): SyncCharacterTeleport {
			const [_0, _1, _2] = packet.split("//");
			const [_3, _4, _5] = _1.split("/");
			const [_6, _7, _8] = _2.split("/");
			const __6 = Number(_6);
			const __7 = Number(_7);
			const __8 = Number(_8);
			const __3 = Number(_3);
			const __4 = Number(_4);
			const __5 = Number(_5);
			const __0 = (_0 === "@" ? "" : _0.replace(/@\$@/g, "/").replace(/\$\$/g, "$").replace(/!!/g, "!").replace(/@@/g, "@"));
			const __1 = new Vector3(__3, __4, __5);
			const __2 = Quaternion.Euler(__6, __7, __8);
			return { sessionId: __0, position: __1, rotation: __2 };
		}
		export interface SyncTime {
		}
		export function decodeSyncTime(packet: string): SyncTime {
			const [] = packet.split("/");
			return {  };
		}
		export interface SyncTimeDiff {
			offset: number;
			roundTripDelay: number;
		}
		export function decodeSyncTimeDiff(packet: string): SyncTimeDiff {
			const [_0, _1] = packet.split("/");
			const __0 = Number(_0);
			const __1 = Number(_1);
			return { offset: __0, roundTripDelay: __1 };
		}
	}
}
