const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = {
  hashPassword: async (password) => await bcrypt.hash(password, 10),
  comparePassword: async (plain, hash) => await bcrypt.compare(plain, hash),
  generateResetToken: () => crypto.randomBytes(32).toString('hex'),
  hashToken: async (token) => await bcrypt.hash(token, 10)
};