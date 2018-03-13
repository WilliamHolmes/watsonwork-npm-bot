const moment = require('moment');
const npmAPI = require('api-npm');
const _ = require('underscore');

const UI = require('watsonworkspace-sdk').UI;

const constants = require('./constants');
const messages = require('./messages');

const isUnpublished = data => (data && data.time && data.time.unpublished);

const getPackage = (packageName = '', callBack) => {
    return new Promise(resolve => {
        const pName = packageName.toLowerCase();
        const thisMonth = moment().format(constants.DATE_FORMAT);
        const lastMonth = moment().subtract(constants.DATE_OFFSET, constants.DATE_UNIT).format(constants.DATE_FORMAT);
        npmAPI.getstat(pName, lastMonth, thisMonth, stats => {
            const data = stats.error ? {} : { stats };
            npmAPI.getdetails(pName, details => resolve(callBack(Object.assign(details, data))));
        });
    });
};

const getAnnotation = packageName => {
    return getPackage(packageName, data => {
        let message;
        if(_.isEmpty(data)) {
            message = { title: '', text: constants.PACKAGE_NOT_FOUND, actor: { name: packageName } };
        } else if (isUnpublished(data)) {
            const { name } = data;
            message = { title: '', text: constants.PACKAGE_UNPUBLISHED, actor: { name } };
        } else {
            const { bugs, 'dist-tags': { latest }, stats: { downloads }, license, versions } = data;
            const { deprecated, description, homepage, name, version } = versions[latest];

            const descriptionText = messages.getDescription(description);
            const downloadsText = messages.getDownloads(downloads);
            const deprecatedText = messages.getDepricated(deprecated);
            const npmText = messages.getNPM(name);
            const homePageText = messages.getHomepage(homepage);
            const bugsText = messages.getBugs(bugs);
            const licenseText = messages.getLicense(license);

            const title = messages.getTitle(version, versions);
            const text = `${descriptionText} ${downloadsText} ${deprecatedText} ${npmText} ${homePageText} ${bugsText} ${licenseText}`

            message = { title, text, actor: { name } };
        }
        return Object.assign({ type: 'generic', version: '1', color: constants.COLOR }, message);
    });
};

const getCard = packageName => {
    return getPackage(packageName, data => {
        if(_.isEmpty(data)) {
            return UI.card(packageName, '', constants.PACKAGE_NOT_FOUND);
        } else {
            const { name, time, description, 'dist-tags': { latest }, homepage, license } = data;
            const title = `${name} (${latest})`;
            const subTitle = constants.CREATED;
            const date = +(new Date(time[latest]));
            const actionId = `${constants.ACTION_ID}${packageName}`;
            return UI.card(title, subTitle, description, [UI.cardButton(constants.BUTTON_SHARE, actionId)], date);
        }
    });
}

module.exports = { getAnnotation, getCard, getPackage };
