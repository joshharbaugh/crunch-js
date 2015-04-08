'use strict';

var mainModule = require('..')
    ,mocks= require('angular-mocks')
    ,scopeable = require('../../machina-angular')
    ,trigger = require('simulate-event')
    ;
describe('DragAndDrop',function(){

    function flush() {
        inject(function($timeout) {
            $timeout.flush()
        })
    }

    beforeEach(function(){
        var mod = mainModule()
        scopeable('machina.test')

        angular.mock.module(mod.name,'machina.test')
    })

    afterEach(function(){
        inject(function(dragAndDrop){
            dragAndDrop.destroy()
        })
    })
    describe('when created',function(){
        it('should be draggable',function(){
            inject(function(dragAndDrop) {
                dragAndDrop.state.should.equal('draggable')
            })
        })
    })
    describe('when dragging with move operation specified',function(){
        var scope
            ,el
            ,started
            ,cancelled
            ;
        beforeEach(function(){
            started = undefined
            inject(function($compile,$rootScope){
                scope = $rootScope.$new()
                $rootScope.$on('move:started',function(e,args){
                    started = args
                })
                $rootScope.$on('move:cancelled',function(e,args){
                    cancelled = args
                })

                scope.myObject = {
                    a: 1
                }

                var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="move"></div>')(scope)
                el = elm[0]
                scope.$digest()
                flush()
            })

        })
        beforeEach(function(){
            trigger(el, 'dragstart', {
                dataTransfer: {
                    effectAllowed: undefined
                    , setData : angular.noop
                }
            })
            scope.$digest()

        })
        it('should emit a start event',function(){
            started.operation.should.equal('move')
            started.event.should.equal('move:started')
            started.inflight.data.should.eql({a:1})
        })
        it('should add class',function(){
            el.classList.toString().should.contain('dragging')
        })
        it('should be moving',function(){
            inject(function(dragAndDrop){
                dragAndDrop.state.should.equal('moving')
            })
        })
        describe('and then cancelling',function(){
            beforeEach(function(){
                trigger(el, 'dragend',{ 'foo':'bar'})
                scope.$digest()
            })
            it('should be draggable again',function(){
                inject(function(dragAndDrop){
                    dragAndDrop.state.should.equal('draggable')

                })
            })
            it('should emit cancellation',function(){
                cancelled.operation.should.equal('move')
                cancelled.event.should.equal('move:cancelled')
                cancelled.inflight.data.should.eql({a:1})
            })

        })

    })
    describe('when dragging with copy operation specified',function(){
        var scope
            ,el
            ,started
            ,cancelled
            ;
        beforeEach(function(){
            inject(function($compile,$rootScope){
                started = undefined
                scope = $rootScope.$new()
                $rootScope.$on('copy:started',function(e, args){
                    started = args
                })
                $rootScope.$on('copy:cancelled',function(e, args){
                    cancelled = args
                })

                scope.myObject = {
                    a: 1
                }

                var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="copy"></div>')(scope)
                el = elm[0]
                scope.$digest()
                flush()
            })

        })
        beforeEach(function(){
            trigger(el, 'dragstart', {
                dataTransfer: {
                    effectAllowed: undefined
                    , setData : angular.noop
                }
            })
            scope.$digest()

        })
        it('should emit a start event',function(){
            started.operation.should.equal('copy')
            started.event.should.equal('copy:started')
            started.inflight.data.should.eql({a:1})
        })
        it('should be copying',function(){
            inject(function(dragAndDrop){
                dragAndDrop.state.should.equal('copying')
            })
        })
        describe('and then cancelling',function(){
            beforeEach(function(){
                trigger(el, 'dragend',{ 'foo':'bar'})
                scope.$digest()
            })
            it('should be draggable again',function(){
                inject(function(dragAndDrop){
                    dragAndDrop.state.should.equal('draggable')

                })
            })
            it('should emit cancellation',function(){
                cancelled.operation.should.equal('copy')
                cancelled.event.should.equal('copy:cancelled')
                cancelled.inflight.data.should.eql({a:1})
            })

        })
    })
    describe('when dragging with link operation specified',function(){
        var scope
            ,el
            ,started
            ,cancelled
            ;
        beforeEach(function(){
            started = undefined
            inject(function($compile,$rootScope){
                scope = $rootScope.$new()
                $rootScope.$on('link:started',function(e,args){
                    started = args
                })
                $rootScope.$on('link:cancelled',function(e,args){
                    cancelled = args
                })

                scope.myObject = {
                    a: 1
                }

                var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="link"></div>')(scope)
                el = elm[0]
                scope.$digest()
                flush()
            })

        })
        beforeEach(function(){
            trigger(el, 'dragstart', {
                dataTransfer: {
                    effectAllowed: undefined
                    , setData : angular.noop
                }
            })
            scope.$digest()

        })
        it('should emit a start event',function(){
            started.operation.should.equal('link')
            started.event.should.equal('link:started')
            started.inflight.data.should.eql({a:1})
        })
        it('should be linking',function(){
            inject(function(dragAndDrop){
                dragAndDrop.state.should.equal('linking')
            })
        })
        it('should store the inflight bits ',function(){
            inject(function(dragAndDrop){
                expect(dragAndDrop.inflight).to.exist
                var inflight = dragAndDrop.inflight
                inflight.data.should.eql({
                    a: 1
                })
                inflight.element.classList.contains('bling').should.be.true
            })
        })
        describe('and then cancelling',function(){
            beforeEach(function(){
                trigger(el, 'dragend',{ 'foo':'bar'})
                scope.$digest()
            })
            it('should be draggable again',function(){
                inject(function(dragAndDrop){
                    dragAndDrop.state.should.equal('draggable')

                })
            })
            it('should emit cancellation',function(){
                cancelled.operation.should.equal('link')
                cancelled.event.should.equal('link:cancelled')
                cancelled.inflight.data.should.eql({a:1})
            })

        })
    })
    describe('when dragging with no operation specified',function(){
        var scope
            ,el
            ,started
            ,cancelled
            ;
        beforeEach(function(){
            started = undefined
            inject(function($compile,$rootScope){
                scope = $rootScope.$new()
                $rootScope.$on('drag:started',function(e, args){
                    started = args
                })
                $rootScope.$on('drag:cancelled',function(e, args){
                    cancelled = args
                })

                scope.myObject = {
                    a: 1
                }

                var elm = $compile('<div dragit="myObject" class="bling"></div>')(scope)
                el = elm[0]
                scope.$digest()
                flush()
            })

        })
        beforeEach(function(){
            trigger(el, 'dragstart', {
                dataTransfer: {
                    effectAllowed: undefined
                    , setData : angular.noop
                }
            })
            scope.$digest()

        })
        it('should emit a start event',function(){
            started.operation.should.equal('drag')
            started.event.should.equal('drag:started')
            started.inflight.data.should.eql({a:1})
        })
        it('should be dragging',function(){
            inject(function(dragAndDrop){
                dragAndDrop.state.should.equal('dragging')
            })
        })
        it('should store the inflight bits ',function(){
            inject(function(dragAndDrop){
                expect(dragAndDrop.inflight).to.exist
                var inflight = dragAndDrop.inflight
                inflight.data.should.eql({
                    a: 1
                })
                inflight.element.classList.contains('bling').should.be.true
            })
        })
        describe('and then cancelling',function(){
            beforeEach(function(){
                trigger(el, 'dragend',{ 'foo':'bar'})
                scope.$digest()
            })
            it('should be draggable again',function(){
                inject(function(dragAndDrop){
                    dragAndDrop.state.should.equal('draggable')

                })
            })
            it('should emit cancellation',function(){
                cancelled.operation.should.equal('drag')
                cancelled.event.should.equal('drag:cancelled')
                cancelled.inflight.data.should.eql({a:1})
            })

        })
    })
    describe('when dropping an element',function(){
        var scope
            ,el
            ,dropEl
            ,dropped
            ,dragged
            ,droppedEvent
            ;
        beforeEach(function(){
            dragged= {
                a: 1
            }
            dropped = {
                b:2
            }
        })
        describe('when entering droppable area',function(){
            var dropEl
                ,dropScope
                ;
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    dropScope = $rootScope.$new()
                    dropScope.myDropObject = {}
                    var drop = $compile('<div dropit="myDropObject" dropit-event="myEventName"></div>')(dropScope)
                    dropScope.$digest()
                    dropEl  = drop[0]
                })

            })

            it('should add and remove class',function(){
                trigger(dropEl,'dragover',{
                    dataTransfer: {

                    }
                })
                dropScope.$apply()
                dropEl.classList.toString().should.contain('drag-over')
                trigger(dropEl,'dragleave')
                dropScope.$apply()
                dropEl.classList.toString().should.not.contain('drag-over')

            })
        })
        describe('given generic operation',function(){
            beforeEach(function(){
                inject(function($rootScope){
                    $rootScope.$on('myEventName',function(e,args){
                        droppedEvent = {
                            args: args
                        }
                    })
                })
            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()

                    scope.myObject = dragged

                    var elm = $compile('<div dragit="myObject" class="bling"></div>')(scope)
                    scope.$digest()
                    el = elm[0]
                    flush()
                })

            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    var dropScope = $rootScope.$new()
                    dropScope.myDropObject = dropped
                    var drop = $compile('<div dropit="myDropObject" dropit-event="myEventName"></div>')(dropScope)
                    dropScope.$digest()
                    dropEl  = drop[0]
                })

            })
            afterEach(function(){
                el.remove()
                dropEl.remove()
            })

            beforeEach(function(){
                trigger(el,'dragstart', {
                    dataTransfer: {
                        effectAllowed: undefined
                        , setData : angular.noop
                    }
                })
                trigger(dropEl,'dragover',{
                    dataTransfer: {
                    }
                })
                trigger(dropEl,'drop',{
                    dataTransfer: {
                        effectAllowed: 'all'
                    }
                })
                scope.$digest()
            })
            it('should publish operation',function(){
                expect(droppedEvent.args.operation).to.be.undefined
            })
            it('should publish dropped data',function(){
                droppedEvent.args.dropped.should.eql(dropped)
            })
            it('should publish dragged data',function(){
                droppedEvent.args.dragged.data.should.eql(dragged)
            })
        })
        describe('given copy operation',function(){
            beforeEach(function(){
                inject(function($rootScope){
                    $rootScope.$on('myEventName:copy',function(e,args){
                        droppedEvent = {
                            args: args
                        }
                    })
                })
            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()

                    scope.myObject = dragged

                    var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="copy"></div>')(scope)
                    scope.$digest()
                    el = elm[0]
                    flush()
                })

            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    var dropScope = $rootScope.$new()
                    dropScope.myDropObject = dropped
                    var drop = $compile('<div dropit="myDropObject" dropit-event="myEventName"></div>')(dropScope)
                    dropScope.$digest()
                    dropEl  = drop[0]
                })

            })
            afterEach(function(){
                el.remove()
                dropEl.remove()
            })

            beforeEach(function(){
                trigger(el,'dragstart', {
                    dataTransfer: {
                        effectAllowed: undefined
                        , setData : angular.noop
                    }
                })
                trigger(dropEl,'dragover',{
                    dataTransfer: {
                    }
                })
                trigger(dropEl,'drop',{
                    dataTransfer: {
                        effectAllowed: 'copy'
                    }
                })
                scope.$digest()
            })
            it('should publish operation',function(){
                droppedEvent.args.operation.should.equal('copy')
            })
            it('should publish dropped data',function(){
                droppedEvent.args.dropped.should.eql(dropped)
            })
            it('should publish dragged data',function(){
                droppedEvent.args.dragged.data.should.eql(dragged)
            })
        })
        describe('given move operation',function(){
            beforeEach(function(){
                inject(function($rootScope){
                    $rootScope.$on('myEventName:move',function(e,args){
                        droppedEvent = {
                            args: args
                        }
                    })
                })
            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()

                    scope.myObject = dragged

                    var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="move"></div>')(scope)
                    scope.$digest()
                    el = elm[0]
                    flush()
                })

            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    var dropScope = $rootScope.$new()
                    dropScope.myDropObject = dropped
                    var drop = $compile('<div dropit="myDropObject" dropit-event="myEventName"></div>')(dropScope)
                    dropScope.$digest()
                    dropEl  = drop[0]
                })

            })
            afterEach(function(){
                el.remove()
                dropEl.remove()
            })

            beforeEach(function(){
                trigger(el,'dragstart', {
                    dataTransfer: {
                        effectAllowed: undefined
                        , setData : angular.noop
                    }
                })
                trigger(dropEl,'dragover',{
                    dataTransfer: {
                        effectAllowed: undefined
                    }
                })
                trigger(dropEl,'drop',{
                    dataTransfer: {
                        effectAllowed: 'move'
                    }
                })
                scope.$digest()
            })
            it('should publish operation',function(){
                droppedEvent.args.operation.should.equal('move')
            })
            it('should publish dropped data',function(){
                droppedEvent.args.dropped.should.eql(dropped)
            })
            it('should publish dragged data',function(){
                droppedEvent.args.dragged.data.should.eql(dragged)
            })
        })
        describe('given link operation',function(){
            beforeEach(function(){
                inject(function($rootScope){
                    $rootScope.$on('myEventName:link',function(e,args){
                        droppedEvent = {
                            args: args
                        }
                    })
                })
            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()

                    scope.myObject = dragged

                    var elm = $compile('<div dragit="myObject" class="bling" dragit-operation="link"></div>')(scope)
                    scope.$digest()
                    el = elm[0]
                    flush()
                })

            })
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    var dropScope = $rootScope.$new()
                    dropScope.myDropObject = dropped
                    var drop = $compile('<div dropit="myDropObject" dropit-event="myEventName"></div>')(dropScope)
                    dropScope.$digest()
                    dropEl  = drop[0]
                })

            })
            afterEach(function(){
                el.remove()
                dropEl.remove()
            })

            beforeEach(function(){
                trigger(el,'dragstart', {
                    dataTransfer: {
                        effectAllowed: undefined
                        , setData : angular.noop
                    }
                })
                trigger(dropEl,'dragover',{
                    dataTransfer: {
                        effectAllowed: undefined
                    }
                })
                trigger(dropEl,'drop',{
                    dataTransfer: {
                        effectAllowed: 'link'
                    }
                })
                scope.$digest()
            })
            it('should publish operation',function(){
                droppedEvent.args.operation.should.equal('link')
            })
            it('should publish dropped data',function(){
                droppedEvent.args.dropped.should.eql(dropped)
            })
            it('should publish dragged data',function(){
                droppedEvent.args.dragged.data.should.eql(dragged)
            })
        })
    })
})
