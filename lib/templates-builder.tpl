module.exports = buildModule()

function buildModule() {
    var templateModules = {}
        , angular = require("angular")
        , mod = angular.module("crunchJSTemplates", [])
        ;

    mod.run(["$templateCache", function($templateCache) {
    <% tpls.forEach(function(tpl) { %>
        $templateCache.put("<%= tpl.name %>", require("../<%= tpl.path %>"))
    <% }) %>
    }])

    return mod
}