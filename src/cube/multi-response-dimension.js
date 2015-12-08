'use strict'

module.exports = MultiResponseDimensionFactory

MultiResponseDimensionFactory.$inject = ['lodash', 'CompositeDimension']

function MultiResponseDimensionFactory(_, CompositeDimension) {
    var NONE = '__none__'
        , ANY = '__any__'
        , noneOrAny = [NONE, ANY]
        ;

    function MultiResponseDimension(data) {
        this.data = data
    }

    function byId(data, id) {
        return data.filter(function(el) {
            return el.value && el.value.id === id
        })[0]
    }

    function subscriptById(data, id) {
        var subscript = null
            ;

        data.some(function(el, idx) {
            var found = false
            if(el.value && el.value.id === id) {
                subscript = idx
                found = true
            }

            return found
        })

        return subscript
    }

    MultiResponseDimension.prototype = new CompositeDimension()

    Object.defineProperties(MultiResponseDimension.prototype, {
        name : {
            get : function(){
                return this.data.references.name || undefined
            }
        }

        , type : { value : 'multiresponse' }

        , missing : {
            get : function() {
                return this.data.type.elements.map(function(el) {
                    var id = el.value && el.value.id || ''
                    return noneOrAny.indexOf(id) > -1 ? true : el.missing
                })
            }
        }

        , extents : {
            get : function() {
                return this.data.type.elements
            }
        }

        , missingExtents : {
            get : function() {
                return this.extents.filter(function(el) {
                    var id = el.value && el.value.id || ''
                    return el.missing === false && noneOrAny.indexOf(id) > -1
                })
            }
        }

        , validExtents : {
            get : function() {
                return this.extents.filter(function(el) {
                    var id = el.value && el.value.id || ''
                    return el.missing === false && noneOrAny.indexOf(id) === -1
                })
            }
        }

        , validLabels : {
            get : function() {
                return this.validExtents.map(function(el) {
                    return el.value.references.name
                })
            }
        }

        , none : {
            get : function() {
                return byId(this.extents, NONE)
            }
        }

        , any : {
            get : function() {
                return byId(this.extents, ANY)
            }
        }

        , noneSubscript : {
            get : function() {
                return subscriptById(this.extents, NONE)
            }
        }

        , anySubscript : {
            get : function() {
                return subscriptById(this.extents, ANY)
            }
        }

        , subscripts : {
            get: function(){
                return this.data.type.elements.map(function(e, i) { return i })
            }
        }

        , missingSubscripts: {
            get : function() {
                return this.extents.reduce(function(missings, el, idx) {
                    return el.missing === true ? missings.concat([idx]) : missings
                }, [])
            }
        }

        , validSubscripts: {
            get : function() {
                return this.extents.reduce(function(validSubscripts, el, idx) {
                    var id = el.value && el.value.id || ''
                        , valid = el.missing === false && noneOrAny.indexOf(id) === -1
                        ;

                    return valid ? validSubscripts.concat([idx]) : validSubscripts
                }, [])
            }
        }

        , validLength : {
            get : function() {
                return this.validExtents.length
            }
        }

        , countingSubscripts : {
            get : function() {
                var ids = this.data.type.elements.map(function(el) {return el.id})
                return [ids.indexOf(0), ids.indexOf(-127)] // any, none
            }
        }

        , prunedExtents: {
            set : function(replacement) {
                this.data.type.elements = replacement
            }
        }
    })

    return MultiResponseDimension
}
