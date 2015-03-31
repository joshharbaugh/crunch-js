'use strict';

var mainMod = require('../index')

describe('finding variable urls in crunch metadata', function(){
    var sut, blob;

    beforeEach(function(){
        mainMod('cube.test')
        angular.mock.module('cube.test')

        inject(function(crFindVariables){
            sut = crFindVariables
        })
    })
    it('should find a simple variable', function(){
        blob = {variable: '/variable/123/'}
        sut(blob).should.equal('/variable/123/')
    })
    it('should find an "each" variable', function(){
        blob = {each: '/variable/123/'}
        sut(blob).should.equal('/variable/123/')
    })
    it('should find a binned variable', function(){
        blob = {function: 'bin', args: ['/variable/123/']}
        sut(blob).should.equal('/variable/123/')
    })
    it('should find a variable in a function', function(){
        blob = {function: 'cube_mean', args: ['/variable/123/']}
        sut(blob).should.equal('/variable/123/')
    })
    it('should find a rolledup datetime variable', function(){
        blob = {'function': 'rollup',
            'args': [
                {'variable': '/variable/123/'}
                ,{'value': 'Y'}
            ]}
        sut(blob).should.equal('/variable/123/')
    })
})
