'use strict';

module.exports = MultiTableFactory

MultiTableFactory.$inject = [
    'lodash'
    ,'$q'
    ,'cube'
    ,'stats'
    ,'ndarrayOps'
    ,'ndarrayScratch'
    ,'ndarrayUnpack'
    ,'show'
]
function MultiTableFactory(_, $q, cube, stats, ops, scratch, unpack, show){
    function MultiTable(){
    }
    function formatPercentage(a){
        return ops.mulseq(a, 100)
    }
    MultiTable.prototype.display = function(settings){
        var body
            ;
        return $q.all(this.cubes).then(function(subcubes){
            var subtables =  subcubes.map(function(subcube){
                if (settings.countsOrPercents.value === 'percent') {
                    body = formatPercentage(stats.propTable(subcube, 1))
                } else {
                    body = subcube.count.cube
                }
                return {
                    rowLabels: subcube.labels[0]
                    ,colLabels: subcube.labels[1]
                    ,body: unpack(body)
                    ,width: subcube.labels[1].length
                }
            }, this)
            var total = stats.margin(subcubes[0]).get(0,0)
            var marginal = scratch.clone(stats.margin(subcubes[0],0))
            ops.divseq(marginal, total)


            function makeSubtableRows(matrix, k){
                return matrix.map(function(row, i){
                    return row.map(function(cell, j){
                        return {
                            value: cell
                            ,class: 'subtable-'+k+' col-'+j
                        }
                    })
                })
            }
            function makeLabels(vector,k){
                return vector.map(function(l,i){
                    return {
                        value: l
                        ,class: 'col-'+i
                    }
                })
            }
            var rowLabels = subtables[0].rowLabels.map(function(l){ return {
                    value: l
                    ,class: 'row-label'
                }
            })
            var marginrows = _.flatten(unpack(formatPercentage(marginal)), true).map(function(v){
                return {
                    value: v
                    ,class: 'marginal marginal-percentage'
                }
            })
            var colLabels = ['', 'All (%)'].map(function(l){
                return {
                    value: l
                }
            })
            var subrows = subtables.map(function(sub, k){
                colLabels.push(makeLabels(sub.colLabels))
                return makeSubtableRows(sub.body, k)
            }, this)

            var rows = _.zip(marginrows,
                _.zip.apply(this,subrows))
                .map(function(row) {return _.flatten(row, true)})
            colLabels = _.flatten(colLabels)

            var out = {
                rows: rows
                ,colLabels: colLabels
                ,spans: subtables.map(function(t){return t.width })
                ,rowLabels: rowLabels
                ,subtables: subtables
            }
            return out
        })
    }

    return{
        create: function(params){
            var result = new MultiTable()
            result.columns = params.columns
            return $q.when(params.result).then(function(them){
                result.cubes = them
                return result
            })
        }
    }
}
