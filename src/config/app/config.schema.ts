import * as Joi from 'joi';

export const schema = Joi.object({
  APP_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('development'),
  APP_PORT: Joi.number().default(3000),
  KEYCLOAK_URL: Joi.string().required(),
  KEYCLOAK_REALM: Joi.string().required(),
  KEYCLOAK_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
});
