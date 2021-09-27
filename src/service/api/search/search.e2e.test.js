'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockOffers = [
  {
    "categories": [
      `Игры`,
      `Журналы`
    ],
    "comments": [
      {
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`
      },
      {
        "text": `А где блок питания?`
      },
      {
        "text": `Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ],
    "description": `Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Это настоящая находка для коллекционера!`,
    "picture": `item13.jpg`,
    "title": `Куплю антиквариат`,
    "type": `OFFER`,
    "sum": 10030
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  search(app, new DataService(mockDB));
});

describe(`API returns offer based on search query`, () => {

  test(`Status code 200`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Куплю антиквариат`});

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 offer found`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Куплю антиквариат`});

    expect(response.body.length).toBe(1);
  });

  test(`Offer has correct title`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Куплю антиквариат`});

    expect(response.body[0].title).toBe(`Куплю антиквариат`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app)
        .get(`/search`)
        .query({query: `Куплю антиквариат`});

  await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  await request(app)
        .get(`/search`)
        .query({query: `Куплю антиквариат`});

  await request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
});
