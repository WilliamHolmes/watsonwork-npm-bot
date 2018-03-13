const _ = require('underscore');

const constants = require('./constants');
const licenses = require('./license');
const strings = require('./strings');

const getDepricated = deprecated => (deprecated ? `*Deprecated*: ${deprecated}\n\n` : '');

const getDownloads = downloads => (`*${downloads.toLocaleString()}* download${downloads > 1 ? 's' : ''} in the last month\n\n`);

const getNPM = name => (`*NPM*: ${strings.substitue(constants.urls.NPM, [name])}\n`);

const getHomepage = homepage => (homepage ? `*HomePage*: ${homepage}\n` : '');

const getBugs = bugs => (bugs ? `*Bugs*: ${bugs.url}\n` : '');

const getLicense = license => (license ? `*License*: ${licenses.get(license)}` : '');

const getTitle = (version, versions) => {
    const { length: total } = _.keys(versions);
    return `${version} is the latest of ${total} release${total > 1 ? 's' : ''}`;
}

const getDescription = description => `${description}\n\n`;

module.exports = {
    getBugs,
    getDepricated,
    getDescription,
    getDownloads,
    getHomepage,
    getLicense,
    getNPM,
    getTitle
};
