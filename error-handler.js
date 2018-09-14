const { send } = require('micro');

const errorHandler = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (error) {
    send(res, error.output.statusCode || 500, error.output.payload);
  }
}

module.exports = errorHandler;
