'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const offer = require(`./offer`);
const DataService = require(`../../data-service/offer`);
const CommentService = require(`../../data-service/comment`);
const {mockData} = require(`./mockData`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new DataService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`API returns a list of all offers`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns a list of 5 offers`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers`);

    expect(response.body.length).toBe(5);
  });

  test(`First offer's id equals "mkfSb7"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers`);

    expect(response.body[0].id).toBe(`mkfSb7`);
  });

});

describe(`API returns an offer with given id`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers/mkfSb7`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Offer's title is "Продам отличную подборку фильмов на VHS"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers/mkfSb7`);

    expect(response.body.title) .toBe(`Продам отличную подборку фильмов на VHS`);
  });

});

describe(`API creates an offer if data is valid`, () => {

  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };


  test(`Status code 201`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/offers`)
      .send(newOffer);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });


  test(`Returns offer created`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/offers`)
      .send(newOffer);

    expect(response.body).toEqual(expect.objectContaining(newOffer));
  });

  test(`Offers count is changed`, async () => {
    const app = createAPI();
    await request(app)
      .post(`/offers`)
      .send(newOffer);

    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();

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
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app)
      .put(`/offers/DhUFB9`)
      .send(newOffer);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns changed offer`, async () => {
    const app = createAPI();
    const response = await request(app)
      .put(`/offers/DhUFB9`)
      .send(newOffer);
    expect(response.body).toEqual(expect.objectContaining(newOffer));
  });

  test(`Offer is really changed`, async () => {
    const app = createAPI();
    await request(app)
      .put(`/offers/DhUFB9`)
      .send(newOffer);
    await request(app)
      .get(`/offers/DhUFB9`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });

});

test(`API returns status code 404 when trying to change non-existent offer`, () => {

  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {

  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/DhUFB9`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).delete(`/offers/jluEIM`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns deleted offer`, async () => {
    const app = createAPI();
    const response = await request(app).delete(`/offers/jluEIM`);

    expect(response.body.id).toBe(`jluEIM`);
  });

  test(`Offer count is 4 now`, async () => {
    const app = createAPI();
    await request(app).delete(`/offers/jluEIM`);
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(4));
  });

});

test(`API refuses to delete non-existent offer`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given offer`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers/mkfSb7/comments`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 3 comments`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers/mkfSb7/comments`);

    expect(response.body.length).toBe(1);
  });

  test(`First comment's text is "А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца."`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/offers/mkfSb7/comments`);

    expect(response.body[0].text).toBe(`А где блок питания? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`);
  });

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  test(`Status code 201`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/offers/mkfSb7/comments`)
      .send(newComment);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Comments count is changed`, async () => {
    const app = createAPI();
    await request(app)
      .post(`/offers/mkfSb7/comments`)
      .send(newComment);

    await request(app)
      .get(`/offers/mkfSb7/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  }
  );

});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/offers/mkfSb7/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).delete(`/offers/DhUFB9/comments/6Wh02W`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Comments count is 3 now`, async () => {
    const app = createAPI();
    await request(app).delete(`/offers/DhUFB9/comments/6Wh02W`);

    await request(app)
      .get(`/offers/DhUFB9/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  });

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/DhUFB9/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent offer`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});
