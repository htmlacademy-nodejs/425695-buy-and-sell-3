'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    return await this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }
  // create(offerId, commentText) {
  //   const offer = this._offers.find((item) => item.id === offerId);

  //   if (!offer) {
  //     return null;
  //   }

  //   const comment = {id: nanoid(MAX_ID_LENGTH), text: commentText};

  //   Object.assign(offer, {...offer, comments: [...offer.comments, comment]});

  //   return comment;
  // }

  // drop(offerId, commentId) {
  //   const offer = this._offers.find((item) => item.id === offerId);

  //   if (!offer) {
  //     return {offer: null, comment: null};
  //   }

  //   const comment = offer.comments.find((item) => item.id === commentId);

  //   if (!comment) {
  //     return {offer, comment: null};
  //   }

  //   Object.assign(offer, {...offer, comments: offer.comments.filter((item) => item.id !== commentId)});

  //   return {offer, comment};
  // }

}

module.exports = CommentService;
