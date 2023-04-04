export interface MessageSender {
  sendMessage(type: number | string, payload?: string): void;
}
