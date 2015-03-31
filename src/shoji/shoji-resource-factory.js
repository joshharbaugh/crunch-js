'use strict';
/** @module ShojiResourceService
 * @memberof shoji
 */
module.exports = ShojiResourceService

ShojiResourceService.$inject = [
    '$q'
    , 'lodash'
    , 'shojiDataStrategy'
    , 'shojiParser'
    , 'ShojiCollection'
    , '$log'
]

function ShojiResourceService($q, _, DataStrategy, parse, ShojiCollection, $log) {
    var noop = angular.noop
        ,errorPassthru = function(err) {
            return $q.reject(err)
        }
        ,passthru = function(arg) {
            return arg
        }
        ;

    function buildPostSyncFilter(target, opts) {
        var self = target;
        return function postSyncFilter(response) {
            var config = response.config || {};
            if (!_.isUndefined(config.sync) && !! !config
                .sync || !opts.sync) {
                return response
            }
            var meth = config.method;
            if (meth === 'POST' && response.headers &&
                response.headers('Location')) {
                var newUri = response.headers('Location');
                return $q.when(self.chain(newUri))
            }
            if (meth === 'PUT' || meth === 'PATCH') {
                $log.debug(
                    'shoji-resource-factory syncing to server', self.self);
                return self.get()
            }
            return response
        };
        return _.bind(postSyncFilter, target)
    }

    function buildDefaultFilters(target) {
        var self = target;
        var filters = [];
        if (self.sync) {
            filters.push(_.bind(self.sync, self))
        }
        filters.push(buildPostSyncFilter(target, {
            sync: !! self.sync
        }));

        function mapToResource(response) {
            if (response instanceof Resource || !!
                response.self) {
                return response
            }
            return self
        }
        filters.push(_.bind(mapToResource, self));
        return filters
    }

    /** @class Resource
     * @classdesc A Shoji resource
     */
    function Resource(url) {
        if (!(this instanceof Resource)) {
            return new Resource()
        }

        this.self = url
        this.clientId = _.uniqueId('shoji_')
        this.reset = noop
        this.timestamp = new Date()
        this.syncedOn = false
        this.element = 'unknown'
        this.specification = null

        var filters = buildDefaultFilters(this)
        this.dataStrategy = new DataStrategy(this.self)
        this.dataStrategy.initialize({
            sync: true
            , responseFilters: filters
        })
        this.get = this.dataStrategy.get
        this.save = this.dataStrategy.post
        this.update = this.dataStrategy.put
        this.patch = this.dataStrategy.patch
        this['delete'] = this.dataStrategy['delete']
    }

    Resource.prototype.accept = function(visitor) {
        visitor.visitResource(this)
    };
    /**
     * @method chain
     * @desc Factory method for traveral to another _url_
     *
     * @return {Resource} constructor
     * @instance
     * @memberOf Resource
     * @example
     * var r1 = myShojiInstance.chain('/a/different/url')
     */
    Resource.prototype.chain = function(chained) {
        var resource = new Resource(chained)
            ;

        if (!chained) {
            throw new Error('url cannot be empty')
        }

        resource = new Resource(chained)
        resource.allowAll()

        return resource
    }

    Resource.prototype.allowAll = function() {
        this.dataStrategy.allowAll()
    }

    Resource.prototype.attach = function(path, as, cfg) {
        var self = this;;
        as = as || path;;
        cfg = cfg || {};
        if (!this.urls || !this.urls[path]) {
            throw new Error('Path `' + path +
                '` not found from `' + this.self + '`')
        }
        if (this[as]) {
            throw new Error('Property ' + '`' + as +
                '` is already attached to ' + '`' + this.self +
                '`.')
        }
        return this.urls[path].map(cfg, function(res) {
            self[as] = res;
            return self
        })
    };

    Resource.prototype.collect = shojiResourceFactory.collect

    /** @method reduce
     * Asynchronously reduce / transform the resource.
     * Each handler received an `accumulator` as its first argument
     * and the result of the previous handler as the second argument.
     * @param {Object} cfg see angular $http config
     * @param {Any} accumulator the accumulator object passed to each handler
     * as the first argument
     * @param {Array} handlers An array of callbacks receiving the `accumulator` as the first
     * argument and the result of the previous handler as its second argument.
     * @return {Promise}
     * @instance
     * @memberOf Resource
     * @example
     * function extractName(acc, res) {
     *  acc.name = res.name
     *  return 'bling'
     * }
     * function somethingElse(acc, res) {
     *  //res is 'bling'
     *  acc.sound = res
     *  //this is the last handler so this will be the resolution
     *  return acc
     * }
     * var accumulator = {}
     * var myShojiInstance.reduce(acc, [
     *  extractName
     *  ,somethingElse
     * ]) //eventually resolves the accumulator
     */
    Resource.prototype.reduce = function(cfg, accumulator, handlers) {
        var resource = this;
        if (_.isArray(accumulator)) {
            handlers = accumulator;
            accumulator = cfg;
            cfg = {}
        } else if (_.isArray(cfg)) {
            handlers = cfg;
            accumulator = resource;
            cfg = {}
        }

        function passthru(acc) {
            return acc
        };
        handlers = handlers || [passthru];
        var outer = $q.defer();
        handlers = _.map(handlers, function(h) {
            return _.partial(_.bind(h, accumulator), accumulator)
        });

        try {
            var inner = $q.when(handlers[0](resource));

            _.each(_.rest(handlers), function(h) {
                inner = inner.then(h)
            });

            inner.then(outer.resolve, outer.reject)
        } catch (err) {
            $log.error(err);
            $q.reject(err).then(outer.resolve, outer.reject)
        }

        return outer.promise
    };

    /** @method map
     * Promises a mapped shoji resource, using the `dataStrategy`
     * for hydration.
     * @instance
     * @memberOf Resource
     * @param {Object} cfg (see angular's $http config options)
     * @param {Function} [success] callback
     * @param {Function} [error] callback
     * @return {Promise}
     */
    Resource.prototype.map = function(cfg, success, error) {
        var resource = this;
        if (_.isFunction(cfg)) {
            error = success;
            success = cfg;
            cfg = {}
        };
        cfg = cfg || {};;
        success = success || passthru;
        error = error || errorPassthru;
        var outer = $q.defer();
        var resolve = outer.resolve;
        outer.resolve = function(obj) {
            return resolve.apply(resource, [obj])
        };

        function disableLoad(res) {
            try {
                var col = res.urls || res.index;
                if (!col || !col.disableLoad) {
                    return
                }
                return col.disableLoad()
            } catch (err) {
                $log.error(err);
                throw err
            }
        }
        try {
            resource.get(cfg)
                .then(function(res) {
                    try {
                        disableLoad(res);
                        var val = success(res);
                        if (_.isUndefined(val)) {
                            var msg =
                                '`Resource.map` must return a value from all nested promises.\n' +
                                'This function is failing to do so: ' +
                                success.toString();
                            throw new Error(msg)
                        }
                        if (val && val.then) {
                            return val.then(outer.resolve, outer.reject)
                        }
                        return $q.when(val)
                            .then(outer.resolve, outer.reject)
                    } catch (err) {
                        $log.error(err);
                        return $q.reject(err)
                            .then(outer.resolve, outer.reject)
                    }
                },function(err){
                    return $q.reject(err)
                        .then(outer.resolve,outer.reject)
                })
        } catch (err) {
            $q.reject(err)
                .then(outer.resolve, outer.reject)
        }
        return outer.promise
    };

    Resource.prototype.parse = function(data) {
        this.reset()
        parse(data, this)
        this.setupNextReset({
            data: data
        })
        this._memento = data;
        return this
    };
    Resource.prototype.setupNextReset = function(response) {
        var target = this;
        this.reset = function executeReset() {
            var data = response.data
                ,body = data.body || {};;
            delete target.specification;
            switch (target.element) {
                case 'shoji:entity':
                    for (var k in body) {
                        delete target[k]
                    }
                    delete target.urls;
                    break;
                case 'shoji:catalog':
                    delete target.index;
                    delete target.views;
                    break;
                case 'shoji:value':
                    delete target.value
                    break;
                case 'shoji:view':
                    delete target.value
                    break;
            }
            return target
        };
        return target
    }

    Resource.prototype.getMemento = function() {
        return this._memento
    }

    Resource.prototype.sync = function(response) {
        var self = this;
        if (response && response.config && response.config
            .method.toUpperCase() === 'GET') {
            this.syncedOn = new Date();
            self.parse(response.data, self)
        }
        return response
    }

    /** @class shojiResourceFactory
     * @classdesc Responsible for getting {Resource} constructors, scoped to the
     * @memberof ShojiResourceService
     * passed in `url`
     * @param {String} url The uri of the resource
     * @return {Resource} Resource constructor
     */
    function shojiResourceFactory(url) {
        var resource
            ;

        if (!url) {
            throw new Error('url is required for a resource')
        }

        resource = new Resource(url)
        resource.allowAll()

        return resource
    }

    shojiResourceFactory.collect = function(responses) {
        var shojis = _.map(responses, function(r) {
            return shojiResourceFactory(r.self).parse(r)
        })

        return ShojiCollection.collect(shojis)
    }

    return shojiResourceFactory
}
