'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const offer = require(`./offer`);
const DataService = require(`../../data-service/offer`);
const CommentService = require(`../../data-service/comment`);
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
    "picture": `item13`,
    "title": `Куплю антиквариат`,
    "type": `OFFER`,
    "sum": 10030
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  offer(app, new DataService(mockDB), new CommentService(mockDB));
});

describe(`API returns a list of all offers`, () => {

  let response;

  beforeAll(async () => {
    // const app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 1 offers`, () => expect(response.body.length).toBe(1));

  test(`First offer's title equals "Куплю антиквариат"`, () => expect(response.body[0].title).toBe(`Куплю антиквариат`));

});

describe(`API returns an offer with given id`, () => {

  let response;

  beforeAll(async () => {
    // const app = await createAPI();
    response = await request(app)
      .get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю антиквариат"`, () => expect(response.body.title).toBe(`Куплю антиквариат`));

});

describe(`API creates an offer if data is valid`, () => {

  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  // let app;
  let response;

  // beforeAll(async () => {
  //   app = await createAPI();
  //   response = await request(app)
  //     .post(`/offers`)
  //     .send(newOffer);
  //   console.log(`response `, response);
  // });


  test(`Status code 201`, async () => {
    // app = await createAPI();
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  // const app = await createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent offer`, () => {

  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  test(`Status code 200`, async () => {
    // const app = await createAPI();
    const response = await request(app)
      .put(`/offers/1`)
      .send(newOffer);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns 'true'`, async () => {
    // const app = await createAPI();
    const response = await request(app)
      .put(`/offers/1`)
      .send(newOffer);
    expect(response.body).toEqual(true);
  });

  test(`Offer is really changed`, async () => {
    // const app = await createAPI();
    await request(app)
      .put(`/offers/1`)
      .send(newOffer);
    await request(app)
      .get(`/offers/1`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });

});

test(`API returns status code 404 when trying to change non-existent offer`, () => {

  // const app = await createAPI();

  const validOffer = {
    categories: [1, 2],
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/999`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {

  const invalidOffer = {
    categories: [1, 2],
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/1`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let response;

  test(`Status code 200`, async () => {
    const api = await createAPI();
    response = await request(api).delete(`/offers/1`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns 'true'`, async () => {
    const api = await createAPI();
    response = await request(api).delete(`/offers/1`);
    expect(response.body).toBe(true);
  });

  test(`Offer count is 0 now`, async () => {
    const api = await createAPI();
    await request(api).delete(`/offers/1`);
    await request(api)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(0));
  });

});

test(`API refuses to delete non-existent offer`, async () => {

  const api = await createAPI();

  return request(api)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given offer`, () => {

  test(`Status code 200`, async () => {
    const api = await createAPI();
    const response = await request(api).get(`/offers/1/comments`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  // test(`Returns list of 3 comments`, async () => {
  //   const api = await createAPI();
  //   const response = await request(api).get(`/offers/1/comments`);
  //   console.log(`response.body `, response.body);
  //   expect(response.body.length).toBe(3);
  // });

  // test(`First comment's text is "А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца."`, async () => {
  //   const api = await createAPI();
  //   const response = await request(api).get(`/offers/mkfSb7/comments`);

  //   expect(response.body[0].text).toBe(`А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`);
  // });

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  test(`Status code 201`, async () => {
    const api = await createAPI();
    const response = await request(api)
      .post(`/offers/1/comments`)
      .send(newComment);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  // test(`Comments count is changed`, async () => {
  //   const api = await createAPI();
  //   await request(api)
  //     .post(`/offers/1/comments`)
  //     .send(newComment);

  //   await request(app)
  //     .get(`/offers/1/comments`)
  //     .expect((res) => expect(res.body.length).toBe(2));
  // }
  // );

});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {

  const api = await createAPI();

  return request(api)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const api = await createAPI();

  return request(api)
    .post(`/offers/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

// describe(`API correctly deletes a comment`, () => {

//   test(`Status code 200`, async () => {
//     const api = await createAPI();
//     const response = await request(api).delete(`/offers/1/comments/1`);

//     expect(response.statusCode).toBe(HttpCode.OK);
//   });

//   test(`Comments count is 3 now`, async () => {
//     const api = await createAPI();
//     await request(api).delete(`/offers/1/comments/6Wh02W`);

//     await request(api)
//       .get(`/offers/DhUFB9/comments`)
//       .expect((res) => expect(res.body.length).toBe(2));
//   });

// });

test(`API refuses to delete non-existent comment`, async () => {

  // const app = await createAPI();

  return request(app)
    .delete(`/offers/123/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent offer`, async () => {

  const api = await createAPI();

  return request(api)
    .delete(`/offers/NOEXST/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});
