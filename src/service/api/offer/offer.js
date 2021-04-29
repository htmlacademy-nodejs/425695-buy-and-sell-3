'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {commentValidator, offerExist, offerValidator} = require(`../../middlewares`);


module.exports = (app, offerService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [offerExist(offerService), offerValidator], (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offerId} = req.params;

    const dropedOffer = offerService.drop(offerId);

    return res.status(HttpCode.OK).json(dropedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer.comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offerId, commentId} = req.params;

    const {comment} = offerService.dropComment(offerId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).send(`deleted`);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offerId} = req.params;

    const comment = offerService.createComment(offerId, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
