const express = require("express");

const router = express.Router();
const {
  responseSuccess,
  responseError,
} = require("@qualicorp_digital/utils/responseStructs");

const cliente = require("../actions/cliente");

router.get("/", (req, res) => {
  cliente
    .get()
    .then((result) => responseSuccess(res, result))
    .catch((err) => {
      responseError(res, err);
    });
});

router.get("/:guid", (req, res) => {
  cliente
    .getById({ ...req.params })
    .then((result) => responseSuccess(res, result))
    .catch((err) => {
      responseError(res, err);
    });
});

router.post("/", (req, res) => {
  cliente
    .insert({ ...req.body })
    .then((result) => responseSuccess(res, result))
    .catch((err) => {
      responseError(res, err);
    });
});

router.put("/:guid", (req, res) => {
  cliente
    .update({ ...req.body, guid: req.params.guid })
    .then((result) => responseSuccess(res, result))
    .catch((err) => {
      responseError(res, err);
    });
});

router.delete("/:guid", (req, res) => {
  cliente
    .delete({ guid: req.params.guid })
    .then((result) => responseSuccess(res, result))
    .catch((err) => {
      responseError(res, err);
    });
});

module.exports = router;
