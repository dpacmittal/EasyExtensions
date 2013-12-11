/*chrome.management.getAll(
        function(info){
                console.log(info);
        }
);*/
var easyext = angular.module('easyext', []);
/*
easyextModule.factory('Groups', function(){
        
});*/
/*
easyext.config(function($routes){
        $routes
           .when('/', {
                   controller: 'GroupsCtrl',
                   templateUrl:'groups.html'
           })
           .otherwise({
                   redirectTo: '/'
           });
});
*/
easyext.controller('GroupsCtrl', function($scope) {
        $scope.groups = [];      
});