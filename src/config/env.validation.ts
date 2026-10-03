import Joi from 'joi';

export const envvalidationSchema = Joi.object({
    NODE_ENV: Joi
        .string()
        .valid('development', 'production', 'test')
        .default('development'),
    DATABASE_URL: Joi
        .string()
        .uri({ scheme:['postgres', 'postgresql'] })
        .required(),
    PORT: Joi
        .number()
        .port()
        .default(3000),
    JWT_SECRET: Joi
        .string()
        .min(32)
        .required(),
    JWT_EXPIRES_IN: Joi
        .string()
        .default('1h'),
});