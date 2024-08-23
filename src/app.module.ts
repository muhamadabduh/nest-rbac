import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigService } from './config/keycloak/keycloak-config.service';
import { KeycloakConfigModule } from './config/keycloak/keycloak.module';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [
    AppConfigModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
