describe('Drawer Panel Directive', function () {
    var element,
        scope;

    beforeEach(module('app-framework.directives.drawer-panel'));
    beforeEach(inject(function ($rootScope, $compile) {
        var html = '<af-drawer-panel af-component-id="drawer">' +
                       '<af-nav-drawer></af-nav-drawer>' +
                   '</af-nav-drawer>';

        scope = $rootScope.$new();
        element = $compile(html)(scope);
    }));

    it('should add a hamburger button', function () {
        var hamburgerButton = element[0].querySelector('button.hamburger');
        expect(hamburgerButton).not.toBe(null);
    });

    it('should toggle an open class on the hamburger button and nav-drawer when nav drawer is toggled', function () {
        var hamburgerButton = element[0].querySelector('button.hamburger');
        var navDrawer = element[0].querySelector('af-nav-drawer');

        scope.vm.toggleDrawer();
        scope.$digest();

        expect(hamburgerButton.classList.contains('open')).toBe(true);
        expect(navDrawer.classList.contains('open')).toBe(true);

        scope.vm.toggleDrawer();
        scope.$digest();

        expect(hamburgerButton.classList.contains('open')).toBe(false);
        expect(navDrawer.classList.contains('open')).toBe(false);
    });

    it('should toggle the scrim when the nav drawer is toggled', function () {
        var scrim = element[0].querySelector('af-scrim');

        scope.vm.toggleDrawer();
        scope.$digest();

        expect(scrim.classList.contains('show')).toBe(true);

        scope.vm.toggleDrawer();
        scope.$digest();

        expect(scrim.classList.contains('show')).toBe(false);
    });

    it('should be added to the $afComponentRegistry when it is created', inject(function ($afComponentRegistry) {
        var instance = $afComponentRegistry.get('drawer');
        expect(instance.$$afHandle).toEqual('drawer');
    }));

    it('should be removed from the $afComponentRegistry when it is destroyed', inject(function ($afComponentRegistry) {
        scope.vm.destroy();
        expect($afComponentRegistry.get('drawer')).toBe(null);
    }));
});

describe('Drawer Panel Service', function () {
    var scope,
        element,
        drawerPanel;

    beforeEach(module('app-framework.directives.drawer-panel'));
    beforeEach(inject(function ($rootScope, $compile, $afDrawerPanel) {
        var html = '<af-drawer-panel af-component-id="drawer">' +
                       '<af-nav-drawer></af-nav-drawer>' +
                   '</af-nav-drawer>';

        scope = $rootScope.$new();
        element = $compile(html)(scope);
        drawerPanel = $afDrawerPanel;
    }));

    it('should have a drawerPanel service defined', function () {
        expect(drawerPanel).toBeDefined();
    });

    it('should toggle a drawer panel when toggle is called', function () {
        drawerPanel('drawer').toggle();
        expect(scope.open).toBe(true);

        drawerPanel('drawer').toggle();
        expect(scope.open).toBe(false);
    });
});
