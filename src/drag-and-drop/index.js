'use strict';
module.exports = buildModule

function buildModule(moduleName) {
    var mod = angular.module(moduleName || 'drag-and-drop', []);
    mod.directive('drag', require('./drag-directive'));
    mod.directive('drop', require('./drop-directive'));
    mod.directive('dragCover', require(
        './drag-cover-directive'));

    mod.directive('dragit',require('./dragit-directive'))
    mod.directive('dropit',require('./dropit-directive'))
    mod.factory('dragAndDrop',require('./drag-and-drop'))
    return mod
}
