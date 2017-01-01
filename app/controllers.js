angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($scope, $http, Templates, EDIML, Datasources) {
        $scope.ediml = EDIML.ediml;
        $scope.isOpen = false;
        $scope.template = {};
        $scope.error = {};
        $scope.language = "it";
        var _selected;

        $scope.selected = undefined;

        $scope.settings = {
            metadataLanguage: Datasources.metadataLanguage
        };
        $scope.$watch("settings.metadataLanguage", function(newVal, oldVal, scope) {
            console.log("refresh all datasources");
            Datasources.metadataLanguage = newVal;
            Datasources.refreshAll();
        });
        $scope.datasources = Datasources.datasources;
        $scope.datasourceInstances = Datasources.datasourceInstances;
        $scope.endpointTypes = Datasources.endpointTypes;

        $scope.getComboData = function(itemId, datasource) {
            console.log("getComboData(" + itemId + ", " + datasource + ")");
            return Datasources.getData(itemId, datasource);
        };
        $scope.duplicate = function(e) {
            alert(JSON.stringify(e));
        };
        $scope.getAutocompletion = function(itemId, datasource, val) {
            console.log("autocompletion: " + itemId, " - " + datasource + " - " + val);
            return Datasources.getData(itemId, datasource, val);
/*
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function(response){
                return response.data.results.map(function(item){
                    return item.formatted_address;
                });
            });
*/
        };
        $scope.test = function(itemId, datasource, val) {
            console.log("test: " + itemId, " - " + datasource + " - " + val);
        };

        Templates.load("RNDT_dataset", "4.00")
            .then(function (data) {
                $scope.template = data;
            })
            .catch(function (data) {
                $scope.error = data;
            })
    });