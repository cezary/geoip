const { notFound } = require('@hapi/boom');
const geoip = require('geoip-lite');
const microCors = require('micro-cors');
const { getClientIp } = require('request-ip');
const { parse: parseUrl } = require('url');

const countryMap = require('./data/names');
const isoMap = require('./data/iso3');
const currencyMap = require('./data/currency');
const phoneMap = require('./data/phone');

const errorHandler = require('./error-handler');
const responseTime = require('./response-time');

const cors = microCors({
  allowMethods: ['GET']
});

const countryData = country => ({
  countryCurrency: currencyMap[country],
  countryIso: isoMap[country],
  countryName: countryMap[country],
  countryPhone: phoneMap[country],
});

const handler = async (req, res) => {
  const { query } = parseUrl(req.url, true);
  const ip = query.ip || getClientIp(req);
  const info = geoip.lookup(ip);

  if (!info) {
    throw notFound('can not locate ip');
  }

  const timestamp = Date.now();

  const { ll, country, region, city, metro, zip } = info;
  const [latitude, longitude] = ll;
  const payload = {
    ip,
    latitude,
    longitude,
    timestamp,
    //...countryData(country),
    country,
    region,
    city,
    metro,
    zip,
  };

  if (query.callback) {
    return `${query.callback}(${JSON.stringify(payload)});`;
  } else {
    return payload;
  }
};

module.exports = errorHandler(responseTime(cors(handler)));
