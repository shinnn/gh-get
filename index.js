/*!
 * gh-get | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/gh-get
*/
'use strict';

const inspect = require('util').inspect;

const fettucine = require('fettuccine');
const ghifyRequestOptions = require('ghify-request-options');

const UA_ERROR = 'Expected `userAgent` option to be a string of valid `user-agent` header';

module.exports = function ghGet(url, options) {
  if (typeof url !== 'string') {
    return Promise.reject(new TypeError(
      inspect(url) +
      ' is not a string. Expected a "path" part of a Github API URL, for example \'user/repos\'' +
      ' if the request URL is https://api.github.com/user/repos.'
    ));
  }

  if (!options || (
    !('userAgent' in options) && (
      !options.headers ||
      !Object.keys(options.headers).some(key => /^user-agent$/i.test(key) && options.headers[key])
    )
  )) {
    return Promise.reject(new TypeError(
      '`userAgent` option (string) is required,' +
      ' because you must tell your username or application name to Github every API request.' +
      ' https://developer.github.com/v3/#user-agent-required'
    ));
  }

  if (options.userAgent !== undefined) {
    if (typeof options.userAgent !== 'string') {
      return Promise.reject(new TypeError(`${UA_ERROR}, but got ${inspect(options.userAgent)}.`));
    }

    if (options.userAgent.length === 0) {
      return Promise.reject(new Error(`${UA_ERROR}, but got '' (empty string).`));
    }

    options.headers = Object.assign({}, options.headers, {'user-agent': options.userAgent});
  }

  if (options.verbose !== undefined && typeof options.verbose !== 'boolean') {
    return Promise.reject(new TypeError(
      inspect(options.verbose) +
      ' is not a Boolean value. `verbose` option must be a Boolean value.' +
      ' (`false` by default)'
    ));
  }

  return new Promise(resolve => resolve(fettucine(url, ghifyRequestOptions(options))))
  .then(function checkGithubApiResponseStatusCode(response) {
    if (response.statusCode < 200 || 299 < response.statusCode) {
      const error = new Error(
        response.headers.status +
        (
          response.body && response.body.message && response.body.message !== response.statusMessage ?
          ' (' + response.body.message + ')' :
          ''
        )
      );

      if (options.verbose) {
        error.response = response;
      }

      return Promise.reject(error);
    }

    return response;
  });
};
