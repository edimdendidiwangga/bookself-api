const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const config = {
  port: 5000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
};

const init = async (c) => {
  const server = Hapi.server(c);

  server.route(routes);

  await server.start();

  return server;
};

init(config);
