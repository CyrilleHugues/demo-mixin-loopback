var moment = require('moment');
var _ = require('lodash');

module.exports = function(Model, options) {
  'use strict';

  Model.defineProperty('stepDate', {
    "type": "date"
  });

  Model.defineProperty('dueDate', {
    "type": "date"
  });

  if (options.intervalInDays) {
    Model.observe('before save', function event(ctx, next) {
      if (ctx.instance) {
        var interval = parseInt(options.intervalInDays);
        if (!_.isDate(ctx.instance.stepDate)) {
          ctx.instance.stepDate = new Date();
        }
        var stepMoment = moment(ctx.instance.stepDate);
        ctx.instance.dueDate = stepMoment.add(options.intervalInDays, 'days').toDate();
      }

      return next();
    });
  }
}
