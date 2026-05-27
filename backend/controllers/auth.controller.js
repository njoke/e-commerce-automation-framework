const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required', code: 'MISSING_FIELDS' });
  }

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
  }

  if (user.locked) {
    return res.status(403).json({ error: 'User account is locked', code: 'ACCOUNT_LOCKED' });
  }

  res.status(200).json({
    userId: user.id,
    username: user.username,
    role: user.role,
    token: `mock-token-${user.id}`
  });
};

module.exports = { login };
