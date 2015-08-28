'use strict';

module.exports = buildModule

var angular = require('angular')
;

function buildModule(moduleName, cfg) {
    var mod = angular.module(moduleName || 'user-preferences', []);
    mod.factory('userPreferences', require('./user-preferences'));
    mod.factory('setUserPreferencesHandler', require('./set-user-preferences-handler'))
    return mod
}
