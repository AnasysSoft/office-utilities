const fastify = require('fastify')({ logger: true });
const helmet = require('@fastify/helmet');
const rateLimit = require('@fastify/rate-limit');
const jwt = require('@fastify/jwt');
const cookie = require('@fastify/cookie');
const userRoutes = require('./routes/userRoutes');

fastify.register(helmet);
fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });
fastify.register(jwt, { secret: 'supersecretlongrandomstringhereatleast32chars' }); // همان secret
fastify.register(cookie);
fastify.register(userRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log('User Service running on http://localhost:3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();