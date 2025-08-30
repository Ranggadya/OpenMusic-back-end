const UsersService = require('../../../services/postgress/UsersService');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const usersHandler = new UsersService(service, validator);
    server.route(routes(usersHandler));
  },
};
