angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($scope, Templates, EDIML, Datasources) {
        $scope.ediml = EDIML.ediml;
        $scope.template = {};
        $scope.error = {};
        $scope.language = "it";
        $scope.settings = {
            metadataLanguage: Datasources.metadataLanguage
        };
        $scope.$watch("settings.metadataLanguage", function(newVal, oldVal, scope) {
            console.log("refresh all datasources");
            Datasources.metadataLanguage = newVal;
            Datasources.refreshAll();
        });
        $scope.datasources = Datasources.datasources;
        $scope.endpointTypes = Datasources.endpointTypes;

        $scope.getData = function(datasource) {
            return Datasources.getData(datasource);
        };

        $scope.info_md = "ciao";
        $scope.naomi = {name: 'Naomi', address: '1600 Amphitheatre'};
        $scope.vojta = {name: 'Vojta', address: '3456 Somewhere Else'};
        $scope.people = [$scope.naomi, $scope.vojta];

        Templates.load("RNDT_dataset", "4.00")
            .then(function (data) {
                $scope.template = data;
            })
            .catch(function (data) {
                $scope.error = data;
            })
    });