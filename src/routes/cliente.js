const express = require("express");

const router = express.Router();
const { apiErrorHandler } = require("../middleware/error");

const cliente = require("../actions/cliente");

router.get("/", (req, res) => {
  cliente
    .get()
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

router.get("/:id", (req, res) => {
  cliente
    .getById({ ...req.params })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

router.post("/", (req, res) => {
  cliente
    .insert({ ...req.body })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

router.put("/:id", (req, res) => {
  cliente
    .update({ ...req.body, id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

router.delete("/:id", (req, res) => {
  cliente
    .delete({ id: req.params.id })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

module.exports = router;
