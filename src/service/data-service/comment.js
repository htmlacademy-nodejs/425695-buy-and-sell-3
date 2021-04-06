'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offerId, commentText) {
    const offer = this._offers.find((item) => item.id === offerId);

    if (!offer) {
      return null;
    }

    const comment = {id: nanoid(MAX_ID_LENGTH), text: commentText};

    Object.assign(offer, {...offer, comments: [...offer.comments, comment]});

    return comment;
  }

  drop(offerId, commentId) {
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

module.exports = CommentService;
