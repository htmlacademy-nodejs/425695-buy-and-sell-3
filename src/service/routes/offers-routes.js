'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const offersRouter = new Router();

const {FILE_NAME} = require(`../constants`);


offersRouter.get(`/`, async (req, res) => {
  let mocks;
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    mocks = JSON.parse(fileContent);
  } catch (err) {
    mocks = [];
  }
  res.json(mocks);
});

module.exports = offersRouter;
