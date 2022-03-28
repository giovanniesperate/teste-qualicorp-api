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

router.get("/:guid", (req, res) => {
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

router.put("/:guid", (req, res) => {
  cliente
    .update({ ...req.body, guid: req.params.guid })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

router.delete("/:guid", (req, res) => {
  cliente
    .delete({ guid: req.params.guid })
    .then((result) => res.json(result))
    .catch((err) => {
      apiErrorHandler(err, req, res);
    });
});

module.exports = router;
