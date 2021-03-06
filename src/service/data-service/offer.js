'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object
      .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

    this._offers.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offer = this.findOne(id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this.findOne(id);

    return Object.assign(oldOffer, offer);
  }

  createComment(offerId, commentText) {
    const offer = this._offers.find((item) => item.id === offerId);

    if (!offer) {
      return null;
    }

    const comment = {id: nanoid(MAX_ID_LENGTH), text: commentText};

    Object.assign(offer, {...offer, comments: [...offer.comments, comment]});

    return comment;
  }

  dropComment(offerId, commentId) {
    const offer = this._offers.find((item) => item.id === offerId);

    if (!offer) {
      return {offer: null, comment: null};
    }

    const comment = offer.comments.find((item) => item.id === commentId);

    if (!comment) {
      return {offer, comment: null};
    }

    Object.assign(offer, {...offer, comments: offer.comments.filter((item) => item.id !== commentId)});

    return {offer, comment};
  }

}

module.exports = OfferService;
