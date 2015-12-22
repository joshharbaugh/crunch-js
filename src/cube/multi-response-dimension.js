'use strict'

module.exports = MultiResponseDimensionFactory

MultiResponseDimensionFactory.$inject = ['lodash', 'CompositeDimension']

function MultiResponseDimensionFactory(_, CompositeDimension) {
    var NONE = '__none__'
        , ANY = '__any__'
        , noneOrAny = [NONE, ANY]
        ;

    function MultiResponseDimension(data) {
        if(typeof(data)=='undefined'){return}
        data.type.elements = data.type.elements.map(function(i){
            var hide = i.value && noneOrAny.indexOf(i.value.id) > -1
            return _.extend(i, {hide: i.missing || hide })
        })
        this.data = data
        this.rawData = _.cloneDeep(data)
    }

    MultiResponseDimension.prototype.applyTransform = function(spec){
        this.data = _.cloneDeep(this.rawData) // reset
        if(!!!spec || !!!spec.elements.length) { return }
        var ext = this.rawData.type.elements
        var sourceIds = _.map(ext, 'id')
        var targetIds = _.map(spec.categories, 'id')
        var source = _.object(sourceIds, ext)
        var target = _.object(targetIds, spec.elements)
        // apply name, missingness, and hide from target
        targetIds.map(function(i){
            source[i] = _.assign(source[i], target[i])
        })
        // permute order: use target, then source
        var resultIds = targetIds.concat(sourceIds).filter(function(v, i, self){
            return self.indexOf(v) === i
        })
        this.extents = resultIds.map(function(i){
            return source[i]
        })
        this.targetPermutation = resultIds.map(function(i){
            return sourceIds.indexOf(i)
        })
        return this // targetPermutation must be applied to data
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

        , shownExtents : {
            get : function() {
                return this.extents.filter(function(el) {
                    var id = el.value && el.value.id || ''
                    return el.hide === false
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

        , labels : {
            get : function() {
                return this.shownExtents.map(function(el) {
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
