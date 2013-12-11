/*chrome.management.getAll(
        function(info){
                console.log(info);
        }
);*/
var easyext = angular.module('easyext', ['ngRoute']);

easyext.factory('Groups', function(){
        var groups = [];
        return {
                add: function(name) {
                        groups.push(name);
                }
        }
});
easyext.config(function($routeProvider){
        $routeProvider
           .when('/', {
                   controller: 'GroupsCtrl',
                   templateUrl:'groups.html'
           })
           .otherwise({
                   redirectTo: '/'
           });
});

easyext.controller('GroupsCtrl', function($scope) {
        $scope.groups = [];      
});

easyext.controller('ExtensionsCtrl', function ($scope) {
        $scope.extensions = [];
        chrome.management.getAll(
                function(info){
                        $scope.$apply(function(){
                                $scope.extensions = info;
                        });
                        console.log(info);
                }
        );
});