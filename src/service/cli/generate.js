'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  CATEGORIES,
  DEFAULT_COUNT,
  ExitCode,
  FILE_NAME,
  OfferType,
  PictureRestrict,
  SENTENCES,
  SumRestrict,
  TITLES,
} = require(`../constants`);
const {
  getPictureFileName,
  getRandomInt,
  shuffle,
} = require(`../utils`);

const getCategories = (categoriesLength) => {
  return Array.from(new Set(Array(categoriesLength)
  .fill(``)
  .map(() => CATEGORIES[getRandomInt(0, categoriesLength - 1)])));
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: getCategories(getRandomInt(1, CATEGORIES.length)),
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: Object.values(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      console.info(chalk.red(`Не больше 1000 объявлений.`));
      process.exit(ExitCode.ERROR);
    }
    const content = JSON.stringify(generateOffers(countOffer));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
