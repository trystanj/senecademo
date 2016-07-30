'use strict';

// hapi stuff
const Hapi = require('hapi');
const Chairo = require('chairo');

const seneca = require('seneca')();

// seneca handlers
const math = require('./plugins/math-plugin');
seneca.use('plugins/math-plugin');

const server = new Hapi.Server();
server.connection({ port: 3000 });


// register Chairo with our seneca instance and start server
server.register({
  register: Chairo,
  options: { seneca } // pass in our existing seneca instance
}, (err) => {

  if (err)
    throw err;

  // standard hapi routes
  server.route({
    method: 'GET',
    path: '/trigger',
    handler: function (request, reply) {
      reply('triggered')
    }
  });

  // seneca route terse
  server.route({
    method: 'GET',
    path: '/senecamagic',
     handler: { act: 'role:math, cmd:sum, left:5, right: 100' } // will hit the math pattern using funky jsonic syntax
  });

  // seneca route
  server.route({
    method: 'GET',
    path: '/senecamagicjs',
    handler: {
      act: {  // will hit the math pattern using full js object representation
        role: 'math',
        cmd: 'sum',
        left: 5,
        right: 100
      }
    }
  });

  // seneca route with some sugar
  server.route({
    method: 'GET',
    path: '/senecasugar',
    handler: function (request, reply) {
        return reply.act({ role: 'math', cmd: 'sum', left: 2.5, right: 10 });
    }
  });

  // seneca route with no magic
  server.route({
    method: 'GET',
    path: '/senecaplain',
    handler: function (request, reply) {
      server.seneca.act({ role: 'math', cmd: 'sum', left: 2.5, right: 3, integer: true }, (err, result) => {
        if (err)
          return console.error(err);

        reply(null, result);
      })
    }
  });

  // start hapi
  server.start((err) => {
    if (err)
      throw err;

    console.log('Hapi up');
  });
});

// seneca trigger directly
seneca.act({ role: 'math', cmd: 'sum', left: 2.5, right: 3, integer: true }, (err, result) => {
  if (err)
    return console.error(err);

  console.log('seneca result', result);
});



