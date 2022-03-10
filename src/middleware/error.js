const _ = require("lodash");

module.exports = {
  apiErrorHandler(err, req, res) {
    const error = objectToString({
      message: err.message || err,
      request: _.pick(req, [
        "originalUrl",
        "baseUrl",
        "method",
        "headers",
        "body",
        "params",
        "query",
        "language",
        "locale"
      ]),
      stack: err.stack
    });
    console.error(error);
    return res.status(err.status || 400).send(err.message || err);
  }
};

function objectToString(o) {
  let cache = [];
  const result = JSON.stringify(o, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        try {
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          return;
        }
      }
      cache.push(value);
    }
    return value;
  });
  cache = null;
  return result;
}
