module.exports = async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized - Invalid or missing token' });
  }
};

function requireAdmin(request, reply) {
  if (request.user.role !== 'admin') {
    reply.code(403).send({ error: 'Forbidden' });
  }
}