'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    api.getOffers({comments: false}),
    api.getCategories()
  ]);
  res.render(`my/tickets`, {categories, offers});
});
myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`my/comments`, {offers: offers.slice(0, 3)});
});

module.exports = myRouter;
