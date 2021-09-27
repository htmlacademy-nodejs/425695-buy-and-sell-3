'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const mainRouter = new Router();
const api = getAPI();
mainRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    api.getOffers({comments: false}),
    api.getCategories(true)
  ]);
  res.render(`main`, {categories, offers});
});
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`main/search-result`, {
      results
    });
  } catch (error) {
    res.render(`main/search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
