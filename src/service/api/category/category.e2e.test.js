'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const category = require(`./category`);
const DataService = require(`../../data-service/category`);
const {mockData} = require(`./mockData`);


const createAPI = () => {
  const app = express();
  app.use(express.json());
  category(app, new DataService(mockData));
  return app;
};

describe(`API returns category list`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/category`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 8 categories`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/category`);

    expect(response.body.length).toBe(8);
  });

  test(`Category names are "Игры", "Журналы", "Животные", "Посуда", "Книги", "Музыка", "Инструменты", "Разное"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/category`);

    expect(response.body).toEqual(
        expect.arrayContaining([
          `Игры`,
          `Журналы`,
          `Животные`,
          `Посуда`,
          `Книги`,
          `Музыка`,
          `Инструменты`,
          `Разное`,
        ]));
  });
});
