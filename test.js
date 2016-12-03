'use strict';

const ghGet = require('.');
const test = require('tape');

process.env.GITHUB_TOKEN = '';

test('ghGet()', t => {
  t.plan(12);

  t.equal(ghGet.name, 'ghGet', 'should have a function name.');

  ghGet('users/isaacs', {
    headers: {
      'UseR-AgenT': 'Shinnosuke Watanabe https://github.com/shinnn/gh-get'
    },
    token: process.env.TOKEN_FOR_TEST
  }).then(response => {
    t.strictEqual(response.body.login, 'isaacs', 'should create an API request.');
  }).catch(t.fail);

  ghGet('foo123', {
    headers: {
      'USeR-aGenT': 'github:shinnn https://github.com/shinnn/gh-get'
    },
    token: process.env.TOKEN_FOR_TEST
  }).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '404 Not Found',
      'should fail when the endpoint is not found.'
    );
  }).catch(t.fail);

  ghGet('user', {
    headers: {
      'USER-AGent': '@shinnn https://github.com/shinnn/gh-get'
    },
    token: 'invalid_token',
    verbose: true
  }).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '401 Unauthorized (Bad credentials)',
      'should fail when it takes an invalid `token` option.'
    );
    t.strictEqual(
      err.response.req._headers['user-agent'],  // eslint-disable-line
      '@shinnn https://github.com/shinnn/gh-get',
      'should add `response` property to the error when `verbose` option is enabled.'
    );
  }).catch(t.fail);

  ghGet().then(t.fail, err => {
    t.ok(
      err.message.endsWith(' for example https://api.github.com/user/repos -> \'user/repos\'.'),
      'should fail when it takes no arguments.'
    );
  }).catch(t.fail);

  ghGet(1).then(t.fail, err => {
    t.ok(
      err.message.startsWith('1 is not a string. Expected a "path" part of a Github API endpoint URL, '),
      'should fail when the first argument is not a string.'
    );
  }).catch(t.fail);

  ghGet('users/isaacs').then(t.fail, err => {
    t.ok(
      err.message.includes('`headers` option with a valid `user-agent` header is required'),
      'should fail when it doesn\'t take the seond argument.'
    );
  }).catch(t.fail);

  ghGet('users/isaacs', {}).then(t.fail, err => {
    t.ok(
      err.message.includes('you must tell your username or application name to Github every API request. '),
      'should fail when no user agent is specified.'
    );
  }).catch(t.fail);

  ghGet('users/isaacs', {
    headers: {
      'UseR-AgenT': 'https://github.com/shinnn/gh-get'
    },
    verbose: 1
  }).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '1 is not a Boolean value. `verbose` option must be a Boolean value. (`false` by default)',
      'should fail when `verbose` option is not a Boolean value.'
    );
  }).catch(t.fail);

  ghGet('users/isaacs', {
    headers: {
      'User-Agent': 'https://github.com/shinnn/gh-get'
    },
    token: 1
  }).then(t.fail, err => {
    t.strictEqual(
      err.name,
      'TypeError',
      'should fail when `token` option is not a string.'
    );
  }).catch(t.fail);

  ghGet('users/isaacs', {
    headers: {
      'User-Agent': 'https://github.com/shinnn/gh-get'
    },
    baseUrl: 1
  }).then(t.fail, err => {
    t.strictEqual(
      err.name,
      'TypeError',
      'should fail when `baseUrl` option is not a string.'
    );
  }).catch(t.fail);
});
