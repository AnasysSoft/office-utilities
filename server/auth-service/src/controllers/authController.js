const { findByEmail, create, update } = require('../models/userModel');
const { hashPassword, comparePassword, generateResetToken, hashToken } = require('../utils/securityUtils');

module.exports = {
  signup: async (request, reply) => {
    const { email, password } = request.body || {};
    if (!email || !password || password.length < 8) {
      return reply.code(400).send({ error: 'Invalid email or password (min 8 chars)' });
    }
    if (findByEmail(email)) {
      return reply.code(400).send({ error: 'User already exists' });
    }
    const passwordHash = await hashPassword(password);
    create({ email, passwordHash });
    return reply.send({ message: 'User created successfully' });
  },

  signin: async (request, reply) => {
    const { email, password } = request.body || {};
    const user = findByEmail(email);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }
    const token = request.server.jwt.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' }
    );
    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      secure: true,     // در تولید حتما HTTPS
      sameSite: 'strict',
      maxAge: 3600
    });
    return reply.send({ message: 'Logged in successfully', token });
  },

  forgotPassword: async (request, reply) => {
    const { email } = request.body || {};
    const user = findByEmail(email);
    // همیشه پیام یکسان برای جلوگیری از enumeration
    if (user) {
      const resetToken = generateResetToken();
      const hash = await hashToken(resetToken);
      user.resetToken = { hash, expiry: Date.now() + 3600000 }; // ۱ ساعت
      update(user);
      console.log(`Reset link: http://localhost:3001/reset-password?token=${resetToken}&email=${email}`);
    }
    return reply.send({ message: 'If email exists, a reset link has been sent.' });
  },

  resetPassword: async (request, reply) => {
    const { email, token, newPassword } = request.body || {};
    if (!newPassword || newPassword.length < 8) {
      return reply.code(400).send({ error: 'New password must be at least 8 characters' });
    }
    const user = findByEmail(email);
    if (!user || !user.resetToken || Date.now() > user.resetToken.expiry) {
      return reply.code(400).send({ error: 'Invalid or expired token' });
    }
    const valid = await comparePassword(token, user.resetToken.hash);
    if (!valid) {
      return reply.code(400).send({ error: 'Invalid token' });
    }
    user.passwordHash = await hashPassword(newPassword);
    delete user.resetToken;
    update(user);
    return reply.send({ message: 'Password reset successfully' });
  },

  logout: async (request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return reply.send({ message: 'Logged out successfully' });
  }
};