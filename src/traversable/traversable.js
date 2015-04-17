'use strict';

module.exports = TraversableFactory

TraversableFactory.$inject = [
]

function TraversableFactory(_){
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function Traversable(cfg) {
        cfg = (cfg || {});
        if(!cfg.pageLength) {
            throw new Error('page length is required. use `1` to apply one-at-a time.')
        }
        this._cfg = cfg
        this.incrementable = false
        this.decrementable = false
        //the max count of items
        this.max = (cfg.max || 0)
        //the number of items to show at a time
        this.pageLength = (cfg.pageLength)
        //zero-based current page number
        this.page = 0
        //the number of pages
        this.pages = 0
        //tracks where in the collection we are
        this.startFrom = 0
        //determine what portion of the 'page' should be in the next
        //page.
        if(this.pageLength === 1) {
            this.pctOverlap = 1
        } else {
            //this leaves the last half of the previous page on the next page
            this.pctOverlap = (cfg.pctOverlap || .5);
        }
    }
    Traversable.prototype._updateTraversal = function(){
        this.decrementable = (this.page > 0)
        this.incrementable = this.pages > 1 && ((this.page < (this.pages - 1)))
        this.startFrom = (this.page * Math.floor(this.pageLength * this.pctOverlap))
    }

    /**
     * @method _calcPages
     * @desc overlap the pages to include part of the previous page
     * using `pctOverlap`
     */
    Traversable.prototype._calcPages = function(max, pageLength, overlap) {
        var targetOverlap = max <= pageLength ? 1 : overlap
        var batch = Math.floor(pageLength * targetOverlap)
        var pages = Math.ceil(max / batch)
        return pages
    }
    /**
     * @method inc - increment page
     *
     * */
    Traversable.prototype.inc = function() {
        if(this.page === (this.pages -1)) {
            //do nothing
            return
        }
        this.page = (this.page + 1)
        this._updateTraversal()
    }
    /**
     * @method dec - decrement page
     *
     * */
    Traversable.prototype.dec = function(){
        if(this.page < 1) {
            //do nothing
            return
        }
        this.page = (this.page - 1)
        this._updateTraversal()
    }

    /**
     * @method openAt  - zero-based page-index; effectively updating traversal state
     */
    Traversable.prototype.openAt = function(page) {
        page = parseInt(page,10)
        if(page > this.pages || page < 0) {
            page = 0
        }
        this.page = page
        this._updateTraversal()
    }
    /**
     * @method itemCountAt - how many items are at `pageNumber`
     * @instance
     * @memberof Traversable
     * @param Number pageNumber zero-based page number to inspect
     * @return Number the number of items at `pageNumber`
     * */
    Traversable.prototype.itemCountAt = function(pageNumber) {
        pageNumber = (parseInt(pageNumber,10) || 0)
        if(pageNumber === this.pages -1) {
            return (this.max - (pageNumber) * this.pageLength)
        }
        return Math.min(this.pageLength,this.max)
    }
    /**
     * @method interpret
     * @desc scans `traversable.listProperty` and derives a paging interface
     **/
    Traversable.prototype.interpret = function(traversable, listProperty) {
        var list = traversable[listProperty]
        if(!list) {
            throw new Error('property ' + listProperty + ' not found on traversable')
        }
        //maximum count of items
        this.max = (this.max || list.length)
        //is there only one page possible?
        this.single = list.length === 1
        //how many pages are there?
        this.pages = this._calcPages(this.max, this.pageLength, this.pctOverlap)
        //start on first page (zero-based)
        this.page = 0

        this._updateTraversal()
        return this
    }

    /**
     * @method retraversable - when collection changes, update with this function to get new stats while
     * appempting to preserve current settings. If current state conflicts with new collection bounds,
     * reset back to zero
     */
    Traversable.prototype.retraversable = function() {
        var args = [].slice.call(arguments)
        //reset to original cfg
        this.max = (this._cfg.max || 0)

        //store current settings
        var current = {
            page: this.page
            ,startFrom: this.startFrom
        }
        //recalc
        Traversable.prototype.interpret.apply(this,args)

        //restore settings
        if(this.pages - 1 >= current.page) {
            this.page = current.page
            this.startFrom = current.startFrom
            this._updateTraversal()
        }
        return this

    }
    /**
     * @method augment
     * @desc augments `traversable` instance (not its prototype!) with methods and properties
     * related to traversal
     * @note that this copies over references to the source object
     **/
    Traversable.prototype.augment = function(traversable, listProperty) {
        var args = [].slice.call(arguments)
        var self = Traversable.prototype.interpret.apply(this,args)

        var funcs = []
        //this augments behavior from this instance to the thing you want traversable
        for(var k in self) {
            var prop  = self[k]
            var funcy = isFunction(self[k])
            if(funcy) {
                prop = prop.bind(traversable)
            }
            Object.defineProperty(traversable,k,{
                value: prop
                ,writable: true
                ,configurable: false
                ,enumerable: true
            })

        }

        return traversable
    }

    return Traversable
}
