'use strict'

module.exports = CompositeDimensionFactory

CompositeDimensionFactory.$inject = ['lodash']

function CompositeDimensionFactory(_) {

    function CompositeDimension(data) {
        this.data = data

    }

    Object.defineProperties(CompositeDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , 'type' : {
            value : 'composite'
        }

        , 'missing' : {
            get : function() {
                return this.data.type.elements.map(function(el) {
                    return el.missing
                })
            }
        }

        , labels : {
            get : function() {
                return this.validExtents.map(function(el) {
                    return el.value.references.name
                })
            }
        }

        , length : {
            get : function() {
                return this.data.type.elements.length
            }
        }

        , validLength : {
            get : function() {
                return this.validExtents.length
            }
        }

        , 'validExtents' : {
            get : function() {
                return this.extents.filter(function(el) {
                    return el.missing === false
                })
            }
        }

        , extents : {
            get : function() {
                return this.data.type.elements
            }

            , set : function(value) {
                this.data.type.elements = value
            }
        }

        , 'subscripts' : {
            get: function(){
                return this.data.type.categories.map(function(e, i) { return i })
            }
        }
        , 'missingSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    if(el.missing){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
        , 'validSubscripts' : {
            get : function() {
                var out = []
                var elements = this.data.type.elements.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    if (el.missing === false){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
        , 'prunedExtents': {
            set : function(replacement) {
                this.data.type.elements = replacement
            }
        }
    })

    return CompositeDimension
}
