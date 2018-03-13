const _ = require('underscore');

const constants = require('./constants');
const strings = require('./strings');

const { LICENSES, urls } = constants;


const licenses = {
    get: license => {
        let res = license;
        if (_.contains(LICENSES, license)) {
            res = `[${license}](${strings.substitue(urls.LICENSE, [license])})`;
        }
        return res;
    }
};

module.exports = licenses;