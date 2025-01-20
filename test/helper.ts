import { execSync } from 'node:child_process';

export const execSyncWithOutput = (command: string) => {
  try {
    execSync(command);
  } catch (e) {
    if ((e as any)?.stdout !== undefined) {
      console.log((e as any)?.stdout.toString());
    }
    throw e;
  }
};
