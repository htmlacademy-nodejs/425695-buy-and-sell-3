'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const category = require(`./category`);
const DataService = require(`../../data-service/category`);
const {mockData} = require(`./mockData`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 8 categories`, () => expect(response.body.length).toBe(8));

  test(`Category names are "Игры", "Журналы", "Животные", "Посуда", "Книги", "Музыка", "Инструменты", "Разное"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([
            `Игры`,
            `Журналы`,
            `Животные`,
            `Посуда`,
            `Книги`,
            `Музыка`,
            `Инструменты`,
            `Разное`,
          ])
      )
  );

});
