function ExtensionsCtrl($scope) {
        $scope.extensions = [];
        chrome.management.getAll(
                function(info){
                        $scope.$apply(function(){
                                $scope.extensions = info;
                        });
                        console.log(info);
                }
        );

}