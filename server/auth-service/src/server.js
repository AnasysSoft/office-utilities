const fastify = require('fastify')({ logger: true });
const helmet = require('@fastify/helmet');
const rateLimit = require('@fastify/rate-limit');
const jwt = require('@fastify/jwt');
const cookie = require('@fastify/cookie');
const authRoutes = require('./routes/authRoutes.js');

// امنیت پایه
fastify.register(helmet);
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  ban: 5
});

// JWT (در تولید secret را از .env بخوانید)
fastify.register(jwt, {
  secret: 'supersecretlongrandomstringhereatleast32chars',
});

// کوکی
fastify.register(cookie);

// روت‌ها
fastify.register(authRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Auth Service running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();