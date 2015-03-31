;
module.exports = (function() {
    'use strict';

    function Cache() {
        var contents = {};
        this.setItem = function(key, value) {
            contents[key] = value;
            return value
        };
        this.getItem = function(key) {
            return contents[key]
        };
        this.removeItem = function(key) {
            var data = contents[key];
            delete contents[key];
            return data
        }
    }

    function CacheableDataStrategy($delegate, $q, $log, _) {
        var cache;
        cache = cache || new Cache();

        function isCacheable(cfg) {
            var cacheable = cfg.method === 'GET' && _.isUndefined(
                cfg.params) && (_.isUndefined(cfg.cache) || !!
                cfg.cache);
            return cacheable
        }

        function Decorated(url) {
            var inner = new $delegate(url);
            var request = inner.makeRequest;

            function wrappedRequest(cfg) {
                $log.debug(
                    'shoji-cacheable-data-strategy wrapping request:' +
                    cfg.url, cfg.method);
                var cacheable = isCacheable(cfg);
                if (cacheable) {
                    var result = cache.getItem(cfg.url);
                    if (result) {
                        $log.debug(
                            'shoji-cacheable-data-strategy resolving from cache:' +
                            cfg.url, result);
                        var deferred = $q.defer();
                        deferred.resolve(result);
                        return deferred.promise
                    }
                } else {
                    var item = cache.removeItem(cfg.url);
                    if (item) {
                        $log.debug(
                            'shoji-cacheable-data-strategy removed from cache:' +
                            cfg.url, item)
                    }
                }
                return request(cfg)
                    .then(function(response) {
                        if (cacheable) {
                            $log.debug(
                                'shoji-cacheable-data-strategy caching:' +
                                cfg.url, response);
                            cache.setItem(cfg.url, response)
                        } else {
                            $log.debug(
                                'shoji-cacheable-data-strategy caching skipped:' +
                                cfg.url, response)
                        }
                        return response
                    })
            }
            inner.makeRequest = wrappedRequest;
            return inner
        }
        Decorated.reset = function() {
            cache = cache || new Cache()
        };
        return Decorated
    }
    CacheableDataStrategy.$inject = ['$delegate', '$q', '$log', 'lodash'
    ];
    return {
        $get: CacheableDataStrategy
    }
})
    .call(this);