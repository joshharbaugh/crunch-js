'use strict'

module.exports = MultiResponseDimensionFactory

MultiResponseDimensionFactory.$inject = ['lodash', 'CompositeDimension']

function MultiResponseDimensionFactory(_, CompositeDimension) {
    var noneOrAny = ['__none__', '__any__']
        ;

    function MultiResponseDimension(data) {
        this.data = data
    }

    function byId(data, id) {
        return data.filter(function(el) {
            return el.value && el.value.id === id
        })[0]
    }

    MultiResponseDimension.prototype = new CompositeDimension()

    Object.defineProperties(MultiResponseDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }
        , 'type' : {
            value : 'multiresponse'
        }
        , 'missing' : {
            get : function() {
                var elements = this.data.type.elements.map(function(el) {
                    var id = el.value && el.value.id || ''
                    return noneOrAny.indexOf(id) > -1 ? true : el.missing
                })
                return elements
            }
        }
        , 'validExtents' : {
            get : function() {
                return this.data.type.elements.filter(function(el) {
                    var id = el.value && el.value.id || ''
                    return el.missing === false && noneOrAny.indexOf(id) === -1
                })
            }
        }
        , 'subscripts' : {
            get: function(){
                return this.data.type.elements.map(function(e, i) { return i })
            }
        }
        , 'missingSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    // not any or none
                    if(el.missing){
                        out.push(idx)
                        return true
                    }
                },this)
                return out
            }
        }
        , 'validSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    if (el.missing === false && noneOrAny.indexOf(id) === -1){
                        out.push(idx)
                        return true
                    }
                },this)
                return out
            }
        }
        , 'validLength' : {
            get : function() {
                var elements = this.data.type.elements.filter(function(el) {
                    var id = el.value && el.value.id || ''
                    return noneOrAny.indexOf(id) > -1 ? false : !el.missing
                })
                return elements.length
            }
        }
        , 'countingSubscripts' : {
            get : function() {
                var ids = this.data.type.elements.map(function(el) {return el.id})
                return [ids.indexOf(0), ids.indexOf(-127)] // any, none
            }
        }
        , 'prunedExtents': {
            set : function(replacement) {
                this.data.type.elements = replacement
            }
        }
    })

    return MultiResponseDimension
}
