'use strict';


var mainModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('Tappable',function(){

    var sut
        ,scope
        ;
    beforeEach(function(){
        var mod = mainModule()

        angular.mock.module(mod.name)
    })

    function build($events){
        var inst
        inject(function(machina){
            var MyMachine = machina.Fsm.extend({
                $events:[]
                ,initialState: 'ready'
                ,destroy: function(){
                    this.transition('destroyed')
                }
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
                    ,'destroyed': {
                        _onEnter: function(){
                            this.off()
                        }
                        ,'a': function(e, args) {
                            this.invocations['a'] = args
                            this.invocationCounts['a'] = (this.invocationCounts['a'] || 0) + 1
                        }

                    }
                }
            })

            inst = new MyMachine()
        })
        return inst
    }
    describe('when machine defines $events',function(){
        var $rootScope
        beforeEach(function(){
            sut= build(['a','b'])
        })
        beforeEach(function(){
            inject(function(_$rootScope_){
                $rootScope = _$rootScope_
                scope = $rootScope.$new()
                sut.$scoped(scope)
                scope.$digest()
            })
        })
        beforeEach(function(){
            $rootScope.$emit('a',{complex:'thing'})
            $rootScope.$emit('b',['arr','ay'])
            scope.$digest()
        })
        it('should tap those $events onto the instance',function(){
            sut.invocations['a'].should.eql({complex:'thing'})
            sut.invocations['b'].should.eql(['arr','ay'])
        })
        it('should hold reference to tappable for manual intervention',function(){
            expect(sut.__tappable).to.exist
        })
    })
    describe('when unsubscribing a machine completely',function(){
        var $rootScope
        beforeEach(function(){
            sut= build(['a','b'])
        })
        beforeEach(function(){
            inject(function(_$rootScope_){
                $rootScope = _$rootScope_
                scope = $rootScope.$new()
                sut.$scoped(scope)
                scope.$digest()
            })
        })
        beforeEach(function(){
            $rootScope.$emit('a',{complex:'thing'})
            scope.$digest()
        })
        beforeEach(function(){
            sut.off()
        })
        beforeEach(function(){
            $rootScope.$emit('a',{complex:'thing'})
            scope.$digest()
        })
        it('should no longer respond to those events',function(){
            sut.invocationCounts['a'].should.equal(1)
        })
    })

    describe('when destroying a machine with a state transition to `destroyed`',function(){
        var $rootScope
        beforeEach(function(){
            sut= build(['a','b'])
        })
        beforeEach(function(){
            inject(function(_$rootScope_){
                $rootScope = _$rootScope_
                scope = $rootScope.$new()
                sut.$scoped(scope)
                scope.$digest()
            })
        })
        beforeEach(function(){
            $rootScope.$emit('a',{complex:'thing'})
            scope.$digest()
        })
        beforeEach(function(){
            sut.destroy()
        })
        beforeEach(function(){
            $rootScope.$emit('a',{complex:'thing'})
            scope.$digest()
        })
        it('should no longer respond to those events',function(){
            sut.invocationCounts['a'].should.equal(1)
        })
    })
})

