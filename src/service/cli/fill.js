'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../lib`);
const {
  DEFAULT_COUNT,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  FILE_FILL_DB_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  MAX_COMMENTS,
  OfferType,
  PictureRestrict,
  SumRestrict,
} = require(`../constants`);
const {
  getPictureFileName,
  getRandomInt,
  shuffle,
} = require(`../utils`);

const logger = getLogger({name: `generate`});

function getUserId(userCount) {
  return getRandomInt(1, userCount);
}

const generateComments = (count, offerId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getUserId(userCount),
    offerId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, offerIdx) => {
    const offerId = offerIdx + 1;
    return {
      category: [getRandomInt(1, categoryCount)],
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), offerId, userCount, comments),
      description: shuffle(sentences).slice(1, 5).join(` `),
      id: offerId,
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      title: titles[getRandomInt(0, titles.length - 1)],
      type: Object.values(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
      userId: getUserId(userCount),
    };
  })
);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    return content.split(`\n`).filter(Boolean);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      logger.info(chalk.red(`Не больше 1000 объявлений.`));
      process.exit(ExitCode.ERROR);
    }
    const offers = generateOffers(countOffer, titles, categories.length, users.length, sentences, commentSentences);
    const comments = offers.flatMap((offer) => offer.comments);
    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}, idx) =>
      `('${idx + 1}', '${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n\t`);
    const categoryValues = categories.map((name, idx) => `('${idx + 1}', '${name}')`).join(`,\n\t`);
    const offerValues = offers.map(({id, title, description, type, sum, picture, userId}) =>
      `('${id}', '${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`
    ).join(`,\n\t`);
    const offerCategoryValues = offerCategories.map(({offerId, categoryId}) => `(${offerId}, ${categoryId})`).join(`,\n\t`);
    const commentValues = comments.map(({text, userId, offerId}, idx) => `('${idx + 1}', '${text}', ${userId}, ${offerId})`).join(`,\n\t`);

    const content = `
INSERT INTO users(id, email, password_hash, first_name, last_name, avatar) VALUES
  ${userValues};
INSERT INTO categories(id, name) VALUES
  ${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(id, title, description, type, sum, picture, user_id) VALUES
  ${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
  ${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(id, text, user_id, offer_id) VALUES
  ${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_FILL_DB_NAME, content);
      logger.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      logger.error(chalk.red(`Can't write data to file...`));
    }
  }
};
