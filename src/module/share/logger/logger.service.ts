import { Injectable, Logger } from '@nestjs/common';
import consola from 'consola';
import { TraceIdService } from '../trace/trace.service';

@Injectable()
export class LoggerService extends Logger {
  constructor(private readonly traceIdService: TraceIdService) {
    super();
  }

  async logBigMessage() {
    const figlet = (await import('figlet')).default;
    const chalk = (await import('chalk')).default;

    const rozyAscii = figlet.textSync('EFIN', {
      font: 'Isometric1',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    const styledMessage = chalk.magenta(rozyAscii);

    consola.log(styledMessage);
  }

  public getTraceId(): string {
    return this.traceIdService.getTraceId();
  }

  badRequest(message: string, type: null | 'EXCEPTION' = null) {
    import('chalk')
      .then((chalkModule) => {
        const chalk = chalkModule.default;
        const traceId = this.getTraceId();
        const formattedMessage =
          `[${traceId}]` + (type ? `[${type}]` : ``) + `[400]` + ` ${message}`;

        const styledMessage = chalk.red(formattedMessage);
        consola.log(styledMessage);
      })
      .catch((err) => {
        // Handle any errors that might occur during the import
        consola.error('Failed to load chalk:', err);
      });
  }

  trace(
    message: string,
    type: null | 'REPOSITORY' | 'CONTROLLER' | 'SERVICE' = null,
  ) {
    import('chalk')
      .then((chalkModule) => {
        const chalk = chalkModule.default;
        const traceId = this.getTraceId();
        const formattedMessage =
          `[${traceId}]` + (type ? `[${type}]` : ``) + ` ${message}`;

        const styledMessage = chalk.cyan(formattedMessage);
        consola.log(styledMessage);
      })
      .catch((err) => {
        // Handle any errors that might occur during the import
        consola.error('Failed to load chalk:', err);
      });
  }
}
