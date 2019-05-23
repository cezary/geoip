const { send } = require('micro');

const responseTime = fn => async (req, res) => {
  const start = Date.now();
  const ret = await fn(req, res);
  const ms = Date.now() - start;
  res.setHeader('X-Response-Time', `${ms}ms`)

  return ret;
}

module.exports = responseTime;
