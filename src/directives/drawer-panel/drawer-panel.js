angular.module('app-framework.directives.drawer-panel', [
    'app-framework.services.component-registry'
])
    .directive('afDrawerPanel', afDrawerPanel)
    .factory('$afDrawerPanel', drawerPanel);

afDrawerPanel.$inject = ['$afComponentRegistry'];

function afDrawerPanel($afComponentRegistry) {
    DrawerPanelController.$inject = ['$scope', '$element', '$attrs'];

    function DrawerPanelController($scope, $element, $attrs) {
        var vm = this;

        $scope.open = false;

        vm.toggleDrawer = function () {
            $scope.open = !$scope.open;
            $element.find('af-nav-drawer').toggleClass('open');
        };

        vm.destroy = $afComponentRegistry.register(vm, $attrs.afComponentId);
    }

    var directive = {
        restrict: 'AE',
        transclude: true,
        template: '<button class="hamburger" type="button" role="button" aria-label="Toggle Navigation" style="position: fixed; z-index: 1006; height: 60px;" ng-class="{ \'open\': open }" ng-click="vm.toggleDrawer()">' +
                      '<span class="lines"></span>' +
                  '</button>' +
                  '<ng-transclude></ng-transclude>' +
                  '<af-scrim ng-class="{ \'show\': open }" ng-click="vm.toggleDrawer()"></af-scrim>',
        controller: DrawerPanelController,
        controllerAs: 'vm'
    };

    return directive;
}

drawerPanel.$inject = ['$afComponentRegistry'];

function drawerPanel($afComponentRegistry) {
    return function (handle) {
        var instance = $afComponentRegistry.get(handle);
        var service = {
            toggle: toggle
        };

        return service;

        function toggle() {
            return instance && instance.toggleDrawer();
        }
    };
}
