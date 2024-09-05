import * as Joi from 'joi';

export const schema = Joi.object({
  APP_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('development'),
  APP_PORT: Joi.number().default(3000),
  KEYCLOAK_URL: Joi.string().required(),
  KEYCLOAK_REALM: Joi.string().required(),
  KEYCLOAK_ADMIN_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_ADMIN_CLIENT_SECRET: Joi.string().required(),
  KEYCLOAK_WEB_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_WEB_CLIENT_SECRET: Joi.string().required(),
  KEYCLOAK_GRANT_TYPE: Joi.string().required(),
  REDIS_HOST: Joi.string().allow('').optional(),
  REDIS_PORT: Joi.string().allow('').optional(),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_TTL: Joi.string().allow('').optional(),
});
