import { MessageHandler } from "./MessageHandler";

export interface MessageReceiver {
  registerMessageHandler(handler: MessageHandler): void;
  unregisterMessageHandler(handler: MessageHandler): void;
}
