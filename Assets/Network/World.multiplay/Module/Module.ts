import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { IWP } from "ZEPETO.Multiplay.IWP";

export interface Module extends IWP {
  OnInit(sandbox: Sandbox, options: SandboxOptions): void;
  OnTick(deltaTime: number): void;
  OnPlayerJoin(playerClient: SandboxPlayer): void;
  OnPlayerLeave(playerClient: SandboxPlayer, consented?: boolean): void;
}
