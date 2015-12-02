'use strict'

module.exports = CategoricalDimensionFactory

CategoricalDimensionFactory.$inject = []

function CategoricalDimensionFactory() {

    function CategoricalDimension(data) {
        this.data = data
    }

    Object.defineProperties(CategoricalDimension.prototype, {
        name : {
            get : function(){
                return this.data.references.name || undefined
            }
        }
        , type : {
            value : 'categorical'
        }
        , labels : {
            get : function() {
                return this.validExtents.map(function(cat) {
                    return cat.name
                })
            }
        }
        , missingLabels : {
            get : function() {
                return this.missingExtents.map(function(cat) {
                    return cat.name
                })
            }
        }
        , missing : {
            get : function() {
                return this.data.type.categories.map(function(el) {
                    return el.missing
                })
            }
        }
        , subscripts : {
            get: function() {
                return this.data.type.categories.map(function(e, i) { return i })
            }
        }
        , missingSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, index) {
                    return el.missing ? accum.concat([index]) : accum
                }, [])
            }
        }
        , validSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, idx) {
                    return el.missing === false ? accum.concat([idx]) : accum
                }, [])
            }
        }
        , countingSubscripts : {
            get : function() {
                return this.data.type.categories.reduce(function(accum, el, idx) {
                    return el.missing === false ? accum.concat([idx]) : accum

                }, [])
            }
        }
        , length : {
            get : function() {
                return this.data.type.categories.length
            }
        }

        , validLength : {
            get : function() {
                return this.validExtents.length
            }
        }

        , extents : {
            get : function() {
                return this.data.type.categories
            }
        }

        , missingExtents : {
            get : function() {
                return this.data.type.categories.filter(function(cat) {
                    return cat.missing === true
                })
            }
        }

        , validExtents : {
            get : function() {
                return this.data.type.categories.filter(function(cat) {
                    return cat.missing === false
                })
            }
        }
        , prunedExtents: {
            set : function(replacement) {
                this.data.type.categories = replacement
            }
        }
    })

    return CategoricalDimension
}
