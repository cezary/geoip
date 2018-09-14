const { notFound } = require('boom');
const geoip = require('geoip-lite');
const microCors = require('micro-cors');
const { getClientIp } = require('request-ip');
const { parse: parseUrl } = require('url');

const errorHandler = require('./error-handler');

const cors = microCors({
  allowMethods: ['GET']
});

const handler = async (req, res) => {
  const { query } = parseUrl(req.url, true);
  const ip = query.ip || getClientIp(req);
  const info = geoip.lookup(ip);

  if (!info) {
    throw notFound('can not locate ip');
  }

  const { ll, country, region, city, metro, zip } = info;
  const [latitude, longitude] = ll;
  const payload = { ip, latitude, longitude, country, region, city, metro, zip };

  if (query.callback) {
    return `${query.callback}(${JSON.stringify(payload)});`;
  } else {
    return payload;
  }
};

module.exports = errorHandler(cors(handler));
