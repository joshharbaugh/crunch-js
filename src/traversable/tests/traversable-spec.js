'use strict';

var mainModule = require('..')
    ,mocks = require('angular-mocks')
    ;
describe('Traversable',function(){
    var sut
    beforeEach(function(){
        var mod = mainModule()
        angular.mock.module(mod.name)
    })
    function buildList(count){
        var list = []
        for(var i = 0; i < count; i++) {
            list.push(i)
        }
        return list
    }
    describe('when augmenting an target',function(){
        var target
        beforeEach(function(){
            target = {
                list: buildList(122)
            }
            inject(function(Traversable){
                sut = new Traversable({
                    pageLength: 40
                    ,pctOverlap: 1
                })
                sut.augment(target,'list')
            })
        })
        it('should expando traversal',function(){
            target.inc()
            target.page.should.equal(1)
        })
        it('should expando props',function(){
            target.pages.should.equal(4)
        })
    })
    describe('when target collection changes',function(){
        describe('given state still within bounds',function(){
            var target
            beforeEach(function(){
                target = {
                    list: buildList(122)
                }
                inject(function(Traversable){
                    sut = new Traversable({
                        pageLength: 40
                        ,pctOverlap: 1
                    })
                    sut.interpret(target,'list')
                    sut.pages.should.equal(4)
                })
            })
            beforeEach(function(){
                //do something things
                sut.inc()
                sut.inc()
                sut.page.should.equal(2)
            })
            beforeEach(function(){
                //change colection
                sut.retraversable({
                    list: buildList(163)
                },'list')

            })
            it('should preserve state',function(){
                sut.page.should.equal(2)
            })
            it('should reflect those changes',function(){
                sut.pages.should.equal(5)
            })

        })
        describe('given state still within bounds',function(){
            var target
            beforeEach(function(){
                target = {
                    list: buildList(122)
                }
                inject(function(Traversable){
                    sut = new Traversable({
                        pageLength: 40
                        ,pctOverlap: 1
                    })
                    sut.interpret(target,'list')
                    sut.pages.should.equal(4)
                })
            })
            it('should reflect those changes',function(){
                sut.retraversable({
                    list: buildList(40)
                },'list')
                sut.pages.should.equal(1)
            })

        })
    })
    describe('when interpreting',function(){
        var target
        beforeEach(function(){
            target = {
                list: buildList(122)
            }
            inject(function(Traversable){
                sut = new Traversable({
                    pageLength: 40
                    ,pctOverlap: 1
                })
                sut.interpret(target,'list')
            })
        })
        it('should not extend the input obj',function(){
            expect(target.max).not.to.exist
            expect(target.pages).not.to.exist
        })

        it('should expose zero-indexed number of pages',function(){
            sut.pages.should.equal(4)
        })
        it('should start at 0',function(){
            sut.startFrom.should.equal(0)
        })
        it('should expose number of items eligible in a page',function(){
            sut.pageLength.should.equal(40)
        })
        it('should support fetching itemCountAt any page',function(){
            sut.itemCountAt(0).should.equal(40)
            sut.itemCountAt(1).should.equal(40)
            sut.itemCountAt(2).should.equal(40)
            sut.itemCountAt(3).should.equal(2)
        })

        describe('given that the number of items is less than the max items allowed', function() {
            var target

            beforeEach(function(){
                target = {
                    list: buildList(25)
                }
                inject(function(Traversable){
                    sut = new Traversable({
                        pageLength: 40
                        ,pctOverlap: 0.5
                    })
                    sut.interpret(target,'list')
                })
            })

            it('should not calculate more than 1 page because of the percent overlap', function() {
                expect(sut.pages).to.equal(1)
            })
        })
    })
    describe('when skipping to a page',function(){
        beforeEach(function(){
            inject(function(Traversable){
                sut = new Traversable({
                    pageLength: 40
                    ,pctOverlap: 1
                })
                sut.interpret({
                    list:buildList(122)
                },'list')
            })
        })
        it('should stay within lower bounds',function(){
            sut.openAt(-1)
            sut.page.should.equal(0)
        })
        it('should stay within upper bounds',function(){
            sut.openAt(5)
            sut.page.should.equal(0)
        })
        it('should page within bounds',function(){
            sut.openAt(3)
            sut.page.should.equal(3)
        })
        it('should update traversability',function(){
            sut.openAt(sut.pages)
            sut.incrementable.should.be.false
        })
        it('should update startFrom',function(){
            sut.openAt(3)
            sut.startFrom.should.equal(120)
        })

    })
    describe('when traversing',function(){
        beforeEach(function(){
            inject(function(Traversable){
                sut = new Traversable({
                    pageLength: 40
                    ,pctOverlap: 1
                })
                sut.interpret({
                    list:buildList(122)
                },'list')
            })
        })
        it('should update traversability',function(){
            sut.page.should.equal(0)
            sut.incrementable.should.be.true
            sut.decrementable.should.be.false
            sut.inc()
            sut.page.should.equal(1)
            sut.incrementable.should.be.true
            sut.decrementable.should.be.true
            sut.dec()
            sut.incrementable.should.be.true
            sut.decrementable.should.be.false
        })
        it('should stop traversing eventually',function(){
            sut.page.should.equal(0)
            sut.inc()
            sut.page.should.equal(1)
            sut.inc()
            sut.inc()
            sut.page.should.equal(3)
            sut.inc()
            sut.incrementable.should.be.false
            sut.itemCountAt(3).should.equal(2)
        })

    })

})
