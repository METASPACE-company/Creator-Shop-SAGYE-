import { Room } from "ZEPETO.Multiplay";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { ZepetoWorldMultiplay } from "ZEPETO.World";
import { MessageHandler, MessageHandlerSignalHandler } from "./MessageHandler";
import { MessageManager, MessageManagerProxy } from "./MessageManagerProxy";
import { MessageReceiver } from "./MessageReceiver";
import { MessageSender } from "./MessageSender";

const MSG_MGR_PROXY = new MessageManagerProxy();

export default class GlobalMessageManager
  extends ZepetoScriptBehaviour
  implements MessageSender, MessageReceiver, MessageHandlerSignalHandler
{
  private static instance: MessageManager;

  public static get Instance(): MessageManager {
    return GlobalMessageManager.instance ?? MSG_MGR_PROXY;
  }

  @SerializeField()
  private multiplay: ZepetoWorldMultiplay;
  private room: Room;

  // Private fields
  private handlers = new Set<MessageHandler>();
  private typeHandlers = new Map<string, Set<MessageHandler>>();
  private typeRawHandlers = new Map<string, (payload?: any) => void>();

  Start() {
    this.multiplay.RoomJoined += (room: Room) => {
      this.room = room;
      GlobalMessageManager.instance = this;
      this.merge(MSG_MGR_PROXY);
    };
  }

  sendMessage(type: number | string, payload?: string): void {
    this.room.Send(type as any, payload);
  }

  registerMessageHandler(handler: MessageHandler): void {
    if (this.handlers.has(handler)) return;

    this.handlers.add(handler);

    for (const type of handler.AllTypes) this.onTypeAdded(type, handler);

    handler.registerSignalHandler(this);
  }

  unregisterMessageHandler(handler: MessageHandler): void {
    if (!this.handlers.has(handler)) return;

    this.handlers.delete(handler);

    for (const type of handler.AllTypes) this.onTypeRemoved(type, handler);

    handler.unregisterSignalHandler();
  }

  onTypeAdded(type: string, handler: MessageHandler): void {
    const handlers = this.typeHandlers.get(type);

    if (!handlers) {
      this.typeHandlers.set(type, new Set([handler]));

      let rawHandler = this.typeRawHandlers.get(type);

      if (!rawHandler) {
        rawHandler = this.handle.bind(this, type);
        this.typeRawHandlers.set(type, rawHandler);
      }

      this.room.AddMessageHandler(type, rawHandler);
    } else handlers.add(handler);
  }

  onTypeRemoved(type: string, handler: MessageHandler): void {
    const handlers = this.typeHandlers.get(type);

    if (handlers.size === 1) {
      // NOTE: Currently the ZEPETO does not support removing message handlers.
      // this.room.RemoveMessageHandler(type);
      // this.typeRawHandlers.delete(type);
      this.typeHandlers.delete(type);
    } else handlers.delete(handler);
  }

  private handle(type: string, payload?: any): void {
    const handlers = this.typeHandlers.get(type);
    if (!handlers) return;

    for (const handler of handlers)
      handler.handle(
        this.room,
        type,
        payload !== undefined ? payload.toString() : undefined
      );
  }

  private merge(proxy: MessageManagerProxy): void {
    for (const handler of proxy.ReceiverProxy.Handlers)
      this.registerMessageHandler(handler);

    for (const [type, payload] of proxy.SenderProxy.Messages)
      this.sendMessage(type, payload);
  }
}
