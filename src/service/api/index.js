'use strict';

const {Router} = require(`express`);

const category = require(`./category/category`);
const offer = require(`./offer/offer`);
const search = require(`./search/search`);

const {getMockData} = require(`../lib`);
const {
  CategoryService,
  SearchService,
  OfferService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  offer(app, new OfferService(mockData));
})();

module.exports = app;
