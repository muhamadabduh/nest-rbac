import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.config.get<string>('KEYCLOAK_URL'),
      realm: this.config.get<string>('KEYCLOAK_REALM'),
      clientId: this.config.get<string>('KEYCLOAK_CLIENT_ID'),
      secret: this.config.get<string>('KEYCLOAK_CLIENT_SECRET'),
      logLevels: ['verbose'],
    };
  }
}
