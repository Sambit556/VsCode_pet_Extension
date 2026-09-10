export class EventEmitter<T> {
  private listeners: ((e: T) => any)[] = [];

  get event() {
    return (listener: (e: T) => any) => {
      this.listeners.push(listener);
      return {
        dispose: () => {
          const idx = this.listeners.indexOf(listener);
          if (idx >= 0) this.listeners.splice(idx, 1);
        }
      };
    };
  }

  fire(data: T): void {
    for (const l of this.listeners) {
      l(data);
    }
  }

  dispose(): void {
    this.listeners = [];
  }
}

export const window = {
  createOutputChannel: () => ({
    appendLine: () => {},
    dispose: () => {}
  }),
  showInformationMessage: () => Promise.resolve(),
  showWarningMessage: () => Promise.resolve(),
  showErrorMessage: () => Promise.resolve(),
  showQuickPick: () => Promise.resolve(),
  showInputBox: () => Promise.resolve()
};

export const commands = {
  registerCommand: () => ({ dispose: () => {} }),
  executeCommand: () => Promise.resolve()
};

export const workspace = {
  getConfiguration: () => ({
    get: (key: string, defVal: any) => defVal,
    update: () => Promise.resolve()
  }),
  onDidChangeConfiguration: () => ({ dispose: () => {} }),
  onDidChangeTextDocument: () => ({ dispose: () => {} })
};

export const env = {
  isTelemetryEnabled: false
};

export const tasks = {
  onDidEndTaskProcess: () => ({ dispose: () => {} })
};

export class Uri {
  static file(path: string) {
    return { path, scheme: 'file' };
  }
  static joinPath(base: any, ...segments: string[]) {
    return { path: `${base.path}/${segments.join('/')}`, scheme: base.scheme };
  }
}
