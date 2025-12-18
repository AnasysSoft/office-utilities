const authController = require('../controllers/authController');

module.exports = async function (fastify, opts) {
  fastify.post('/signup', authController.signup);
  fastify.post('/signin', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }
  }, authController.signin);
  fastify.post('/forgot-password', authController.forgotPassword);
  fastify.post('/reset-password', authController.resetPassword);
  fastify.post('/logout', authController.logout);
};