const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

module.exports = async function (fastify, opts) {
  fastify.get('/profile', { onRequest: authenticate }, userController.getProfile);
  fastify.put('/profile', { onRequest: authenticate }, userController.updateProfile);
};