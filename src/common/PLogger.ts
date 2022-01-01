import * as chalk from 'chalk';
import * as os from 'os';
import * as PrettyError from 'pretty-error';

import { LoggerService } from '@nestjs/common';

enum LoggingLevel {
  emerg = 'emerg',
  alert = 'emerg',
  crit = 'crit',
  error = 'error',
  warning = 'warning',
  notice = 'notice',
  info = 'info',
  debug = 'debug',
}
export class PLogger implements LoggerService {
  private readonly prettyError = new PrettyError();

  private context: string;
  constructor(context?: string) {
    this.context = context;

    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }
  log(message: string, level: LoggingLevel) {
    this.formatLog('SYSTEM', message);
  }
  error(message: string, level: LoggingLevel) {
    this.prettyError.render(new Error(message), true);
  }
  warn(message: string, level: LoggingLevel) {
    console.log(message);
  }
  debug(message: string, level?: LoggingLevel) {
    //  Used for debugging
    if (process.env.PRODUCTION !== 'true') {
      this.formatLog(this.context, message);
    }
  }
  verbose(message: string, level?: LoggingLevel) {
    console.log(message);
  }

  private formatLog(ctx, message) {
    const appName = process.env.APP_NAME || 'APP';
    const timeStamp = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    console.log(
      `${chalk.red(`[${appName}]`)}${chalk.white(
        `@${os.hostname()}`,
      )} ${chalk.blue(timeStamp)} [${chalk.red(ctx)}] ${chalk.white(message)}`,
    );
  }
}
