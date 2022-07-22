const User = require('../../models/User.js');
const { login } = require('../../services/UserService.js');

const userData = {
  name: 'UserTest',
  password: 'PassTest',
  isAdmin: true,
};

const createUserTest = async () => {
  await User.generate(userData);
  const { token } = await login(userData.name, userData.password);
  return token;
};

const deleteUserTest = async () => {
  await User.findOneAndDelete({ name: userData.name });
};

module.exports = { createUserTest, deleteUserTest };
