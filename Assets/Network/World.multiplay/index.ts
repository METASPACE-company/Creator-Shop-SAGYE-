import { Sandbox, SandboxOptions, SandboxPlayer } from 'ZEPETO.Multiplay';
import { IReceiptMessage, IWP } from 'ZEPETO.Multiplay.IWP';

import modules from './Module/Modules';
import { SandboxLocker } from './SandboxLocker';

export default class extends Sandbox implements IWP {
  private locker = new SandboxLocker(this);

  onCreate(options: SandboxOptions): void {
    for (const module of modules) {
      module.OnInit(this, options);
    }
  }

  onTick(deltaTime: number): void {
    for (const module of modules) {
      module.OnTick(deltaTime);
    }

    this.locker.Update();
  }

  onJoin(client: SandboxPlayer): void {
    this.locker.AddUser();

    for (const module of modules) {
      module.OnPlayerJoin(client);
    }
  }

  onLeave(client: SandboxPlayer, consented?: boolean): void {
    for (const module of modules) {
      module.OnPlayerLeave(client, consented);
    }

    this.locker.RemoveUser();
  }

  async onPurchased(
    client: SandboxPlayer,
    receipt: IReceiptMessage,
  ): Promise<void> {
    for (const module of modules) {
      module.onPurchased(client, receipt);
    }
  }
}
