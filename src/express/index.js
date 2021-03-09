'use strict';

const express = require(`express`);
const {DEFAULT_SERVER_PORT} = require(`./constants`);
const {mainRoutes, myRoutes, offersRoutes} = require(`./routes`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_SERVER_PORT);
