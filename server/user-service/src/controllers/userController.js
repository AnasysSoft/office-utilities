const { findById, createOrUpdate } = require('../models/userModel');

module.exports = {
  getProfile: async (request) => {
    const { id, email } = request.user;
    const user = findById(id) || createOrUpdate({ id, email, profile: {} });
    return {
      id,
      email,
      profile: user.profile || {},
      message: 'Profile retrieved successfully'
    };
  },

  updateProfile: async (request, reply) => {
    const { id } = request.user;
    const profileData = request.body;
    createOrUpdate({ id, profile: profileData });
    return reply.send({ message: 'Profile updated successfully' });
  }
};