'use strict';
var mocks = require('angular-mocks')
module.exports = function(moduleName){
    beforeEach(function(){
        var ctx  = this
        //moduleName passed in, so use that injector
        if(moduleName) {
            angular.mock.module(moduleName)
        }
        ctx = this
        //use the $injector from either:
        //1. A previous beforeEach block that uses `module`
        //2. The module declared by passing in a moduleName
        inject(function(_$httpBackend_, _Shoji_) {
            ctx.$httpBackend = _$httpBackend_;
            ctx.Shoji = _Shoji_
        })
    })
    afterEach(function() {
        try {
            inject(function($rootScope, _$httpBackend_) {
                $rootScope.$destroy();
                _$httpBackend_.verifyNoOutstandingExpectation();
                _$httpBackend_.verifyNoOutstandingRequest()
            })
        } catch (err) {
            console.error(err)
        }
    });
}
