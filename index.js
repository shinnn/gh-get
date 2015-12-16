/*!
 * gh-get | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/gh-get
*/
'use strict';

const fettucine = require('fettuccine');
const ghifyRequestOptions = require('ghify-request-options');

module.exports = function ghGet(apiUrlPath, options) {
  if (typeof apiUrlPath !== 'string') {
    return Promise.reject(new TypeError(
      String(apiUrlPath) +
      ' is not a string. Expected a "path" part of a Github API endpoint URL, for example' +
      ' https://api.github.com/user/repos -> \'user/repos\'.'
    ));
  }

  if (
    !options ||
    !options.headers ||
    !Object.keys(options.headers).some(key => /^user-agent$/i.test(key) && options.headers[key])
  ) {
    return Promise.reject(new TypeError(
      '`headers` option with a valid `user-agent` header is required,' +
      ' because you must tell your username or application name to Github every API request.' +
      ' https://developer.github.com/v3/#user-agent-required'
    ));
  }

  if (options.verbose !== undefined && typeof options.verbose !== 'boolean') {
    return Promise.reject(new TypeError(
      String(options.verbose) +
      ' is not a Boolean value. `verbose` option must be a Boolean value.' +
      ' (`false` by default)'
    ));
  }

  return fettucine(apiUrlPath, ghifyRequestOptions(options))
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

    return Promise.resolve(response);
  });
};
