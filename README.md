# gh-get

[![NPM version](https://img.shields.io/npm/v/gh-get.svg)](https://www.npmjs.com/package/gh-get)
[![Build Status](https://travis-ci.org/shinnn/gh-get.svg?branch=master)](https://travis-ci.org/shinnn/gh-get)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/gh-get.svg)](https://coveralls.io/github/shinnn/gh-get?branch=master)
[![Dependency Status](https://david-dm.org/shinnn/gh-get.svg)](https://david-dm.org/shinnn/gh-get)
[![devDependency Status](https://david-dm.org/shinnn/gh-get/dev-status.svg)](https://david-dm.org/shinnn/gh-get#info=devDependencies)

A [Node](https://nodejs.org/) module to create a request to the [Github API](https://developer.github.com/v3/)

```javascript
const ghGet = require('gh-get');

ghGet('users/isaacs', {
  headers: {
    'user-agent': 'your application name'
  }
}).then(response => {
  response.body.login; //=> 'isaacs'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install gh-get
```

## API

```javascript
const ghGet = require('gh-get');
```

### ghGet(*url* [, *options*])

*url*: `String` ("path" part of a Github API URL)  
*options*: `Object`  
Return: `Object` ([`Promise`](https://promisesaplus.com/) instance)

It makes a `GET` request to the [Github API](https://developer.github.com/v3/#overview) and returns a promise. Request method is overridable with the `method` [option](https://github.com/shinnn/gh-get#options).

When the API request finishes successfully, the promise will be [*fulfilled*](https://promisesaplus.com/#point-26) with the  [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_http_incomingmessage) object with the additional `body` property that contains a JSON object of the API response.

When the API request fails, the promise will be [*rejected*](https://promisesaplus.com/#point-30) with an error object.

#### Options

You can use [`Request` options](https://github.com/request/request#requestoptions-callback) and [the](https://github.com/shinnn/gh-get#optionstoken) [additional](https://github.com/shinnn/gh-get#optionsverbose) [ones](https://github.com/shinnn/gh-get#optionsbaseurl).

Note that `headers['user-agent']` option is [required](https://developer.github.com/v3/#user-agent-required).

##### options.token

Type: `String`  
Default: `process.env.GITHUB_TOKEN`

Use specific [GitHub access token](https://github.com/blog/1509-personal-api-tokens).

```javascript
ghGet('user', {
  token: 'xxxxx' //=> for example @shinnn's access token
  headers: {
    'user-agent': 'Shinnosuke Watanabe https://github.com/shinnn/'
  },
}).then(response => {
  response.body.login; //=> 'shinnn'
});
```

##### options.verbose

Type: `Boolean`  
Default: `false`

`true` adds an [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_http_incomingmessage) object to the error message as `response` property.

```javascript
ghGet('user/repos', {token: 'invalid_token'}).then(err => {
  err.message; //=> '401 Unauthorized (Bad credentials)'
  'response' in error; //=> false
});

ghGet('user/repos', {
  token: 'invalid_token',
  verbose: true
}).then(err => {
  err.message; //=> '401 Unauthorized (Bad credentials)'
  err.response; //=> {statusCode: 401, body: { ... }, headers: { ... }, ...}
});
```

##### options.baseUrl

Type: `String`  
Default: `process.env.GITHUB_ENDPOINT` if available, otherwise `'https://api.github.com'`

Use the different root [endpoint](https://developer.github.com/v3/#root-endpoint) to support [Github enterprise](https://enterprise.github.com/).

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
