const microCors = require('micro-cors');
const geoip = require('geoip-lite');
const { getClientIp } = require('request-ip');
const { parse: parseUrl } = require('url');

const cors = microCors({
  allowMethods: ['GET']
});

const handler = async (req, res) => {
  const { query } = parseUrl(req.url, true);
  const ip = query.ip || getClientIp(req);

  const payload = Object.assign({ ip }, geoip.lookup(ip));

  if (query.callback) {
    return `${query.callback}(${JSON.stringify(payload)});`;
  } else {
    return payload;
  }
};


module.exports = cors(handler);
