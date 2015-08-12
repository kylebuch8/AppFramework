describe('Component Registry Factory', function () {
    var instance,
        afComponentRegistry;

    beforeEach(module('app-framework.services.component-registry'));
    beforeEach(inject(function ($afComponentRegistry) {
        afComponentRegistry = $afComponentRegistry;
        instance = afComponentRegistry.register({}, 'component');
    }));

    it('should register an instance', function () {
        expect(instance).toBeTruthy();
        expect(afComponentRegistry.getInstances().length).toBe(1);
    });

    it('should deregister an instance', function () {
        instance();
        expect(afComponentRegistry.getInstances().length).toBe(0);
    });

});
