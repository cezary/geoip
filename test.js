const { stringify: queryStringify } = require('querystring');
const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')

const handler = require('./');

test('ipv4 query param', async t => {
  const ip = '8.8.8.8';
  const service = micro(handler);
  const querystring = queryStringify({ ip });
  const url = `${await listen(service)}?${querystring}`;

  const response = await request(url)
  const json = JSON.parse(response);

  t.is(json.ip, ip)
  t.truthy(json.latitude)
  t.truthy(json.longitude)

  service.close()
})

test('ipv6 query param', async t => {
  const ip = '2a03:2880:2110:df07:face:b00c::1';
  const service = micro(handler);
  const querystring = queryStringify({ ip });
  const url = `${await listen(service)}?${querystring}`;

  const response = await request(url)
  const json = JSON.parse(response);

  t.is(json.ip, ip)
  t.truthy(json.latitude)
  t.truthy(json.longitude)

  service.close()
})

test('callback query param', async t => {
  const service = micro(handler);
  const querystring = queryStringify({
    ip: '8.8.8.8',
    callback: 'callback'
  });
  const url = `${await listen(service)}?${querystring}`;

  const response = await request(url)
  t.true(response.startsWith('callback'));

  service.close()
})
