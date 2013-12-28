var easyext = angular.module('easyext', ['ngRoute', 'ngGrid']);

easyext.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'GroupsCtrl',
            templateUrl: 'main.html',
            resolve: {
                GroupsData: function (Groups) {
                    return Groups.refreshData().then(function (data) {
                        return data;
                    });
                },
                ExtData: function (Extensions) {
                    return Extensions.getExtensions().then(function (data) {
                        return data;
                    });
                }
            }
        })
        .when('/group/:groupname', {
            controller: 'GroupsCtrl',
            templateUrl: 'groups.html',
            resolve: {
                GroupsData: function (Groups) {
                    return Groups.refreshData().then(function (data) {
                        return data;
                    });
                },
                ExtData: function (Extensions) {
                    return Extensions.getExtensions().then(function (data) {
                        return data;
                    });
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });


});
easyext.config([
    '$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);


easyext.factory('Groups', function ($q, $rootScope) {

    var obj = {
        groups: {},
        add: function (group_name) {
            this.groups[group_name] = [];
            chrome.storage.sync.set(this.groups);
            console.log(this);
        },
        removeByName: function (name) {
            delete this.groups[name];
        },
        returnGroups: function () {
            return this.groups;
        },
        addSelectedExtensions: function (name, extensions) {
            var shrunk_extensions = [];
            for (var i = 0; i < extensions.length; i++) {
                shrunk_extensions.push(extensions[i].id);
            }
            this.groups[name] = _.union(this.groups[name], angular.copy(shrunk_extensions));
            chrome.storage.sync.set(this.groups);
        },
        addExtension: function (name, extension) {
            this.groups[name].push(extension);
        },
        refreshData: function () {
            var deferred = $q.defer();
            chrome.storage.sync.get(null, function (ob) {
                var grps = ob;
                this.groups = ob;
                $rootScope.$apply(function () {
                    deferred.resolve(ob);
                });
            });
            return deferred.promise;
        },
        loga: function () {
            console.log(this);
        }
    }
    /*obj.refreshData().then(function(grps){
     obj.groups = grps;
     });*/
    //console.log(obj);


    //obj.promise = obj.refreshData();
    return obj;
});
easyext.factory('Extensions', function ($q, $rootScope) {
    var extensions;
    var obj = {
        getExtensions: function () {
            var deferred = $q.defer();
            chrome.management.getAll(function (info) {
                extensions = info;
                console.log(info);
                $rootScope.$apply(function () {
                    deferred.resolve(info);
                });
            });
            return deferred.promise;
        }
    }
    return obj;
});

easyext.controller('GroupsCtrl', ['$scope', 'Groups', 'Extensions', '$routeParams', 'GroupsData', 'ExtData', function ($scope, Groups, Extensions, $routeParams, GroupsData, ExtData) {
    /*Groups.refreshData().then(function(data){
     Groups.groups = data;
     })
     Extensions.getExtensions().then(function(data){
     $scope.extensions = data;
     console.log($scope);
     });*/
    Groups.groups = GroupsData;
    $scope.extensions = ExtData;
    $scope.Groups = Groups;
    $scope.params = $routeParams;
    console.log("Ctrl", $scope);

    for (var i = 0; i < $scope.extensions.length; i++) {
        if (!$scope.params.hasOwnProperty('groupname'))
            break;
        for (var j = 0; j < $scope.Groups.groups[$scope.params.groupname].length; j++) {
            if ($scope.extensions[i].id == $scope.Groups.groups[$scope.params.groupname][j]) {

                //Dont splice. Take selected extensions, add extra property to them called selected: true. Sort the whole array by selected.
                $scope.extensions[i].sel = "a";
                console.log($scope.extensions[i]);
            }
            else {
                if (!$scope.extensions[i].hasOwnProperty('sel'))
                    $scope.extensions[i].sel = "b";
            }
        }
    }

    var sortedExtensions = _.sortBy($scope.extensions, function (extension) {
        //console.log(extension);
        return [extension.sel, extension.name].join('a');
    });
    console.log("Sorted", sortedExtensions);
    $scope.griddata = sortedExtensions;
    $scope.LogButton = '<button ng-click="mylog(row)">Log</button>';
    $scope.mylog = function (a) {
        console.log(a);
    }
    $scope.mygridOptions = {
        data: 'griddata',
        columnDefs: [
            {field: 'name', displayName: 'Name'},
            {field: 'id', displayName: 'ID'}/*, {displayName: 'Log', cellTemplate: $scope.LogButton}*/
        ],
        showSelectionCheckbox: true,
        selectedItems: [],
        showFilter: true,
        enableSorting: false,
        checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected || (row.entity.sel==\'a\')" /></div>angular.min.js'
    };
    $scope.loggrps = function () {
        console.log($scope);
        Groups.loga();

    }
}]);