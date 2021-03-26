'use strict';

const express = require(`express`);
const app = express();

const {DEFAULT_PORT, HttpCode} = require(`../constants`);
const {offersRoutes} = require(`../routes`);


app.use(express.json());

app.use(`/offers`, offersRoutes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port);
  }
};
