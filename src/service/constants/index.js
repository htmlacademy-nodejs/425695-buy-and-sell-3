'use strict';

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};
const FILE_NAME = `mocks.json`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};


const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const USER_ARGV_INDEX = 2;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  OfferType,
  PictureRestrict,
  SumRestrict,
  USER_ARGV_INDEX,
};
