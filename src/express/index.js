'use strict';

const path = require(`path`);
const express = require(`express`);
const {DEFAULT_SERVER_PORT, PUBLIC_DIR} = require(`./constants`);
const {mainRoutes, myRoutes, offersRoutes} = require(`./routes`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_SERVER_PORT);
