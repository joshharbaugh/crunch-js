'use strict'

module.exports = CategoricalDimensionFactory

CategoricalDimensionFactory.$inject = [
    'lodash'
]

function CategoricalDimensionFactory(_) {

    function CategoricalDimension(data) {
        this.data = data
    }

    Object.defineProperties(CategoricalDimension.prototype, {
        'name' : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , 'type' : {
            value : 'categorical'
        }

        , 'labels' : {
            get : function() {
                return this.validExtents.map(function(cat) {
                    return cat.name
                })
            }
        }

        , 'missing' : {
            get : function() {
                return this.data.type.categories.map(function(el) {
                    return el.missing
                })
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
                var elements = this.data.type.categories.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    // not any or none
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
                var elements = this.data.type.categories.filter(function(el, idx) {
                    var id = el.value && el.value.id || ''
                    if (el.missing === false){
                        out.push(idx)
                        return true
                    }
                })
                return out
            }
        }
        , 'length' : {
            get : function() {
                return this.data.type.categories.length
            }
        }

        , 'validLength' : {
            get : function() {
                return this.validExtents.length
            }
        }

        , 'validExtents' : {
            get : function() {
                return this.data.type.categories.filter(function(cat) {
                    return cat.missing === false
                })
            }
        }
        , 'prunedExtents': {
            set : function(replacement) {
                this.data.type.categories = replacement
            }
        }
    })

    return CategoricalDimension
}
