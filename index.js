'use strict';

const webshot = require('webshot');

const logger = require('winston');

const del = require('delete');
const moment = require('moment');
const npmAPI = require('api-npm');
const Q  = require('q');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const constants = require('./js/constants');
const packages = require('./js/packages');
const strings = require('./js/strings');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));


app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    _.each(content.match(constants.regex.NPM), p => {
        const packageName = strings.chompLeft(p.toLowerCase(), constants.regex.KEY);
        packages.getAnnotation(packageName).then(data => {
            app.sendMessage(spaceId, data);
            // const URL = strings.substitue(constants.urls.NPM, [packageName]);
            // const filePath = `./${constants.TEMP_DIR}/npm_${packageName}.png`;
            // webshot(URL, filePath, err => {
            //     app.sendMessage(spaceId, data);
            //     if (_.isEmpty(err)) {
            //         app.sendFile(spaceId,filePath);
            //         del.sync(filePath, { force: true });
            //     }
            // });
        });
    });
});

app.on('actionSelected:/NPM', (message, annotation, params) => {
    const { userId } = message;
    const promises = _.map(params, packages.getCard);
    if(_.isEmpty(promises)) {
        app.sendTargetedMessage(userId, annotation, UI.generic(constants.NOT_FOUND, ''))
    } else {
        Q.allSettled(promises).then(data => {
            const cards = _.pluck(data, 'value');
            app.sendTargetedMessage(userId, annotation, cards);
        });
    }
});

app.on('actionSelected', (message, annotation) => {
   const { actionId } = annotation;
   if (actionId.includes(constants.ACTION_ID)) {
       const packageName = strings.chompLeft(actionId, constants.ACTION_ID);
       packages.getAnnotation(packageName).then(data => {
            const { spaceId, userId } = message;
            app.sendMessage(spaceId, data);
            app.sendTargetedMessage(userId, annotation, UI.generic(packageName, constants.PACKAGE_SHARED))
       });
   }
});
