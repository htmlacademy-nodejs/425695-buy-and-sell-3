'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRouter.post(`/add`,
    upload.single(`avatar`),
    async (req, res) => {
      const {body, file} = req;
      const offerData = {
        picture: file ? file.filename : ``,
        sum: body.price,
        type: body.action,
        description: body.comment,
        title: body[`ticket-name`],
        category: Array.isArray(body.category) ? body.category : [body.category],
      };

      try {
        await api.createOffer(offerData);
        res.redirect(`/my`);
      } catch (e) {
        res.redirect(`back`);
      }
    }
);

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));
offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id, {comments: false}),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});
offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, {comments: true});

  res.render(`offers/ticket`, {offer});
});

module.exports = offersRouter;
