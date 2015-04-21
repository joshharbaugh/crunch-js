var app = angular.module('crosstabsViewer', [
    'crunchJS'
])


app.config(function($httpProvider) {
    'use strict'
    $httpProvider.defaults.withCredentials = true
})

/**
 * signin service sends a POST request to the authentication endpoint. This is required
 * in order to consume other services provided by crunch API
 */
app.factory('signin', function($http, Shoji) {
    'use strict'

    return function(email, password) {
        return Shoji(window.secrets.signinUrl).map().then(function(api) {
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

/**
 * Setting a current dataset allows other services to reuse the same dataset
 * entity in memory thus avoiding to make more HTTP request to obtain the same resource.
 *
 * iFetchHierarchicalVariables depends on this service
 */
app.factory('setCurrentDataset', function(currentDataset) {
    'use strict'

    return function(dsId) {
        currentDataset.set(dsId)
        return currentDataset.fetch()
    }
})

/**
 * This returns an instance of HierarchicalVariables. This class provides methods
 * to query and manipulate a variables catalog.
 */
app.factory('fetchDatasetVariables', function(iFetchHierarchicalVariables) {
    'use strict'

    return function(dsId) {
        return iFetchHierarchicalVariables({ datasetId : dsId })
    }
})

app.factory('createHVL', function(HierarchicalVariablesList) {
    'use strict'

    return function(hierarchicalVariables) {
        var hvl = HierarchicalVariablesList.create({
            hierarchicalVariables : hierarchicalVariables
        })

        //Make variable accordion draggable
        hvl.applyBehaviors({
            linkable : true,
            clickable : true
        })

        return hvl
    }
})

function AppCtrl($scope, signin, setCurrentDataset, fetchDatasetVariables, createHVL) {
    'use strict'
    signin.apply(this, window.secrets.credentials)
    .then(function() {
        return setCurrentDataset(window.secrets.dataset)
    })
    .then(function(dataset) {
        return fetchDatasetVariables(dataset.self)
    })
    .then(function(variables) {
        $scope.hierarchicalVariablesList = createHVL(variables)
    })
}

app.controller('AppCtrl', AppCtrl)
