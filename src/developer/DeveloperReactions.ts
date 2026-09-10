import * as vscode from 'vscode';
import { PetManager } from '../pets/PetManager';
import { ConfigurationManager } from '../configuration/ConfigurationManager';
import { Logger } from '../utils/Logger';

export class DeveloperReactions {
  private static instance: DeveloperReactions;
  private lastTypeTimestamp = 0;

  private constructor() {}

  public static getInstance(): DeveloperReactions {
    if (!DeveloperReactions.instance) {
      DeveloperReactions.instance = new DeveloperReactions();
    }
    return DeveloperReactions.instance;
  }

  public register(context: vscode.ExtensionContext): void {
    const petManager = PetManager.getInstance();

    // 1. Text document changes (User is actively coding)
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((_e) => {
        const config = ConfigurationManager.getInstance().getConfig();
        if (!config.developerReactions) return;

        // Throttle to once every 10 seconds
        const now = Date.now();
        if (now - this.lastTypeTimestamp > 10000) {
          this.lastTypeTimestamp = now;
          petManager.onUserActiveCoding();
        }
      })
    );

    // 2. Task completion (Build / Test task reactions)
    context.subscriptions.push(
      vscode.tasks.onDidEndTaskProcess((e) => {
        const config = ConfigurationManager.getInstance().getConfig();
        if (!config.developerReactions) return;

        const taskName = e.execution.task.name.toLowerCase();
        const isBuildOrTest =
          taskName.includes('build') ||
          taskName.includes('test') ||
          taskName.includes('compile') ||
          taskName.includes('lint');

        if (isBuildOrTest) {
          const success = e.exitCode === 0;
          Logger.info(`Developer reaction triggered by task: ${taskName} (exitCode: ${e.exitCode})`);

          if (taskName.includes('test')) {
            petManager.onTestEvent(success);
          } else {
            petManager.onBuildEvent(success);
          }
        }
      })
    );
  }
}
