
const sf = require('@spiral-toolkit/core').default;
const Date = require('./date').default;

sf.instancesController.registerInstanceType(Date, 'sf-js-date');
module.exports = Date; // ES6 default export will not expose us as global