import { spawn } from 'child_process';
import path from 'path';

const SCRIPT_COMMAND = `python`;
const SCRIPT_BASE_PATH = `${path.dirname(require.main.filename)}\\python_scripts\\`;

enum PYTHON_SCRIPTS {
  NLP = 'nlp_tweets.py',
}

export default class PythonService {
 private static _launchScript(scriptName: string, args: string[]): Promise<any> {
  const scriptProcess = spawn(SCRIPT_COMMAND, [`${SCRIPT_BASE_PATH}${scriptName}`, ...args]);
  return new Promise((resolve, reject) => {
    scriptProcess.stdout.on('data', (data) => resolve(data));
    scriptProcess.stderr.on('data', (err) => reject(err));
  });
 }
 
  public static nlp(phrases: string[]): Promise<string[]>{
    return PythonService._launchScript(PYTHON_SCRIPTS.NLP, phrases);
  }
}