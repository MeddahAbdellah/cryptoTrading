import betterLogger from 'better-logging';

betterLogger(console);

class LoggerService {
  public log(logs: any): void {
    console.info(logs);
  }

  public warn(logs: any): void {
    console.warn(logs);
  }
}

const logger = new LoggerService();

export default logger;