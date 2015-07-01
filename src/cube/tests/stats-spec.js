'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , fixtures = require('./fixtures')
    , show = require('ndarray-show')
    , mrMissing = require('./cube-mr-x-mr')
    , mrMissingUnivariate = require('./cube-mr')
    , arrayWithMissingCat = require('./cube-array-mis')
    ;

describe('cube stats', function(){
    function buildModule() {
        var mod = mainMod()
            ;
        mod.factory('iResourceVariable', function($q) {
            return function(resourceThis){
                var result = $q.when({id: resourceThis.variableId})
                return result
            }
        })
        angular.mock.module(mod.name)
    }

    function createDeps() {
        inject(function($rootScope, ndarrayUnpack) {
            scope = $rootScope.$new()
            unpack = ndarrayUnpack
        })
    }
    var sut
        ,scope
        ,rawcube
        ,unpack
    ;
    beforeEach(buildModule)
    beforeEach(createDeps)
    describe('missing values, two multiple response vars', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(mrMissing.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('mr by mr', function(){
            sut.missing(rawcube).should.equal(542343)
        })
    })
    describe('missing values, one multiple response var', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(mrMissingUnivariate.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('mr by mr', function(){
            sut.missing(rawcube).should.equal(538211)
        })
    })
    describe('missing values, array', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(arrayWithMissingCat.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('mr by mr', function(){
            sut.missing(rawcube).should.equal(1)
        })
    })
    describe('margins and percentaging', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.statsTestCube.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('categorical margins', function(){
            var row = sut.margin(rawcube, 0)
            unpack(row).should.eql([[521.0], [479.0]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[
                25.0, 135.0, 331.0, 160.0, 144.0, 205.0
            ]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[1000.0]])

            var percentageMargin = unpack(sut.propTable(sut.margin(rawcube,0)))
            percentageMargin.should.eql([[0.521],[0.479]])
            var percentageMargin = unpack(sut.propTable(sut.margin(rawcube,1)))
            percentageMargin.should.eql([[0.025,0.135,0.331,0.16,0.144,0.205]])
            sut.missing(rawcube).should.equal(0)
        })
        it('categorical percentaging', function(){
            var row = unpack(sut.propTable(rawcube, 0))
            row.should.eql([
                [0.0345489443378119,0.1727447216890595,0.3550863723608445,
                0.15547024952015356,0.1362763915547025,0.14587332053742802],
                [0.014613778705636743,0.09394572025052192,0.3048016701461378,
                    0.1649269311064718,0.1524008350730689,0.26931106471816285]
            ])
            var col = unpack(sut.propTable(rawcube, 1))
            col.should.eql([
                [0.72,0.6666666666666666,0.5589123867069486,
                0.50625,0.4930555555555556,0.37073170731707317],
                [0.28,0.3333333333333333,0.44108761329305135,
                0.49375,0.5069444444444444,0.6292682926829268]
            ])
            var cell = unpack(sut.propTable(rawcube))
            cell.should.eql( [
                [0.018,0.09,0.185,0.081,0.071,0.076],
                [0.007,0.045,0.146,0.079,0.073,0.129]
            ])
        })
    })
    describe('binned univaraite', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.numericEnum.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            row.should.eql([[ 1 ], [ 0 ], [ 0 ], [ 0 ], [ 1 ]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[2]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[2]])
        })
        it('percentaging', function(){
            var row = unpack(sut.propTable(rawcube, 0))
            row.should.eql([[1], [NaN], [NaN], [NaN], [1]]) // from div/0 on margin {?:-1}
            var col = unpack(sut.propTable(rawcube, 1))
            col.should.eql([[0.5],[0],[0],[0],[0.5]])
            var cell = unpack(sut.propTable(rawcube))
            cell.should.eql([[0.5],[0],[0],[0],[0.5]])
        })
    })
    describe('multiple response', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.multipleResponseCategorical.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            row.should.eql([[1],[0],[0]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[2,2]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[4]])
        })
        it('percentaging', function(){
            var row = unpack(sut.propTable(rawcube, 0))
            var col = unpack(sut.propTable(rawcube, 1))
            var cell = unpack(sut.propTable(rawcube))
            col.should.eql([[0,0.5],[0,0],[0,0]])
            row.should.eql([[0,1],[NaN,NaN],[NaN,NaN]]) // from div/0 on margin
            cell.should.eql([[0,0.25],[0,0],[0,0]])
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(0)
        })
    })
    describe('categorical array', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.categoricalArrayCube.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            row.should.eql([[4],[4],[4]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[4,4]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[4]])
        })
        it('percentaging', function(){ // not the best test case
            var row = unpack(sut.propTable(rawcube, 0))
            row.should.eql([[0.25,0.75],[0.75,0.25],[0.75,0.25]])
            var col = unpack(sut.propTable(rawcube, 1))
            col.should.eql([[0.25,0.75],[0.75,0.25],[0.75,0.25]])
            var cell = unpack(sut.propTable(rawcube))
            cell.should.eql([[0.25,0.75],[0.75,0.25],[0.75,0.25]])
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(0)
        })
    })
    describe('univariate multiple response', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.multipleResponse1d.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            row.should.eql([ [ 1 ], [ 0 ], [ 0 ]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[4]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[4]])
        })
        it('percentaging', function(){ // not the best test case
            var row = unpack(sut.propTable(rawcube, 0))
            row.should.eql([ [ 1 ], [ NaN ], [ NaN ]])
            var col = unpack(sut.propTable(rawcube, 1))
            col.should.eql([[0.25],[0],[0]])
            var cell = unpack(sut.propTable(rawcube))
            cell.should.eql([[0.25],[0],[0]])
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(0)
        })
    })
    describe('another array', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.arrayWithMissing.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            row.should.eql([[ 3 ], [ 3 ]])
            var col = unpack(sut.margin(rawcube, 1))
            col.should.eql([[ 3,3 ]])
            var total = unpack(sut.margin(rawcube))
            total.should.eql([[3]])
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(1)
        })
    })
    describe('datetime univariate -- some dataset "wave" var', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.datetimeUnivariate.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            var col = unpack(sut.margin(rawcube, 1))
            var total = unpack(sut.margin(rawcube))
            row.should.eql([
                [3999.999999999988],[999.9999999999903],[4001.000000000035],
                [5026.000000000041],[5008.000000000002],[5007.0000000000355],
                [3114.000000000037],[9071.999999999905],[8627.999999999767],
                [9315.000000000004],[9252.000000000022],[8582.999999999944],
                [9272.000000000151],[9316.00000000006],[9251.999999999834],
                [9295.000000000007],[9192.000000000038],[10281.999999999873],
                [10085.000000000062],[10222.999999999964],[10181.054252941636],
                [11140.000000000182],[12115.999999999913],[20084.99999999888],
                [14079.99999999999],[15066.0000000006],[20024.99999999929],
                [16122.999999999842],[16132.000000000617],[14027.00000000044],
                [10039.000000000053],[10999.99999999934],[1000.0000000000026],
                [24999.999999999065],[40999.99999999939],[33000.00000000064],
                [15026.000000000127],[22000.000000000076],[26000.00000000266],
                [24999.999999999094],[24999.999999999913],[13579.999999999825],
                [1500.00000000001],[14999.999999998794]] )
            col.should.eql([[562043.0542529402]])
            total.should.eql([[562043.0542529402]])
        })
        it('percentaging', function(){
            var row = unpack(sut.propTable(rawcube, 0))
            var col = unpack(sut.propTable(rawcube, 1))
            var cell = unpack(sut.propTable(rawcube))
            row.should.eql([
                [1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],
                [1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],
                [1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1]] )
            var ans = [
                [0.0071168925044661074],[0.001779223126116515],[0.007118671727592308],
                [0.008942375431861764],[0.008910349415591596],[0.00890857019246554],
                [0.005540500814726947],[0.01614111220012901],[0.015351137132133026],
                [0.016573463419775503],[0.016461372362830195],[0.015271072091458095],
                [0.016496956825352755],[0.016575242642901722],[0.016461372362829862],
                [0.01653787895725318],[0.016354618975263233],[0.018293972182729958],
                [0.017943465226885336],[0.018188998018289243],[0.01811436717508083],
                [0.019820545624938492],[0.021557067396027748],[0.03573569648804856],
                [0.025051461615720756],[0.026805775618072743],[0.03562894310048229],
                [0.028686414462376568],[0.028702427470512992],[0.02495716279003738],
                [0.01786162096308396],[0.01957145438728068],[0.0017792231261165368],
                [0.04448057815291164],[0.07294814817077673],[0.0587143631618467],
                [0.026734606693027237],[0.03914290877456384],[0.04625980127903457],
                [0.04448057815291169],[0.04448057815291315],[0.024161850052662196],
                [0.002668834689174816],[0.026688346891745835]]
            col.should.eql(ans)
            cell.should.eql(ans)
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(0)
        })
    })
    describe('datetime x categorical', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.datetimeCat.value)
                .then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('margins', function(){
            var row = unpack(sut.margin(rawcube, 0))
            var col = unpack(sut.margin(rawcube, 1))
            var total = unpack(sut.margin(rawcube))
            row.should.eql([
                [4000.0000000000364],[999.999999999998],[4000.9999999999627],
                [5025.999999999964],[5007.9999999999745],[5007.00000000002],
                [3113.999999999967],[9071.999999999844],[8628.000000000171],
                [9315.000000000118],[9252.00000000007],[8583.000000000025],
                [9271.999999999887],[9315.99999999992],[9252.000000000065],
                [9295.000000000151],[9191.999999999993],[10282.00000000004],
                [10084.999999999904],[10222.999999999935],[10181.054252941987],
                [11140.00000000007],[12116.000000000284],[20084.999999999658],
                [14079.99999999969],[15065.999999999836],[20024.999999999854],
                [16122.999999999874],[16131.999999999545],[14027.000000000082],
                [10039.000000000093],[10999.999999999894],[999.9999999999991],
                [25000.000000001688],[40999.99999999982],[33000.00000000032],
                [15026.000000000011],[21999.999999999814],[26000.000000000025],
                [24999.999999999465],[24999.999999999556],[13580.000000000031],
                [1499.9999999999945],[15000.00000000043]
            ])
            col.should.eql([[287074.96738489845, 274968.08686804364]])
            total.should.eql([[562043.054252942]])
        })
        it('percentaging', function(){
            var row = unpack(sut.propTable(rawcube, 0))
            var col = unpack(sut.propTable(rawcube, 1))
            var cell = unpack(sut.propTable(rawcube))
            row[0].should.eql([0.49595874700730885,0.5040412529926911])
            col[0].should.eql([0.006910511933871991,0.007332360038342683])
            cell[0].should.eql([0.0035296850891007505,0.0035872074153654203])
        })
        it('missing', function(){
            sut.missing(rawcube).should.equal(0)
        })
    })
    describe('differences from margins', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.admitXgender.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('should work for row/col/cell', function(){
            var out = unpack(sut.diffTable(rawcube,0))
            out.should.eql([
                [0.08756982115823508,-0.08756982115823503],
                [-0.05496583176797731,0.05496583176797726]])
            var out = unpack(sut.diffTable(rawcube,1))
            out.should.eql([
                [0.056869512073051076,-0.08313612477046012],
                [-0.05686951207305113,0.08313612477046006]])
            var out = unpack(sut.diffTable(rawcube))
            out.should.eql([
                [0.03376943213097125,-0.03376943213097128],
                [-0.03376943213097128,0.03376943213097128]])
        })
    })
    describe('p values for row and columns', function(){
        beforeEach(function(){
            inject(function(cube, stats, show){
                cube.fromCrCube(fixtures.statsTestCube.value).then(function(it){
                    rawcube = it
                    sut = stats
                })
            })
            scope.$digest()
        })
        it('should make row-relative pvalues', function(){
            var out = unpack(sut.getPvalues(rawcube, 0))
            out.should.eql(
                [[0.039856934322208826,0.0002102020772511981,0.09040671378952103,
                -0.6839173395850902,-0.4688798594563992,-0.000001286940859657193],
                [-0.039856934322208826,-0.0002102020772511981,-0.09040671378952059,
                0.6839173395850908,0.46887985945639743,0.000001286940859657193]]
            )
        })
        it('should do it for column margins', function(){
            var out = unpack(sut.getPvalues(rawcube, 1))
            out.should.eql(
                [[0.02517234950588154,0.00012512580860102318,0.08747258764091392,
                -0.6827938119048738,-0.4670515105710662,-6.483433470094724e-7],
                [-0.02517234950588154,-0.00012512580860102318,-0.08747258764091392,
                0.6827938119048738,0.4670515105710662,6.483433470094724e-7]])
        })
        it.skip('should do it for cell percentages', function(){
            var out = unpack(sut.getPvalues(rawcube, undefined))
            out.should.eql([[0.3679244119521772,0.10515594786192306,
                0.46385589231963187,0.8476251509412416,
                0.729435101189718,0.016681167114846573],
                [0.25099766339570695,0.05319281231819595,
                0.4347304395032887,0.8438341205266566,
                0.7260451461165482,0.02975816673809084]])
        })
    })
})
