import { WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export type Coroutine = (...params: unknown[]) => Generator;

export interface GlobalCoroutineManagerInterface {
  RunAfter(delaySeconds: number, f: Function, ...params: unknown[]): void;
  Execute(f: Coroutine, ...params: unknown[]): void;
  ExecuteAfter(delaySeconds: number, f: Coroutine, ...params: unknown[]): void;
}

let fakeImpl = new (class implements GlobalCoroutineManagerInterface {
  public commands_RunAfter: [number, Function, unknown[]][] = [];
  public commands_Execute: [Coroutine, unknown[]][] = [];
  public commands_ExecuteAfter: [number, Coroutine, unknown[]][] = [];

  public RunAfter(
    delaySeconds: number,
    f: Function,
    ...params: unknown[]
  ): void {
    this.commands_RunAfter.push([delaySeconds, f, params]);
  }

  public Execute(f: Coroutine, ...params: unknown[]): void {
    this.commands_Execute.push([f, params]);
  }

  public ExecuteAfter(
    delaySeconds: number,
    f: Coroutine,
    ...params: unknown[]
  ): void {
    this.commands_ExecuteAfter.push([delaySeconds, f, params]);
  }
})();

export default class GlobalCoroutineManager
  extends ZepetoScriptBehaviour
  implements GlobalCoroutineManagerInterface
{
  private static instance: GlobalCoroutineManager;

  public static get Instance(): GlobalCoroutineManagerInterface {
    return GlobalCoroutineManager.instance ?? fakeImpl;
  }

  public static get RawInstance(): GlobalCoroutineManager {
    return GlobalCoroutineManager.instance;
  }

  public Awake(): void {
    GlobalCoroutineManager.instance = this;

    for (const params of fakeImpl.commands_RunAfter) this.RunAfter(...params);
    for (const params of fakeImpl.commands_Execute) this.Execute(...params);
    for (const params of fakeImpl.commands_ExecuteAfter)
      this.ExecuteAfter(...params);

    fakeImpl = null;
  }

  public RunAfter(
    delaySeconds: number,
    f: Function,
    ...params: unknown[]
  ): void {
    this.Execute(
      function* (f: Function, params: unknown[]) {
        yield new WaitForSeconds(delaySeconds);
        f(...params);
      },
      f,
      params,
    );
  }

  public Execute(f: Coroutine, ...params: unknown[]): void {
    this.StartCoroutine(f(...params));
  }

  public ExecuteAfter(
    delaySeconds: number,
    f: Coroutine,
    ...params: unknown[]
  ): void {
    this.StartCoroutine(
      function* (delaySeconds: number, f: Coroutine, params: unknown[]) {
        yield new WaitForSeconds(delaySeconds);
        this.Execute(f, ...params);
      }.bind(this)(delaySeconds, f, params),
    );
  }
}
