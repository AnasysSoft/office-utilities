let users = []; // [{ id, email, passwordHash, resetToken: { hash, expiry } }]

module.exports = {
  findByEmail: (email) => users.find(u => u.email === email),
  findById: (id) => users.find(u => u.id === id),
  create: (userData) => {
    const user = { id: users.length + 1, ...userData };
    users.push(user);
    return user;
  },
  update: (updatedUser) => {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) users[index] = updatedUser;
    return users[index];
  }
};