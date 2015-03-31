;
require.config({
    baseUrl: '/'
});
require(['index'], function(directives) {
    'use strict';
    directives('drag-and-drop');
    angular.mock.module('drag-and-drop')
})