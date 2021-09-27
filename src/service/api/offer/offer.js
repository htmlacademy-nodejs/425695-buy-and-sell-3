'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {commentValidator, offerExist, offerValidator} = require(`../../middlewares`);


module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const offers = await offerService.findAll(comments);

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [offerExist(offerService), offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = await offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;

    const dropedOffer = await offerService.drop(offerId);
    return res.status(HttpCode.OK).json(dropedOffer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer.comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;

    const {comment} = await commentService.drop(commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).send(`deleted`);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
