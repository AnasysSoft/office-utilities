const fastify = require('fastify')({ logger: true });
const env = require('@fastify/env');
const helmet = require('@fastify/helmet');
const rateLimit = require('@fastify/rate-limit');
const jwt = require('@fastify/jwt');
const cookie = require('@fastify/cookie');
const authRoutes = require('./routes/authRoutes');

// تنظیمات محیطی
const schema = {
  type: 'object',
  required: ['JWT_SECRET'],
  properties: {
    JWT_SECRET: { type: 'string' },
    JWT_EXPIRES_IN: { type: 'string', default: '1h' },
    PORT: { type: 'integer', default: 3001 }
  }
};

fastify.register(env, {
  schema,
  dotenv: true,
  data: process.env
});

// امنیت
fastify.register(helmet);
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// JWT
fastify.register(jwt, {
  secret: fastify.config.JWT_SECRET,
  cookie: {
    cookieName: 'auth_token'
  }
});

// کوکی
fastify.register(cookie);

// روت‌ها
fastify.register(authRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0' });
    fastify.log.info(`Auth Service running on http://localhost:${fastify.config.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();