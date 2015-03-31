'use strict';

var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('Scopeable',function(){

    var sut
        ,scope
        ;
    beforeEach(function(){
        var mod = mainModule('scopeable.test')

        angular.mock.module('scopeable.test')
    })

    function build($events){
        var inst
        inject(function(machina){
            var MyMachine = machina.Fsm.extend({
                $events:[]
                ,initialState: 'ready'
                ,initialize: function(){
                    this.$events = $events || []
                }
                ,invocations: {}
                ,invocationCounts: {}
                ,states: {
                    'ready': {
                        'a': function(e, args) {
                            this.invocations['a'] = args
                            this.invocationCounts['a'] = (this.invocationCounts['a'] || 0) + 1
                        }
                        ,'b': function(e, args) {
                            this.invocations['b'] = args
                            this.invocationCounts['b'] = (this.invocationCounts['b'] || 0) + 1
                        }
                    }
                }
            })

            inst = new MyMachine()
        })
        return inst
    }
    describe('when $scope has been $destroyed',function(){
        describe('Given machine has a destroy fn',function(){
            beforeEach(function(){
                sut = build()
            })
            beforeEach(function(){
                sut.destroy = function(){
                    this.destroyed = true
                }
            })
            beforeEach(function(){
                sut.on('c',function(){
                    sut.hasC = true
                })
            })
            beforeEach(function(){
                inject(function($rootScope){
                    scope = $rootScope.$new()
                    sut.$scoped(scope)
                    scope.$digest()
                })
            })
            beforeEach(function(){
                scope.$emit('$destroy')
                scope.$digest()
            })
            it('should invoke that destroy function',function(){
                sut.destroyed.should.be.true
            })
            it('should not have $scope anymore',function(){
                sut.$scopeable.destroyed.should.be.true
            })
            it('should not unsubscribe machina listeners',function(){
                sut.emit('c')
                scope.$digest()
                sut.hasC.should.be.true

            })
        })
        describe('Given machine doesnt have a destroy fn',function(){
            beforeEach(function(){
                sut = build()
                delete sut.destroy
            })
            beforeEach(function(){
                sut.on('c',function(){
                    sut.hasC = true
                })
            })
            beforeEach(function(){
                inject(function($rootScope){
                    scope = $rootScope.$new()
                    sut.$scoped(scope)
                    scope.$digest()
                })
            })
            beforeEach(function(){
                scope.$emit('$destroy')
                scope.$digest()
            })
            it('should not have $scope anymore',function(){
                sut.$scopeable.destroyed.should.be.true
            })
            it('should unsubscribe machina listeners',function(){
                sut.emit('c')
                expect(sut.hasC).not.to.exist
            })
        })

    })
})

