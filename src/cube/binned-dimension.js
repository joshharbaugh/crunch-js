'use strict'

module.exports = BinnedDimensionFactory

BinnedDimensionFactory.$inject = [
    'lodash'
]

function BinnedDimensionFactory(_) {

    function BinnedDimension(data) {
        this.data = data
    }

    Object.defineProperties(BinnedDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , 'type' : {
            value : 'binned'
        }

        ,'labels' : {
            get : function() {
                return this.validExtents.map(function(el) {
                    return el.value
                })
            }
        }

        , 'missing' : {
            get : function() {
                return this.data.type.elements.map(function(el) {
                    return el.missing
                })
            }
        }

        , 'length' : {
            get : function() {
                return this.data.type.elements.length
            }
        }

        , 'validLength' : {
            get : function() {
                return this.validExtents.length
            }
        }

        , 'validExtents' : {
            get : function() {
                return this.data.type.elements.filter(function(el) {
                    return el.missing === false
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
        , 'countingSubscripts' : {
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

    return BinnedDimension
}
