import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const validate: Record<string, string> = errors.reduce((pre, err: ValidationError) => {
          const errorType =
            err.constraints != null
              ? err.constraints[
                  Object.keys(err.constraints)[
                    Object.keys(err.constraints).length - 1
                  ]
                ]
              : '';

          pre[err.property] = errorType;
          return pre;
        }, {} as Record<string, string>);

        return new BadRequestException({
          statusCode: 400,
          message: validate,
          error: 'Validate failed',
          flag: false,
        });
      },
    });
  }
}
