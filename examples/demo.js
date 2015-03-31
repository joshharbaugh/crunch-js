
var app = angular.module('crVariablesDemo', [
    'crunchJS',
    'crunchJSTemplates'
])

app.config(function($httpProvider) {
    'use strict'

    $httpProvider.defaults.withCredentials = true
})

app.factory('signin', function($http, Shoji) {
    'use strict'

    return function(email, password) {
        return Shoji('***REMOVED***').map().then(function(api) {
            return $http({
                url : api.urls.login.self,
                method: 'POST',
                data : {
                    email : email,
                    password : password
                }
            })
        })
    }
})

app.controller('AppCtrl', function($scope, signin, currentDataset,
    iFetchHierarchicalVariables,
    HierarchicalVariablesList) {
    'use strict'

    signin('***REMOVED***', '***REMOVED***').then(function() {
        currentDataset.set('***REMOVED***/')
        currentDataset.fetch().then(function(ds) {
            iFetchHierarchicalVariables({ datasetId : ds.self }).then(function(hierarchicalVariables) {
                $scope.hierarchicalVariablesList = HierarchicalVariablesList.create({
                    hierarchicalVariables : hierarchicalVariables
                })
            })
        })
    })

})

