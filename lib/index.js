/* eslint-disable indent */

/**
 * @fileoverview A collection of  eslint rules.
 * @author Jacques Favreau (@betaorbust)
 */
'use strict';
//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules
module.exports.rules = {
    'no-jsx-spread': require('./rules/no-jsx-spread'),
    'no-dead-code': require('./rules/no-dead-code'),
    'no-reassigned-consts': require('./rules/no-reassigned-consts')
};
