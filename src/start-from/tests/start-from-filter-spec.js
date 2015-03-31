'use strict';

var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('StartFromFilter',function(){
    beforeEach(function(){
        var mod  = mainModule('startfrom.test')
        angular.mock.module('startfrom.test')
    })
    describe('when filtering an array',function(){
        it('should page through list',function(){
            inject(function($filter){
                var arr = []
                for(var i = 0; i< 92; i++ ){
                    arr.push(i)
                }
                var result = $filter('startFrom')(arr, 20)
                result.length.should.equal(72)
                result[0].should.equal(20)
                result[71].should.equal(91)
            })

        })
    })

})
