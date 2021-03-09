'use strict';

const mainRouter = require(`./main-routes`);
const myRouter = require(`./my-routes`);
const offersRouter = require(`./offers-routes`);

module.exports = {
  mainRoutes: mainRouter,
  myRoutes: myRouter,
  offersRoutes: offersRouter,
};
