// IIFE - to manage CustomerSupplier web service call the REST service
(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("customerSupplierResource",
                ["$resource",
                 "appSettings",
                    customerSupplierResource])

    function customerSupplierResource($resource, appSettings) {
        return $resource(appSettings.serverPath + "/api/customerSupplier/:id", null, {
            'update': {method: 'PUT'}
        });
    }
}());
