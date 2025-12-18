// در تولید از دیتابیس جداگانه استفاده کنید
let users = []; // [{ id, email, profile: { name, bio, ... } }]

module.exports = {
  findById: (id) => users.find(u => u.id === id),
  createOrUpdate: (userData) => {
    const existing = users.find(u => u.id === userData.id);
    if (existing) {
      Object.assign(existing, userData);
      return existing;
    }
    users.push(userData);
    return userData;
  }
};