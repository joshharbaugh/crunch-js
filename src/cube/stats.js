module.exports = StatsFactory

StatsFactory.$inject = [
    'lodash'
    ,'cube'
    ,'ndarray'
    ,'ndarrayOps'
    ,'ndgemm'
    ,'ndarrayScratch'
    ,'ndarrayFill'
    ,'normalDist'
    ,'show'
]

function StatsFactory(_, Cube, ndarray, ops, gemm, scratch, fill, normalDist, show){

    // the cube's dimension may indicate whether missing
    // should be included or not.
    function margin(cube, axis){
        var types = []
        var subscripts = cube._dimensions.map(function(d, i){
            types.push(d.type)
            if(d.type === 'multiresponse'){
                //punt on .concat(missing) for now
                return i === axis ? d.validSubscripts : d.countingSubscripts
            }
            return d.validSubscripts
        })
        // for off-axis categoricalarray:
        // (column sums over categories)
        // reduce the 0-dimension to [ 0 ] (just first index)
        // fill the 1-dimension with the same value (N)
        var arrayDim = types.indexOf('composite')
        var specialArrayTreatment = (arrayDim > -1 && arrayDim !== axis)
        if (specialArrayTreatment && axis === undefined){
            return new ndarray([cube.n], [1,1])
        }
        if(specialArrayTreatment){
            subscripts[arrayDim] = [0]
        }

        var shape = subscripts.map(function(d){
            return d.length
        })
        var marginShape = subscripts.map(function(d,i){
            return d.length
        },this)
        if(shape.length === 1){
            shape.push(1)
            marginShape.push(1)
        }
        indices = Cube.prod.apply(this, subscripts)

        var data = cube.count.rawData // this is what subscripts index!

        var marginTable = scratch.malloc(marginShape)
        marginTable.data = indices.map(function(d,i){
            return data.get.apply(data, d)
        })
        if(specialArrayTreatment){
            // hack: doing anything with the flat array is 2d only
            fill(marginTable, function(){
                return cube.n
            })
        }
        if(axis === undefined){
            return ndarray([ops.sum(marginTable)], [1,1])
        } else {
            var countShape = [1,1]
            var outShape = [1,1]
            countShape[axis] = marginShape[1-axis]
            outShape[axis] = shape[axis]
            var counter = scratch.malloc(countShape)
            fill(counter, function(){return 1})
            var out = scratch.malloc(outShape)
            var args = new Array(2)
            args[axis] = marginTable
            args[1-axis] = counter
            args.unshift(out)
            gemm.apply(this, args)
            // console.log(show(out))
            return out
        }
    }

    function missing(cube){
        if(cube.dimension > 2) {
            throw new Error('Can only calculate missing for a 2d slice')
        }
        var data = cube.count.rawData
        var indices = [],
            types = [],
            missing = 0
        if (cube._dimensions.length === 1) {
            indices = cube._dimensions[0].missingSubscripts
            indices.forEach(function(i){
                missing += data.get(i)
            })
            return missing
        }
        // on to 2d case
        // first gather dim0 missing by dim1 missing
        var subscripts = cube._dimensions.map(function(d, i){
            types.push(d.type)
            return d.missingSubscripts
        })
        if(_.flattenDeep(subscripts).length) {
            indices = Cube.prod.apply(this, subscripts)
        }

        if(types.indexOf('multiresponse') > -1){
            // then counting by missing
            subscripts = cube._dimensions.map(function(d, i){
                if(d.type === 'multiresponse'){
                    return i === 0 ? d.countingSubscripts : d.missingSubscripts
                }
                return []
            })
            if(subscripts.every(function(i){ return i.length })) {
                indices = indices.concat(Cube.prod.apply(this, subscripts))
            }
            // last missing by counting
            subscripts = cube._dimensions.map(function(d, i){
                if(d.type === 'multiresponse'){
                    return i === 1 ? d.countingSubscripts : d.missingSubscripts
                }
                return []
            })
            if(subscripts.every(function(i){ return i.length })){
                indices = indices.concat(Cube.prod.apply(this, subscripts))
            }
        }
        indices.forEach(function(i){
            missing += data.get.apply(data, i)
        })
        console.log(missing)
        return missing
    }

    function propTable(cube, axis, marginal, includeMissing){
        var includeMissing = includeMissing || false
        var table, tbl, marginal, total;
        if (cube.hasOwnProperty('count')){ // actual cube, not random array
            table = cube.count.cube
            total = margin(cube).get(0,0)
        } else { // we are reducing an array
            marginal = cube
            table = cube
            total = ops.sum(marginal)
        }
        var shape = table.shape.slice()
        if(shape.length === 1){
            shape.push(1)
            tbl = scratch.malloc(shape)
            fill(tbl, function(i,j){
                return table.get.apply(table,[i,j])
            })
        } else {
            tbl = scratch.clone(table)
        }
        var out = scratch.malloc(shape)

        if (marginal === undefined){
            marginal = margin(cube,axis)
        }
        if (axis === undefined){
            ops.divs(out, tbl, total)
        } else {
            fill(out, function(i,j){
                var args = axis==0 ? [i,0] : [0,j]
                return (tbl.get(i,j) / marginal.get.apply(marginal, args))
            })
        }
        return out
    }
    function diffTable(cube, axis, marginal){
        var out = propTable(cube, axis)
        var total = margin(cube).get(0,0)
        if(axis===undefined){
            var rowMargin = margin(cube,0)
            var colMargin = margin(cube,1)
            var indep = scratch.malloc(out.shape)
            var total = ops.sum(rowMargin)
            ops.divseq(rowMargin, total)
            ops.divseq(colMargin, total)
            gemm(indep, rowMargin, colMargin)
            ops.subeq(out, indep)
            return out
        }
        if (marginal === undefined){
            var marginal = margin(cube,1-axis)
        }
        ops.divseq(marginal, total)
        var swept = scratch.malloc(out.shape)
        fill(swept, function(i,j){
            var args = axis==0 ? [0,j] : [i,0]
            return marginal.get.apply(marginal, args)
        })
        ops.subeq(out, swept)
        return out
    }

    function getPvalues(rawcube, margin) {
        var strategies = {
            'row': dim0Pvalues
            ,'col': dim1Pvalues
            ,'cell': dimBothPvalues
        }
        var s =
            margin === undefined ? 'cell' : margin === 0 ? 'row' : 'col'
            ;
        return strategies[s](rawcube, margin)
    }
    // function signum(value){ return (0 < value) - (value < 0) }
    function ones(){
        return 1
    }
    function dim0Pvalues(rawcube, axis){
        var tbl = rawcube.count.cube
        var n = margin(rawcube).get(0,0)
        var shape = tbl.shape
        var colMargin = margin(rawcube, 1) //scratch.malloc([1, shape[1]])
        var rowMargin = margin(rawcube, 0) //scratch.malloc([shape[0], 1])

        var diff = scratch.zeros(shape)
        ops.divseq(colMargin, n)
        fill(diff, function(i,j){
            var cell = (tbl.get(i,j) / rowMargin.get(i,0))
            return isNaN(cell) ? 0 : cell
        })
        ops.divseq(rowMargin, n)
        var dsquared = scratch.clone(diff)
        var rightside = scratch.clone(diff)
        //ev.r <- R % * % ( diff * (1 - diff))
        ops.muleq(dsquared, diff)
        ops.subeq(rightside, dsquared)
        scratch.free(dsquared)
        var expected = scratch.zeros([1, shape[1]])
        gemm(expected, rowMargin.transpose(1,0), rightside)
        scratch.free(rightside)
        var d = scratch.malloc(rowMargin.shape)
        fill(d, function(i){
            var cell = rowMargin.get(i,0)
            return (1-2*cell) / cell
        })
        var se = scratch.zeros(shape)

        fill(se, function(i,j){
            var obs = diff.get(i,j)
            var v = d.get(i,0) * obs * (1 - obs) + expected.get(0,j)
            return Math.sqrt(v/n)
        })

        scratch.free(expected)
        scratch.free(d)
        var Z = scratch.malloc(shape)
        fill(Z, function(i,j){
            return colMargin.get(0,j)
        })
        ops.mulseq(Z, -1)
        ops.addeq(Z, diff)
        ops.diveq(Z, se)
        // (p <- 2 * pnorm ( abs ( Z.r ) , lower.tail = FALSE ))
        var sign = scratch.zeros(shape)
        function sgnZ(i,j){
            var value = Z.get(i,j)
            return (value > 0) - (value < 0)
        }
        fill(sign, sgnZ)
        ops.abseq(Z)
        // console.log(show(Z))
        var pnorm = normalDist(0,1).cdf
        var p = scratch.zeros(shape)
        fill(p, function(i,j){
            return 2 * (1-pnorm(Z.get(i,j)))
        })
        // return *signed* pvalues: consumers should use abs
        ops.muleq(p, sign)
        return p
    }
    function dim1Pvalues(rawcube, axis){
        var tbl = rawcube.count.cube
        var n = margin(rawcube).get(0,0)
        var shape = tbl.shape
        var colMargin = margin(rawcube, 1) //scratch.malloc([1, shape[1]])
        var rowMargin = margin(rawcube, 0) //scratch.malloc([shape[0], 1])
        var diff = scratch.zeros(shape)
        ops.divseq(rowMargin, n)
        fill(diff, function(i,j){
            var cell = (tbl.get(i,j) / colMargin.get(0,j))
            return isNaN(cell) ? 0 : cell
        })
        ops.divseq(colMargin, n)
        var dsquared = scratch.clone(diff)
        var rightside = scratch.clone(diff)
        //ev.r <- R % * % ( diff * (1 - diff))
        ops.muleq(dsquared, diff)
        ops.subeq(rightside, dsquared)
        scratch.free(dsquared)
        var expected = scratch.zeros([shape[0], 1])

        gemm(expected, rightside, colMargin.transpose(1,0))
        scratch.free(rightside)
        var d = scratch.malloc(colMargin.shape)
        fill(d, function(i,j){
            var cell = colMargin.get(0,j)
            return (1-2*cell) / cell
        })
        var se = scratch.zeros(shape)
        fill(se, function(i,j){
            var obs = diff.get(i,j)
            var v = d.get(0,j) * obs * (1 - obs) + expected.get(i,0)
            return Math.sqrt(v/n)
        })
        scratch.free(expected)
        scratch.free(d)
        var Z = scratch.malloc(shape)
        fill(Z, function(i,j){
            return rowMargin.get(i,0)
        })

        ops.mulseq(Z, -1)
        ops.addeq(Z, diff)
        ops.diveq(Z, se)
        // (p <- 2 * pnorm ( abs ( Z.r ) , lower.tail = FALSE ))
        var sign = scratch.malloc(shape)
        function sgnZ(i,j){
            var value = Z.get(i,j)
            return (value > 0) - (value < 0)
        }
        fill(sign, sgnZ)
        ops.abseq(Z)
        var pnorm = normalDist(0,1).cdf
        var p = scratch.malloc(shape)
        fill(p, function(i,j){
            return 2 * (1-pnorm(Z.get(i,j)))
        })
        // return *signed* pvalues: consumers should use abs
        ops.muleq(p, sign)
        return p
    }
    function dimBothPvalues(rawcube, axis){
        var tbl = rawcube.count.cube
        var n = ops.sum(tbl) //argh
        var shape = tbl.shape
        var onesCt = scratch.malloc([1, shape[0]])
        var onesR = scratch.malloc([shape[1], 1])
        var colMargin = scratch.malloc([1, shape[1]])
        var rowMargin = scratch.malloc([shape[0], 1])
        function ones(){
            return 1
        }
        fill(onesR, ones)
        fill(onesCt, ones)

        gemm(colMargin, onesCt, tbl)
        gemm(rowMargin, tbl, onesR)
        ops.divseq(tbl, n) // cell percentages
        ops.divseq(colMargin, n)
        ops.divseq(rowMargin, n)
        var expected = scratch.zeros(shape)
        gemm(expected, rowMargin, colMargin)
        var Z = scratch.clone(expected) // alloc here, use later
        var rightside = scratch.clone(expected)
        ops.mulseq(rightside, -1)
        ops.addseq(rightside, 1)
        ops.muleq(expected, rightside)
        scratch.free(rightside)

        var se = scratch.zeros(shape)
        fill(se, function(i,j){
            var obs = tbl.get(i,j)
            var v = obs * (1 - obs) + expected.get(i,j)
            return Math.sqrt(v/n)
        })
        scratch.free(expected)

        ops.mulseq(Z, -1)
        ops.addeq(Z, tbl)
        ops.diveq(Z, se)
        // (p <- 2 * pnorm ( abs ( Z.r ) , lower.tail = FALSE ))
        ops.abseq(Z)
        var pnorm = normalDist(0,1).cdf
        var p = scratch.zeros(shape)
        fill(p, function(i,j){
            return 2 * (1-pnorm(Z.get(i,j)))
        })
        // console.log("p",show(p))
        return p
    }
    function filterByMarginThreshold(cube, cutoff){
        // gather subscripts from each margin > cutoff
        var orig = cube.count.cube // =valid
        var rowMargin = margin(cube, 0)
        var colMargin = margin(cube, 1)
        ops.gtseq(rowMargin, cutoff)
        ops.gtseq(colMargin, cutoff)
        var subscripts = [
            Array.prototype.slice.call(rowMargin.data)
            ,Array.prototype.slice.call(colMargin.data)
        ]
        function getLength(d){ return d.length }
        var initShape = subscripts.map(getLength)
        var filtered = subscripts.map(function(s){
            var filteredSubscripts = []
            s.filter(function(d,i){
                if(d > 0){
                    filteredSubscripts.push(i)
                    return true
                }
                return false
            }, this)
            return filteredSubscripts
        }, this)
        return filtered
    }

    function getSortedSubscripts(vector){
        var i = j = vector.length
        var temp = []
        while (i--) {
            temp[i] = { k: i, v: vector[i] };
        }
        function comparator(a, b) {
            return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
        }
        temp.sort(comparator)
        return temp.map(function(d){ return d.k })
    }

    return {
        getPvalues: getPvalues
        ,margin: margin
        ,missing: missing
        ,propTable: propTable
        ,diffTable: diffTable
        ,filterByMarginThreshold: filterByMarginThreshold
        ,getSortedSubscripts: getSortedSubscripts
    }
}
 /*
require("ndgemm")(c, a, b[, alpha, beta])
Computes a generalized matrix multiplication. This sets:

c = alpha * a * b + beta * c
*/
