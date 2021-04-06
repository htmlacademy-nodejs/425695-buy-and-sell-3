'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findOffer(searchText) {
    const foundOffers = this._offers.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));

    return [...foundOffers];
  }
}

module.exports = SearchService;
