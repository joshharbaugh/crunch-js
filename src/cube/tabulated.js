'use strict';

module.exports = TabulatedFactory

TabulatedFactory.$inject = [
    'lodash'
    ,'cube'
    ,'ndarray'
    ,'ndarrayScratch'
]
/*
@param body an ndarray
@param margins arrays of arrays with corresponding shapes

Each is an object with arbitrary names
*/
function TabulatedFactory(_, Cube, ndarray, scratch){
    function Tabulated(bodies, margins){
        this.bodies = bodies
        this.margins = margins
    }
    Object.defineProperties(Tabulated.prototype, {
        'subscripts': {
            'get': function(){
                var shape = this.bodies.value.shape.slice()
                return shape.map(function(len){
                    return _.range(0, len)
                })
            }
        }
    })
    Tabulated.prototype.filterPermute = function(subscripts){
        var newMargins = {}, newBodies = {}
        _.forEach(this.margins, function(item,key){
            newMargins[key] = subscripts.map(function(s,dim){
                var out = []
                var orig = item[dim]
                if(orig===undefined) {
                    return []
                }
                s.forEach(function(i){
                    out.push(orig[i])
                }, this)
                return out
            }, this)
        }, this)
        _.forEach(this.bodies, function(body,key){
            var orig = scratch.clone(body)
            var getThese = Cube.prod.apply(this, subscripts)
            var newShape = subscripts.map(function(d){ return d.length })
            var newBody = scratch.malloc(newShape)
            newBody.data = getThese.map(function(d){
                return orig.get.apply(orig, d)
            })
            newBodies[key] = newBody
        })
        this.bodies = newBodies
        this.margins = newMargins
    }

    Tabulated.prototype.dataFrameTable = function(){
        // TODO this should do for each key in bodies not just main
        var labels = Cube.prod.apply(this, this.margins.labels)
        var dftLabels = []
        labels.forEach(function(lab,i){
            dftLabels.push({})
            lab.forEach(function(each, j){
                dftLabels[i]['var'+j] = lab[j]
            }, this)
            _.forEach(this.bodies, function(bodyTable, k){
                dftLabels[i][k] = bodyTable.data[i]
            }, this)
        }, this)
        return dftLabels
    }
    return Tabulated
}
