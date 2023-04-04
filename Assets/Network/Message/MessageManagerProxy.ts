import { MessageHandler } from "./MessageHandler";
import { MessageReceiver } from "./MessageReceiver";
import { MessageSender } from "./MessageSender";

export class MessageSenderProxy implements MessageSender {
  private messages: [number | string, string?][] = [];

  get Messages(): [number | string, string?][] {
    return this.messages;
  }

  sendMessage(type: number | string, payload?: string): void {
    this.messages.push([type, payload]);
  }
}

export class MessageReceiverProxy implements MessageReceiver {
  private handlers = new Set<MessageHandler>();

  get Handlers(): Set<MessageHandler> {
    return this.handlers;
  }

  registerMessageHandler(handler: MessageHandler): void {
    this.handlers.add(handler);
  }

  unregisterMessageHandler(handler: MessageHandler): void {
    this.handlers.delete(handler);
  }
}

export class MessageManagerProxy implements MessageSender, MessageReceiver {
  private senderProxy = new MessageSenderProxy();
  private receiverProxy = new MessageReceiverProxy();

  get SenderProxy(): MessageSenderProxy {
    return this.senderProxy;
  }

  get ReceiverProxy(): MessageReceiverProxy {
    return this.receiverProxy;
  }

  sendMessage(type: number | string, payload?: string): void {
    this.senderProxy.sendMessage(type, payload);
  }

  registerMessageHandler(handler: MessageHandler): void {
    this.receiverProxy.registerMessageHandler(handler);
  }

  unregisterMessageHandler(handler: MessageHandler): void {
    this.receiverProxy.unregisterMessageHandler(handler);
  }
}

export type MessageManager = MessageSender & MessageReceiver;
