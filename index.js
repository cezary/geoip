const microCors = require('micro-cors');
const geoip = require('geoip-lite');
const { getClientIp } = require('request-ip');
const { parse: parseUrl } = require('url');

const cors = microCors({
  allowMethods: ['GET']
});

const FAVICON_REGEX = /\/(favicon|(apple-)?touch-icon(-i(phone|pad))?(-\d{2,}x\d{2,})?(-precomposed)?)\.(jpe?g|png|ico|gif)$/i;

const noFavicon = handler => (req, res) => {
  // return nothing for requests for favicon
  if (FAVICON_REGEX.test(req.url)) {
    res.statusCode = 404;
    return null;
  }

  return handler(req, res);
}

const handler = async (req, res) => {
  const { query } = parseUrl(req.url, true);
  const ip = query.ip || getClientIp(req);
  const info = geoip.lookup(ip);
  const { ll, country, region, city, metro, zip } = info;
  const [latitude, longitude] = ll;
  const payload = { ip, latitude, longitude, country, region, city, metro, zip };

  if (query.callback) {
    return `${query.callback}(${JSON.stringify(payload)});`;
  } else {
    return payload;
  }
};


module.exports = noFavicon(cors(handler));
