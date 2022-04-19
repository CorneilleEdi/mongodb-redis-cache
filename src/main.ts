import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATIONS } from './shared/configuration';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);

    const PORT = configService.get(CONFIGURATIONS.PORT);

    await app.listen(PORT, () => {
        Logger.verbose(`Api start ,running and listening on port ${PORT}`, 'Application');
    });
}

bootstrap();
