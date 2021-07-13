'use strict';

const API_PREFIX = `/api`;
const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const OfferType = {
  OFFER: `OFFER`,
  SALE: `SALE`,
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

const DIR_LOG = `./logs`;
const FILE_FILL_DB_NAME = `./queries/fill-db.sql`;
const FILE_MOCKS_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_MOCKS_PATH = `./${FILE_MOCKS_NAME}`;
const FILE_LOG = `./logs/api.log`;

const DEFAULT_PORT = 3000;

const HttpCode = {
  CREATED: 201,
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const MAX_COMMENTS = 4;
const MAX_ID_LENGTH = 6;

module.exports = {
  API_PREFIX,
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  DEFAULT_PORT,
  DIR_LOG,
  Env,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  FILE_FILL_DB_NAME,
  FILE_LOG,
  FILE_MOCKS_NAME,
  FILE_MOCKS_PATH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  HttpCode,
  MAX_COMMENTS,
  MAX_ID_LENGTH,
  OfferType,
  PictureRestrict,
  SumRestrict,
  USER_ARGV_INDEX,
};
