angular.module('app-framework.services.component-registry', [])
    .factory('$afComponentRegistry', afComponentRegistry);

function afComponentRegistry() {
    var instances = [];
    var service = {
        get: get,
        register: register,
        getInstances: getInstances
    };

    return service;

    function get(handle) {
        var instance,
            i = 0,
            length = instances.length;

        for (i; i < length; i += 1) {
            instance = instances[i];

            if (instance.$$afHandle === handle) {
                return instance;
            }
        }

        return null;
    }

    function register(instance, handle) {
        if (!handle) {
            return angular.noop;
        }

        instance.$$afHandle = handle;
        instances.push(instance);

        return deregister;

        function deregister() {
            var index = instances.indexOf(instance);
            if (index !== -1) {
                instances.splice(index, 1);
            }
        }
    }

    function getInstances() {
        return instances;
    }
}
