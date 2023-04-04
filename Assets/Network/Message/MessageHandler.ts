import { Room } from "ZEPETO.Multiplay";
import GlobalMessageManager from "./GlobalMessageManager";

export interface MessageHandlerSignalHandler {
  onTypeAdded(type: string, handler: MessageHandler): void;
  onTypeRemoved(type: string, handler: MessageHandler): void;
}

export type MessageHandlerFunction = (
  ctx: Room,
  type: string,
  payload?: string
) => void;

export class MessageHandler {
  private signalHandler: MessageHandlerSignalHandler;
  private handlers: Map<string, MessageHandlerFunction[]> = new Map<
    string,
    MessageHandlerFunction[]
  >();

  constructor() {
    GlobalMessageManager.Instance.registerMessageHandler(this);
  }

  get AllTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  registerSignalHandler(signalHandler: MessageHandlerSignalHandler): void {
    this.signalHandler = signalHandler;
  }

  unregisterSignalHandler(): void {
    this.signalHandler = null;
  }

  addHandler(
    type: string,
    handler: MessageHandlerFunction,
    thisArg?: any
  ): void {
    if (thisArg !== undefined) handler = handler.bind(thisArg);

    const handlers = this.handlers.get(type);
    if (handlers) handlers.push(handler);
    else {
      this.handlers.set(type, [handler]);
      if (this.signalHandler) this.signalHandler.onTypeAdded(type, this);
    }
  }

  removeHandler(type: string, handler: MessageHandlerFunction): void {
    const handlers = this.handlers.get(type);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (0 <= index) {
      handlers.splice(index, 1);
      if (handlers.length === 0) {
        this.handlers.delete(type);
        if (this.signalHandler) this.signalHandler.onTypeRemoved(type, this);
      }
    }
  }

  removeHandlerAll(type: string): void {
    this.handlers.delete(type);
    if (this.signalHandler) this.signalHandler.onTypeRemoved(type, this);
  }

  handle(ctx: Room, type: string, payload?: string): void {
    const handlers = this.handlers.get(type);
    if (!handlers) return;

    for (const handler of handlers) handler(ctx, type, payload);
  }
}
