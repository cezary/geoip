# geoip

api to look up latitude and longitude by ip address, hosted on now.sh at https://geoip.now.sh

## usage

hitting the api will use the request's ip address to perform a look up
using MaxMind's geoip-lite database.

### query params

`ip` - set the ip address to look up

`callback` - set the name of the callback function for jsonp requests

## alternatives

- https://ipapi.co
- https://freegeoip.net
- https://www.iplocation.net
- https://www.telize.com
- https://www.iplocate.io/
- https://ipinfo.io/
- https://ipgeolocation.io
