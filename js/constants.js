const _ = require('underscore');

const ID = _.now();

const constants = {
    BUTTON_SHARE: 'Share With Space',
    CREATED: 'created',
    COLOR: '#C12228',
    DATE_FORMAT: 'YYYY-MM-DD',
    DATE_OFFSET: 30,
    DATE_UNIT: 'days',
    HOME_PAGE: 'HomePage',
    ACTION_ID: `${ID}-npm-share|`,
    LICENSE: 'License',
    LICENSES: ['BSD-3-Clause', 'MIT', 'ISC', 'Unlicense', 'W3C', 'WTFPL'],
    PACKAGE_NOT_FOUND: 'Package Not Found',
    PACKAGE_SHARED: 'NPM Package - Shared With Space',
    PACKAGE_UNPUBLISHED: 'Package is Unpublished',
    regex: {
        KEY: 'npm@',
        NPM: /\bnpm@[a-zA-Z0-9-]*/gi
    },
    urls: {
        LICENSE: 'http://spdx.org/licenses/{{0}}.html',
        NPM: 'https://www.npmjs.com/package/{{0}}'
    },
    TEMP_DIR: './temp_files'
}

module.exports = constants;