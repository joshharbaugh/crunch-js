'use strict';

var mainModule = require('..')
    ,mocks = require('angular-mocks')
    ,machina = require('../../machina-angular')
    ,trigger = require('simulate-event')
    ;
describe('Transition',function(){
    var Machine
        ,scope
        ,el
        ;
    beforeEach(function(){
        var mod = mainModule()
        angular.mock.module(mod.name)
    })

    function __triggerKeyboardEvent(el, keyCode)
    {
        var eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent("Events");

        if(eventObj.initEvent){
            eventObj.initEvent("keyup", true, true);
        }

        eventObj.keyCode = keyCode;
        eventObj.which = keyCode;

        el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeyup", eventObj);


    }
    function triggerKeyboardEvent(el, keyCode){
        var keyboardEvent = document.createEvent("KeyboardEvent");

        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";


        keyboardEvent[initMethod](
            "keyup",
            true,      // bubbles oOooOOo0
            true,      // cancelable
            window,    // view
            false,     // ctrlKeyArg
            false,     // altKeyArg
            false,     // shiftKeyArg
            false,     // metaKeyArg
            keyCode,
            0          // charCode
        );

        el.dispatchEvent(keyboardEvent);
    }

    beforeEach(function(){
        inject(function(machina){
            Machine = machina.Fsm.extend({
                initialState: 'initialized'
                ,states: {
                    initialized: {
                        cancel: function(){
                            this.transition('cancelled')
                        }
                        ,aa: function(){
                            this.transition('aa')
                        }
                    }
                    ,aa: {
                        bb: function(){
                            this.transition('bb')
                        }
                    }
                    ,bb: {
                        cancel: function(){
                            this.transition('aa')
                        }
                    }
                    ,cancelled:{}
                }
            })
        })

    })
    describe('given when',function(){
        beforeEach(function(){
            el = document.createElement('div')
            el.setAttribute('transition','myMachine')
            el.setAttribute('transition-when','bb')
        })
        beforeEach(function(){
            document.body.appendChild(el)
        })
        afterEach(function(){
            el.remove()
        })
        beforeEach(function(){
            inject(function($compile,$rootScope){
                scope = $rootScope.$new()
                scope.myMachine = new Machine()
                $compile(el)(scope)
                scope.$digest()
            })
        })
        describe('when clicking inside the element',function(){
            var handled
            beforeEach(function(){
                document.body.addEventListener('click',function(e){
                    handled = e
                })
            })

            beforeEach(function(){
                el.click()
                scope.$digest()
            })
            it('should not handle cancel',function(){
                scope.myMachine.state.should.equal('initialized')
            })
            it('should not interfere with other click handlers',function(){
                handled.should.be.ok

            })
        })
        describe('when clicking outside the element',function(){
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()
                    scope.myMachine = new Machine()
                    $compile(el)(scope)
                    scope.$digest()
                })
            })
            describe('given different state',function(){
                it('should not handle cancel when click outside',function(){
                    document.body.click()
                    scope.$digest()
                    scope.myMachine.state.should.equal('initialized')
                })
            })
            describe('given when state',function(){
                it('should handle cancel when clicked outside',function(){
                    scope.myMachine.transition('bb')
                    scope.$digest()
                    document.body.click()
                    scope.$digest()
                    scope.myMachine.state.should.equal('aa')
                })

            })


        })

    })
    describe('given no when',function(){
        beforeEach(function(){
            el = document.createElement('div')
            el.setAttribute('transition','myMachine')
        })
        beforeEach(function(){
            document.body.appendChild(el)
        })
        afterEach(function(){
            el.remove()
        })
        describe('when clicking inside the element',function(){

            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()
                    scope.myMachine = new Machine()
                    $compile(el)(scope)
                    scope.$digest()
                })
            })

            it('should not handle cancel',function(){
                el.click()
                scope.$digest()
                scope.myMachine.state.should.equal('initialized')
            })
        })
        describe('on escaping',function(){
            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()
                    scope.myMachine = new Machine()
                    $compile(el)(scope)
                    scope.$digest()
                })
            })

            it('should handle',function(){
                __triggerKeyboardEvent(document.body,27)
                scope.$digest()
                scope.myMachine.state.should.equal('cancelled')

            })

        })
        describe('when clicking outside the element',function(){

            beforeEach(function(){
                inject(function($compile,$rootScope){
                    scope = $rootScope.$new()
                    scope.myMachine = new Machine()
                    $compile(el)(scope)
                    scope.$digest()
                })
            })

            it('should handle cancel when clicked outside',function(){
                document.body.click()
                scope.$digest()
                scope.myMachine.state.should.equal('cancelled')
            })
        })

    })

})
