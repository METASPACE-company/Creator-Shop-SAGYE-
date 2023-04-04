import { Sandbox } from 'ZEPETO.Multiplay';

const UNLOCK_INTERVAL = 5000;

export class SandboxLocker {
  private currentUser = 0;
  private locked = false;
  private allowUnlock = false;
  private lastAllowUnlockTime = 0;

  constructor(private sandbox: Sandbox) {}

  public AddUser(): void {
    this.currentUser = Math.min(this.currentUser + 1, this.sandbox.maxClients);

    if (this.currentUser < this.sandbox.maxClients) return;
    if (this.locked) return;

    this.locked = true;
    this.allowUnlock = false;
    this.sandbox.lock();
  }

  public RemoveUser(): void {
    this.currentUser = Math.max(this.currentUser - 1, 0);

    if (this.allowUnlock) return;

    this.allowUnlock = true;
    this.lastAllowUnlockTime = Date.now();
  }

  public Update(): void {
    if (
      this.locked &&
      this.allowUnlock &&
      this.lastAllowUnlockTime + UNLOCK_INTERVAL <= Date.now()
    ) {
      this.sandbox
        .unlock()
        .then(() => {
          this.locked = false;
          this.allowUnlock = false;
        })
        .catch((err) => {
          console.error('failed to unlock sandbox');
          console.error(err);
          this.lastAllowUnlockTime = Date.now(); // Retry
        });
    }
  }
}
