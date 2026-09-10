export class AnimationScheduler {
  private isRunning = false;
  private lastTimestamp = 0;
  private callback: (deltaSec: number) => void;
  private animFrameId: number | null = null;
  private targetFps = 30; // 30 FPS is optimal for low CPU in webviews
  private frameIntervalMs = 1000 / 30;

  constructor(callback: (deltaSec: number) => void, targetFps = 30) {
    this.callback = callback;
    this.targetFps = targetFps;
    this.frameIntervalMs = 1000 / targetFps;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  private loop(currentTimestamp: number): void {
    if (!this.isRunning) return;

    const elapsed = currentTimestamp - this.lastTimestamp;
    if (elapsed >= this.frameIntervalMs) {
      const deltaSec = Math.min(elapsed / 1000, 0.1);
      this.lastTimestamp = currentTimestamp - (elapsed % this.frameIntervalMs);
      this.callback(deltaSec);
    }

    this.animFrameId = requestAnimationFrame((ts: number) => this.loop(ts));
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public setFps(fps: number): void {
    this.targetFps = Math.max(10, Math.min(60, fps));
    this.frameIntervalMs = 1000 / this.targetFps;
  }
}
