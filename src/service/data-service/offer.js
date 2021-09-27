'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const offers = await this._Offer.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return offers.map((item) => item.get());
  }
  // create(offer) {
  //   const newOffer = Object
  //     .assign({id: nanoid(MAX_ID_LENGTH), comments: []}, offer);

  //   this._offers.push(newOffer);
  //   return newOffer;
  // }

  // drop(id) {
  //   const offer = this.findOne(id);

  //   if (!offer) {
  //     return null;
  //   }

  //   this._offers = this._offers.filter((item) => item.id !== id);
  //   return offer;
  // }

  // findAll() {
  //   return this._offers;
  // }

  // findOne(id) {
  //   return this._offers.find((item) => item.id === id);
  // }

  // update(id, offer) {
  //   const oldOffer = this.findOne(id);

  //   return Object.assign(oldOffer, offer);
  // }

  // createComment(offerId, commentText) {
  //   const offer = this._offers.find((item) => item.id === offerId);

  //   if (!offer) {
  //     return null;
  //   }

  //   const comment = {id: nanoid(MAX_ID_LENGTH), text: commentText};

  //   Object.assign(offer, {...offer, comments: [...offer.comments, comment]});

  //   return comment;
  // }

  // dropComment(offerId, commentId) {
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

module.exports = OfferService;
