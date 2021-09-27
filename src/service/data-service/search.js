'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(searchText) {
    const offers = await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return offers.map((offer) => offer.get());
  }

  // findOffer(searchText) {
  //   const foundOffers = this._offers.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));

  //   return [...foundOffers];
  // }
}

module.exports = SearchService;
