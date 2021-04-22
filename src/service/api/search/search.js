'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);


module.exports = (app, searchService) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }
    const foundOffers = searchService.findOffer(query);
    const status = foundOffers.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(status).json(foundOffers);
  });
};
